<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>Editor</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="createPost()">
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="segment">
          <ion-segment-button value="editor">
            <ion-label>Editor</ion-label>
          </ion-segment-button>
          <ion-segment-button value="result">
            <ion-label>Resultado</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <section v-if="segment == 'editor'">
        <ion-item lines="none" style="--background: transparent">
          <ion-button
            slot="end"
            fill="clear"
            @click="($refs as any).inputImage.click()"
          >
            <ion-icon :icon="imageOutline"></ion-icon>
          </ion-button>
          <input
            accept="image/*"
            type="file"
            @change="uploadImage($event)"
            style="display: none"
            ref="inputImage"
          />
        </ion-item>
        <ion-item>
          <ion-label position="floating">Titulo</ion-label>
          <ion-input v-model="form.title"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Editor</ion-label>
          <ion-textarea
            v-model="form.content"
            auto-grow="true"
            placeholder="Contenido"
          ></ion-textarea>
        </ion-item>
        <ion-item lines="none">
          <ion-button fill="clear" @click="($refs as any).inputCover.click()">
            Portada
          </ion-button>
          <input
            accept="image/*"
            type="file"
            @change="uploadCover($event)"
            style="display: none"
            ref="inputCover"
          />
        </ion-item>
      </section>

      <section v-if="segment == 'result'">
        <ion-row>
          <ion-col size="12">
            <img :src="cover" style="max-width: 32%" />
          </ion-col>
        </ion-row>
        <ion-row>
          <h1 class="ion-padding">{{ form.title }}</h1>
          <ion-col size="12" style="background: #333947; height: 84vh">
            <Markdown :source="form.content" />
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonInput,
  toastController,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import { saveOutline, imageOutline } from "ionicons/icons";
import eventBus from "../../../EventBus";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    Markdown,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonButton,
    IonIcon,
    IonLabel,
    IonRow,
    IonCol,
  },
  setup() {
    return { saveOutline, imageOutline };
  },
  data() {
    return {
      segment: "editor",
      form: {
        title: "Titulo de prueba",
        content: "Contenido de prueba",
        coverId: 0,
        images: Array<number>(),
      },
      cover: "",
      userLogged: false,
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
      });
  },
  methods: {
    setContent(e: any) {
      this.form.content = e.target.innerText;
    },
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
          console.log(e);
          this.openToast("Ocurrió un error al publicar", "danger");
        });
    },

    getImage(e: any) {
      const file = e.target.files[0];
      return file;
      // const reader = new FileReader();
      // reader.onload = (e: any) => {
      // const fileData = e.target.result;
      // };
      // reader.readAsDataURL(file);
    },
    async uploadImage(e: any) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = this.getImage(e);

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
          console.log(e);
          this.openToast("Ocurrió un error al subir la imagen", "danger");
        });
    },
    async uploadCover(e: any) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = this.getImage(e);
      postService()
        .uploadImage(image)
        .then((response) => {
          loading.dismiss();
          this.cover =
            "data:image/png;base64," +
            response.data.data.uploadImage.image[0].source;
          this.form.coverId = parseInt(
            response.data.data.uploadImage.image[0].id
          );
        })
        .catch((e) => {
          loading.dismiss();
          console.log(e);
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
