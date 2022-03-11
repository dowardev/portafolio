<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>Blog</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push('/blog/editor')" v-if="isUserAdmin">
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
        <ion-col size="12" size-lg="4" v-for="post in posts" :key="post">
          <ion-card @click="openPost(post.id)" style="cursor: pointer">
            <img :src="post.cover" alt="" />
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
  IonButton,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import { refreshOutline, addOutline } from "ionicons/icons";
import userService from "../../../services/user.vue";
import eventBus from "../../../EventBus";
import systemService from "../../../services/system.vue";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonRow,
    IonCol,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonIcon,
  },
  setup() {
    return { refreshOutline, addOutline };
  },
  data() {
    return { posts: Array<any>(), isUserAdmin: false };
  },
  mounted() {
    this.getPosts();
    eventBus().emitter.on("refresh-content", (response: any) => {
      if (response.event == "new-post") {
        this.getPosts();
      }
    });
    eventBus().emitter.on("refresh-user-content", (response: any) => {
      this.verifyUserAdmin();
    });
    this.verifyUserAdmin();
  },
  methods: {
    async getPosts() {
      const loading = await systemService().presentLoading(
        "Obteniendo publicaciónes"
      );
      loading.present();

      postService()
        .getPosts(10, 1)
        .then((response: any) => {
          loading.dismiss();
          this.showPost(response.data.posts.data);
        })
        .catch((e) => {
          loading.dismiss();
        });
    },
    showPost(posts: Array<any>) {
      posts.forEach((post) => {
        post.cover =
          "http://localhost:8000/api/get-image?name=" + post.cover.name;
      });
      this.posts = posts;
    },
    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },
    verifyUserAdmin() {
      if (navigator.onLine) {
        userService()
          .getUserPermissions()
          .then((response) => {
            this.isUserAdmin = response.admin ? response.admin != null : false;
          })
          .catch((e) => {
            this.isUserAdmin = false;
          });
      }
    },
  },
});
</script>
