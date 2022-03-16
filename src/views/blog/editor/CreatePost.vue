<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @createPost="createPost"
        @uploadCover="uploadCover($event)"
        @uploadImage="uploadImage($event)"
        @setTitle="form.title = $event.title"
        @setContent="form.content = $event.content"
        :cover="coverSource"
        :title="form.title"
        :content="form.content"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, toastController } from "@ionic/vue";
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
      form: {
        title: "",
        content: "",
        coverId: 0,
        images: Array<number>(),
      },
      coverSource: "",
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
    async createPost() {
      const loading = await systemService().presentLoading("Creando post");
      loading.present();
      const title = this.form.title;
      const content = this.form.content;
      const coverId = this.form.coverId;
      const images = this.form.images;

      postService()
        .createPost(title, content, coverId, images)
        .then(() => {
          loading.dismiss();
          eventBus().emitter.emit("refresh-content", { event: "new-post" });
          this.openToast("Publicado correctamente", "success");
          this.clearInputs();
          this.$router.push("/blog");
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un error al publicar", "danger");
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
          this.form.content =
            this.form.content +
            "![Markdown Logo](http://localhost:8000/api/get-image?name=" +
            response.data.data.uploadImage.image[0].name +
            " 'Markdown Tutorial')";
          this.form.images.push(
            parseInt(response.data.data.uploadImage.image[0].id)
          );
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un error al subir la imagen", "danger");
        });
    },
    async uploadCover(e) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = e.image;
      postService()
        .uploadImage(image)
        .then((response) => {
          loading.dismiss();
          this.coverSource =
            "data:image/png;base64," +
            response.data.data.uploadImage.image[0].source;
          this.form.coverId = parseInt(
            response.data.data.uploadImage.image[0].id
          );
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un al subir la portada", "danger");
        });
    },
    async openToast(message: string, color: string) {
      const toast = await toastController.create({
        message,
        duration: 2000,
        color,
      });
      return toast.present();
    },
    clearInputs() {
      this.form.title = "";
      this.form.content = "";
      this.form.coverId = 0;
      this.form.images = Array<number>();
    },
  },
});
</script>
