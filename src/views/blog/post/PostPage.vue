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
        <ion-col size="12" style="height: 84vh">
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
import systemService from "../../../services/system.vue";

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
      const loading = await systemService().presentLoading(
        "Obteniendo publicación"
      );
      loading.present();

      postService()
        .getPost(this.$route.params.id as string)
        .then(async (response) => {
          const title = response.data.post.title;
          const content = response.data.post.content;
          const coverName = response.data.post.cover.name;
          const cover = await postService().getImage({ name: coverName });
          this.showPost(title, content, cover.data.getImage.image[0].source);
          loading.dismiss();
        })
        .catch((e) => {
          loading.dismiss();
        });
    },
    showPost(title: string, content: string, cover: string) {
      this.post.title = title;
      this.post.content = content;
      this.post.cover = "data:image/png;base64," + cover;
    },
  },
});
</script>
