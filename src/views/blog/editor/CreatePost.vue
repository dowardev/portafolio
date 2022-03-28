<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @uploadImage="uploadImage($event)"
        @save="save($event)"
        :content="content"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";
import EditorComponent from "./EditorPage.vue";
import eventBus from "../../../EventBus";

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
    };
  },
  beforeRouteEnter(to, from, next) {
    userService()
      .getUserPermissions()
      .then((response) => {
        if (response.admin) {
          next();
        } else {
          next("/blog");
        }
      })
      .catch((e) => {
        next("/blog");
      });
  },
  methods: {
    async save(data: { title: string; content: string; cover: object }) {
      const loading = await systemService().presentLoading("Creando post");
      loading.present();

      const title = data.title;
      const content = data.content;
      const cover = data.cover;
      let coverId = "";
      const images = this.images;

      const uploadCover = await this.uploadCover(cover)
        .then((response) => {
          coverId = response;
          return true;
        })
        .catch((e) => {
          console.log(e);
          systemService().openToast({
            message: "Ocurrió un problema",
            color: "danger",
          });
          return false;
        });

      if (uploadCover == false) {
        loading.dismiss();
        return;
      }

      this.createPost({ title, content, coverId, images })
        .then(() => {
          loading.dismiss();
          eventBus().emitter.emit("refresh-content", { event: "new-post" });
          this.clearInputs();
          this.$router.push("/blog");
          systemService().openToast({
            message: "Publicado correctamente",
            color: "success",
          });
        })
        .catch((e) => {
          console.log(e);
          systemService().openToast({
            message: "Ocurrió un problema",
            color: "danger",
          });
        });
    },

    async createPost(data: {
      title: string;
      content: string;
      coverId: string;
      images: Array<string>;
    }) {
      return new Promise((resolve, reject) => {
        postService()
          .createPost(data.title, data.content, data.coverId, data.images)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },

    async uploadImage(e: any) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = e.image;

      postService()
        .uploadImage(image)
        .then((response) => {
          loading.dismiss();
          const imageName = response.data.data.uploadImage.image[0].name;

          this.content =
            "![" +
            imageName +
            "](http://localhost:8000/api/get-image?name=" +
            imageName +
            " '" +
            imageName +
            "')";

          this.images.push(response.data.data.uploadImage.image[0].id);
        })
        .catch((e) => {
          console.log(e);
          loading.dismiss();
          systemService().openToast({
            message: "Ocurrió un error al subir la imagen",
            color: "danger",
          });
        });
    },
    async uploadCover(image: object): Promise<string> {
      return new Promise((resolve, reject) => {
        postService()
          .uploadImage(image)
          .then((response) => {
            resolve(response.data.data.uploadImage.image[0].id);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    clearInputs() {
      (this.$refs.editorRef as any).clearInputs();
    },
  },
});
</script>
