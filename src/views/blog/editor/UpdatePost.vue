<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @uploadImage="uploadImage($event)"
        @save="save($event)"
        :title="title"
        :content="content"
        :cover="cover"
        :spinnerSavePost="spinners.savePost"
        :spinnerSaveImage="spinners.saveImage"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { updatePost } from "../../../services/post";
import {
  openToast,
  openToastErrror,
  uploadImage,
  getBaseURL,
  presentLoading,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import {
  ALL_POSTS_DETAILS,
  POSTS_UPDATE_DETAILS,
  POST_DATES,
  POST_DETAILS,
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
      idPost: this.$route.params.id as string,
      segment: "editor",
      title: "",
      content: "",
      cover: { id: "", name: "", source: "" },
      newImages: Array<string>(),
      images: Array<string>(),
      spinners: { savePost: false, saveImage: false },
    };
  },

  mounted() {
    this.getPost();
  },

  methods: {
    async getPost() {
      const loading = await presentLoading({
        message: "Obteniendo publicación",
      });
      loading.present();

      try {
        await this.usePost.loadPost({
          id: this.idPost,
          graphql: {
            name: POSTS_UPDATE_DETAILS,
            fragment: "PostUpdateDetails",
            refetch: true,
          },
        });

        const post = this.usePost.getPost({
          id: this.idPost,
        })!;
        const title = post.title ? post.title : "";
        const content = post.content ? post.content : "";
        const coverName = post.cover.name ? post.cover.name : "";
        const coverId = post.cover.id ? post.cover.id : "";
        const coverSource = post.cover.source ? post.cover.source : "";

        if (post) {
          this.setData({ title, content, coverId, coverName, coverSource });
        }

        loading.dismiss();
      } catch (e: any) {
        console.error(e);
        loading.dismiss();
        openToastErrror(e);
      }
    },

    setData(data: {
      title: string;
      content: string;
      coverId: string;
      coverName: string;
      coverSource: string;
    }) {
      this.title = data.title;
      this.content = data.content;
      this.cover = {
        id: data.coverId,
        name: data.coverName,
        source: data.coverSource,
      };
      this.getPostImages(data.content);
    },

    async save(data: {
      title: string;
      content: string;
      cover: object;
      newCoverStatus: boolean;
    }) {
      this.spinners.savePost = true;

      const id = this.idPost as string;
      const title = data.title;
      const content = data.content;
      const cover = data.cover;
      const coverId = this.cover.id;
      let newCoverId = "";
      const newCoverStatus = data.newCoverStatus;
      const images = this.newImages;
      const imagesRemoved = this.getRemovedImages(data.content);

      if (newCoverStatus) {
        try {
          const response = await this.uploadCover(cover);
          newCoverId = response as string;
        } catch (e: any) {
          console.error(e);
          this.spinners.savePost = false;
          openToastErrror(e);
          return;
        }
      }

      try {
        await this.updatePost({
          id,
          title,
          content,
          coverId,
          newCoverId,
          images,
          imagesRemoved,
        });
        await this.refreshPostsCotent();
        this.spinners.savePost = false;
        this.$router.go(-1);
        this.clearInputs();
        openToast({ message: "Post actualizado" });
      } catch (e: any) {
        console.error(e);
        this.spinners.savePost = false;
        openToastErrror(e);
      }
    },

    async updatePost(data: {
      id: string;
      title: string;
      content: string;
      coverId: string;
      newCoverId: string;
      images: Array<string>;
      imagesRemoved: Array<string>;
    }): Promise<void> {
      try {
        await updatePost({
          id: data.id,
          title: data.title,
          content: data.content,
          coverId: data.coverId,
          newCoverId: data.newCoverId,
          images: data.images,
          imagesRemoved: data.imagesRemoved,
        });
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

    async uploadCover(image: object): Promise<string | undefined> {
      try {
        const response = await uploadImage({
          graphql: { name: UPLOAD_IMAGE, fragment: "UploadImage" },
          image,
        });
        return response.id;
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
      }
    },

    clearInputs() {
      this.title = "";
      this.content = "";
      this.cover.id = "";
      this.newImages.length = 0;
      (this.$refs.editorRef as any).clearInputs();
    },

    getPostImages(content: string) {
      const imageId = content.match(/\bhttp?:\/\/\S+/gi);
      imageId?.forEach((element) => {
        this.images.push(element);
      });
    },
    getRemovedImages(content: string) {
      const imagesRemoved = Array<string>();
      this.images.forEach((element: string) => {
        if (content.includes(element) == false) {
          imagesRemoved.push(element.split("=")[1]);
        }
      });
      return imagesRemoved;
    },

    async refreshPostsCotent() {
      try {
        await this.usePost.loadPost({
          id: this.idPost,
          graphql: {
            name: POST_DETAILS,
            fragment: "PostDetails",
            refetch: true,
          },
        });
      } catch (e: any) {
        console.error(e);
      }
    },
  },
});
</script>
