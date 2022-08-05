<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @uploadImage="uploadImage($event)"
        @save="save($event)"
        :content="content"
        :spinnerSavePost="spinners.savePost"
        :spinnerSaveImage="spinners.saveImage"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { createPost } from "../../../services/post";
import { getUser } from "../../../services/user";
import {
  openToastErrror,
  openToast,
  uploadImage,
  getBaseURL,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import eventBus from "../../../EventBus";
import { CreatePost } from "../../../services/interfaces";
import { UPLOAD_IMAGE, USER_PERMISSIONS } from "../../../services/graphql";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonPage,
    EditorComponent,
  },

  data() {
    return {
      segment: "editor",
      content: "",
      images: Array<string>(),
      spinners: { savePost: false, saveImage: false },
    };
  },

  beforeRouteEnter(to, from, next) {
    getUser({
      graphql: { name: USER_PERMISSIONS, fragment: "UserPermissions" },
    })
      .then((response) => {
        if (response.is_admin) {
          next();
        } else {
          next("/");
        }
      })
      .catch(() => {
        next("/");
      });
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
        this.spinners.savePost = false;
        this.clearInputs();
        openToast({ message: "Post agregado" });
        this.$router.go(-1);
        eventBus().emitter.emit("new-post");
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
  },
});
</script>
