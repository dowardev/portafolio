<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        :spinner-save-post="spinners.savePost"
        :content="content"
        :spinner-save-image="spinners.saveImage"
        @upload-image="uploadImage($event)"
        @save="save($event)"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { createPost } from "../../../services/post";
import {
  openToastErrror,
  openToast,
  uploadImage,
  getBaseURL,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import { CreatePost } from "../../../services/interfaces";
import {
  ALL_POSTS_DETAILS,
  POST_DATES,
  UPLOAD_IMAGE,
} from "../../../services/graphql";
import { usePost } from "../../../composables/usePost";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonPage,
    EditorComponent,
  },

  setup() {
    return { usePost: usePost() };
  },

  data() {
    return {
      segment: "editor",
      content: "",
      images: Array<string>(),
      spinners: { savePost: false, saveImage: false },
    };
  },

  methods: {
    async save(data: { title: string; content: string; cover: object }) {
      this.spinners.savePost = true;

      const title = data.title;
      const content = data.content;
      const cover = data.cover;
      let coverId = "";
      const images = this.images;

      try {
        const response = await this.uploadCover(cover);
        coverId = response;
      } catch (e: any) {
        console.error(e);
        this.spinners.savePost = false;
        openToastErrror(e);
        return;
      }

      try {
        await this.createPost({
          title,
          content,
          coverId,
          images,
        });
        await this.refreshPostsCotent();
        this.clearInputs();
        this.spinners.savePost = false;
        this.$router.go(-1);
        openToast({ message: "Post agregado" });
      } catch (e: any) {
        console.error(e);
        this.spinners.savePost = false;
        openToastErrror(e);
      }
    },

    async createPost({
      title,
      content,
      coverId,
      images,
    }: CreatePost): Promise<void> {
      try {
        await createPost({
          title,
          content,
          coverId,
          images,
        });
        return;
      } catch (e: any) {
        throw new Error(e);
      }
    },

    async uploadImage(e: any) {
      this.spinners.saveImage = true;
      const image = e.image.file;

      try {
        const response = await uploadImage({
          graphql: { name: UPLOAD_IMAGE, fragment: "UploadImage" },
          image,
        });

        const imageName = response.name;
        this.spinners.saveImage = false;

        const api = getBaseURL() + "api/get-image-posts?name=" + imageName;
        this.content =
          '<div class="center"><img src="' +
          api +
          '" style="width:80%"/></div>';

        if (response.id) this.images.push(response.id);
      } catch (e: any) {
        console.error(e);
        this.spinners.saveImage = false;
        openToastErrror(e);
      }
    },

    async uploadCover(image: object): Promise<string> {
      try {
        const response = await uploadImage({
          image,
          graphql: { name: UPLOAD_IMAGE, fragment: "UploadImage" },
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response.id!;
      } catch (e: any) {
        throw new Error(e);
      }
    },

    clearInputs() {
      (this.$refs.editorRef as any).clearInputs();
    },

    async refreshPostsCotent() {
      const currentPage = this.usePost.getCurrentPage()!;
      if (currentPage == "") return;

      try {
        await this.usePost.loadDates({
          graphql: { name: POST_DATES, fragment: "PostDates", refetch: true },
        });
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
        throw e;
      }

      try {
        await this.usePost.loadPosts({
          date: currentPage,
          graphql: {
            name: ALL_POSTS_DETAILS,
            fragment: "PostsDetails",
            refetch: true,
          },
        });
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
        throw e;
      }
    },
  },
});
</script>
