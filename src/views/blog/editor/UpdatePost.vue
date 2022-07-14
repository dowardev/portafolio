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
import { getPost, updatePost } from "../../../services/post";
import { getUser } from "../../../services/user";
import {
  openToast,
  openToastErrror,
  uploadImage,
  getBaseURL,
  presentLoading,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import eventBus from "../../../EventBus";
import {
  POSTS_UPDATE_DETAILS,
  UPLOAD_IMAGE,
  USER_PERMISSIONS,
} from "../../../services/graphql";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonPage,
    EditorComponent,
  },

  data() {
    return {
      idPost: this.$route.params.id,
      segment: "editor",
      title: "",
      content: "",
      cover: { id: "", name: "", source: "" },
      newImages: Array<string>(),
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
        const response = await getPost({
          id: this.idPost as string,
          graphql: {
            name: POSTS_UPDATE_DETAILS,
            fragment: "PostUpdateDetails",
          },
        });
        const title = response.title ? response.title : "";
        const content = response.content ? response.content : "";
        const coverName = response.cover.name ? response.cover.name : "";
        const coverId = response.cover.id ? response.cover.id : "";
        const coverSource = response.cover.source ? response.cover.source : "";

        if (response) {
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
        this.updatePost({
          id,
          title,
          content,
          coverId,
          newCoverId,
          images,
          imagesRemoved,
        });
        this.spinners.savePost = false;
        this.clearInputs();
        openToast({ message: "Post actualizado" });
        this.$router.go(-1);
        eventBus().emitter.emit("update-post");
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
        updatePost({
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
  },
});
</script>
