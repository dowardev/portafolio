<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ post.title }}</ion-title>
        <ion-buttons slot="end" v-if="isUserAdmin">
          <ion-button fill="clear" @click="updatePost()">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="deletePost()">
            <ion-icon :icon="trashOutline" color="danger"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12">
          <img :src="post.cover" alt="" />
        </ion-col>
      </ion-row>

      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>{{ post.title }}</h1>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col>
          <p class="post-date">Creación del post: {{ post.created }}</p>
          <p class="post-date">
            Ultimá actualización del post: {{ post.updated }}
          </p>
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
  IonButtons,
  IonIcon,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import {
  chevronBackOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import systemService from "../../../services/system.vue";
import eventBus from "../../../EventBus";
import userService from "../../../services/user.vue";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

export default defineComponent({
  name: "PostPage",
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
    return { chevronBackOutline, createOutline, trashOutline };
  },
  data() {
    return {
      postId: this.$route.params.id,
      post: {
        title: "",
        content: "",
        cover: "",
        created: "",
        updated: "",
      },
      isUserAdmin: false,
    };
  },
  mounted() {
    this.getPost();
    this.verifyUserAdmin();
    eventBus().emitter.on("refresh-content", (response: any) => {
      if (response.event == "new-post") {
        this.getPost();
      }
    });
  },
  methods: {
    async getPost() {
      const loading = await systemService().presentLoading(
        "Obteniendo publicación"
      );
      loading.present();

      postService()
        .getPost(this.postId as string)
        .then(async (response) => {
          const title = response.data.post.title;
          const content = response.data.post.content;
          const coverName = response.data.post.cover.name;
          const cover = await postService().getImage({ name: coverName });
          const created = utcToZonedTime(
            new Date(response.data.post.created_at + "Z"),
            "America/Chihuahua"
          );
          const postCreated = format(created, "P");
          const updated = utcToZonedTime(
            new Date(response.data.post.updated_at + "Z"),
            "America/Chihuahua"
          );
          const postUpdated = format(updated, "P");

          this.setData({
            title,
            content,
            cover: cover.data.getImage.image[0].source,
            created: postCreated,
            updated: postUpdated,
          });
          loading.dismiss();
        })
        .catch((e) => {
          loading.dismiss();
        });
    },
    setData(data: {
      title: string;
      content: string;
      cover: string;
      created: string;
      updated: string;
    }) {
      this.post.title = data.title;
      this.post.content = data.content;
      this.post.cover = "data:image/png;base64," + data.cover;
      this.post.created = data.created;
      this.post.updated = data.updated;
    },
    updatePost() {
      this.$router.push("/blog/editor/update/" + this.postId);
    },
    async deletePost() {
      const loading = await systemService().presentLoading(
        "Eliminando publicación"
      );
      loading.present();

      postService()
        .deletePost(this.postId as string)
        .then((response) => {
          loading.dismiss();
          this.$router.push("/blog");
        })
        .catch((e) => {
          loading.dismiss();
          console.log(e);
        });
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

<style scoped>
.post-date {
  font-size: 12px;
}
</style>
