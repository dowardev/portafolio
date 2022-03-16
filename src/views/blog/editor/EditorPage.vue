<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
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

    <ion-content>
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
          <ion-input
            :value="title"
            @ionChange="setTitle($event.detail.value)"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Editor</ion-label>
          <ion-textarea
            :value="content"
            auto-grow="true"
            placeholder="Contenido"
            @ionChange="setContent($event.detail.value)"
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
          <h1 class="ion-padding">{{ title }}</h1>
          <ion-col size="12" style="background: #333947; height: 84vh">
            <Markdown :source="content" />
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
  IonButtons,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import { saveOutline, imageOutline, chevronBackOutline } from "ionicons/icons";
import userService from "../../../services/user.vue";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    Markdown,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonInput,
    IonButtons,
    IonItem,
    IonButton,
    IonIcon,
    IonLabel,
    IonRow,
    IonCol,
    IonPage,
  },
  props: {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    cover: {
      type: String,
    },
  },
  setup() {
    return { saveOutline, imageOutline, chevronBackOutline };
  },
  data() {
    return {
      segment: "editor",
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
    createPost() {
      this.$emit("createPost");
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
      const image = this.getImage(e);
      this.$emit("uploadImage", { image });
    },
    async uploadCover(e: any) {
      const image = this.getImage(e);
      this.$emit("uploadCover", { image });
    },
    setTitle(e: string) {
      this.$emit("setTitle", { title: e });
    },
    setContent(e: string) {
      this.$emit("setContent", { content: e });
    },
  },
});
</script>
