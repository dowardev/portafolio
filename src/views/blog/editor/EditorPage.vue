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
          <h1 class="ion-padding">{{ form.title }}</h1>
          <ion-col size="12" style="background: #333947; height: 84vh">
            <Markdown :source="form.content" />
          </ion-col>
          <ion-col size="12">
            <h3>Portada</h3>
            <img :src="cover" style="max-width: 32%" />
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
import { defineComponent, ref } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import { saveOutline, imageOutline } from "ionicons/icons";

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
    };
  },
  methods: {
    setContent(e: any) {
      this.form.content = e.target.innerText;
    },
    createPost() {
      postService()
        .createPost(this.form)
        .then((response) => {
          this.openToast("Publicado correctamente", "success");
        })
        .catch((e) => {
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
    uploadImage(e: any) {
      const image = this.getImage(e);
      const uploadFormData = new FormData();
      uploadFormData.append("image", image, "sss");
      postService()
        .uploadImage(uploadFormData)
        .then((response) => {
          this.form.content =
            this.form.content +
            "![Markdown Logo](http://localhost:8000/api/get-image?name=" +
            response.data.name +
            " 'Markdown Tutorial')";
          this.form.images.push(response.data.id);
        })
        .catch((e) => {
          this.openToast("Ocurrió un error al subir la imagen", "danger");
        });
    },
    uploadCover(e: any) {
      const image = this.getImage(e);
      const uploadFormData = new FormData();
      uploadFormData.append("image", image, "sss");
      postService()
        .uploadImage(uploadFormData)
        .then((response) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileData = e.target.result;
            this.cover = fileData;
            this.form.coverId = response.data.id;
          };
          reader.readAsDataURL(image);
        })
        .catch((e) => {
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
  },
});
</script>
