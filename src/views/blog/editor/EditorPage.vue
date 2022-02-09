<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
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
      </section>

      <section v-if="segment == 'result'">
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
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import { saveOutline } from "ionicons/icons";

export default defineComponent({
  name: "HomePage",
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
  },
  setup() {
    return { saveOutline };
  },
  data() {
    return {
      segment: "editor",
      form: {
        title: "Titulo de prueba",
        content: "Contenido de prueba",
      },
    };
  },
  methods: {
    setContent(e: any) {
      this.form.content = e.target.innerText;
    },
    createPost() {
      postService().createPost(this.form);
    },
  },
});
</script>
