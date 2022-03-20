<template>
  <ion-page>
    <ion-header
      collapse="fade"
      :translucent="true"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>Blog</ion-title>
        <ion-buttons slot="end">
          <ion-button
            @click="$router.push('/blog/editor/create')"
            v-if="isUserAdmin"
          >
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
          <ion-button @click="getPosts()">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>Blog</h1>
        </ion-toolbar>
      </ion-header>

      <ion-row v-for="(post, index) in posts" :key="post">
        <ion-col size="4">
          <img
            :src="post.cover"
            alt=""
            @click="openPost(post.id)"
            style="cursor: pointer"
          />
        </ion-col>
        <ion-col size="8">
          <h2
            style="margin-top: 4px; cursor: pointer"
            @click="openPost(post.id)"
          >
            {{ post.title }}
          </h2>
        </ion-col>
        <ion-col size="12" v-if="isUserAdmin">
          <ion-button fill="clear" @click="updatePost(post.id)">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="deletePost(post.id, index)">
            <ion-icon :icon="trashOutline" color="danger"></ion-icon>
          </ion-button>
        </ion-col>
        <hr />
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
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import {
  refreshOutline,
  addOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
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
    IonIcon,
  },
  setup() {
    return { refreshOutline, addOutline, createOutline, trashOutline };
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
    updatePost(id: string) {
      this.$router.push("/blog/editor/update/" + id);
    },
    async deletePost(id: string, index: number) {
      const loading = await systemService().presentLoading(
        "Eliminando publicación"
      );
      loading.present();

      postService()
        .deletePost(id)
        .then((response) => {
          loading.dismiss();
          this.posts.splice(index, 1);
        })
        .catch((e) => {
          loading.dismiss();
          console.log(e);
        });
    },
  },
});
</script>

<style>
/* hr.style-five { */
/*   border: 0; */
/*   height: 0; 
*/
/*   box-shadow: 0 0 10px 1px #353535; */
/* } */
hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(32, 31, 31, 0.75),
    rgba(0, 0, 0, 0)
  );
  width: 100%;
  margin-bottom: 16px;
}
</style>
