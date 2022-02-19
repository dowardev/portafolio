<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ post.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12">
          <img :src="post.cover" alt="" />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12" style="background: #333947; height: 84vh">
          <Markdown :source="post.content" />
        </ion-col>
      </ion-row>
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
  loadingController,
  IonButtons,
  IonIcon,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import { saveOutline, chevronBackOutline } from "ionicons/icons";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    Markdown,
    IonButtons,
    IonIcon,
    IonRow,
    IonCol,
  },
  setup() {
    return { saveOutline, chevronBackOutline };
  },
  data() {
    return {
      post: {
        title: "",
        content: "",
        cover: "",
      },
    };
  },
  mounted() {
    this.getPost();
  },
  methods: {
    async getPost() {
      const loading = await this.presentLoading("Obteniendo publicación");
      loading.present();

      postService()
        .getPost(this.$route.params.id as string)
        .then((response) => {
          loading.dismiss();
          this.post.title = response.data.title;
          this.post.content = response.data.content;
          this.post.cover =
            "http://localhost:8000/api/get-image?name=" + response.data.cover;
        })
        .catch((e) => {
          loading.dismiss();
        });
    },
    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "ionic-elements ",
        message,
      });

      return loading;
    },
  },
});
</script>
