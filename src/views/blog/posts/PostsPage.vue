<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-title>Blog</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push('/blog/editor')" v-if="userLogged">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
          <ion-button @click="getPosts()">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12" size-lg="6" v-for="post in posts" :key="post">
          <ion-card @click="openPost(post.id)">
            <ion-card-header>
              <ion-card-title>{{ post.title }}</ion-card-title>
            </ion-card-header>
          </ion-card>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import { refreshOutline, addOutline } from "ionicons/icons";
import userService from "../../../services/user.vue";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    return { refreshOutline, addOutline };
  },
  data() {
    return { posts: Array<any>(), userLogged: false };
  },
  mounted() {
    this.getPosts();
    this.getUserLogged();
  },
  methods: {
    async getPosts() {
      const loading = await this.presentLoading("Obteniendo publicaciónes");
      loading.present();

      postService()
        .getPosts()
        .then((response: any) => {
          loading.dismiss();
          this.posts = response.data;
        })
        .catch(() => {
          loading.dismiss();
        });
    },
    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },
    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "loadingClass ",
        message,
      });

      return loading;
    },
    async getUserLogged() {
      const user = await userService().getUserLogged();
      if (user.data) {
        this.userLogged = true;
      }
    },
  },
});
</script>
