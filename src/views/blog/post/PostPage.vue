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
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import postService from "../../../services/post.vue";
import {
  chevronBackOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import systemService from "../../../services/system.vue";
import userService from "../../../services/user.vue";
import { utcToZonedTime, format } from "date-fns-tz";

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
  },
  methods: {
    async getPost() {
      const loading = await systemService().presentLoading({
        message: "Obteniendo publicación",
      });
      loading.present();

      const query = `
            title
            content
            created_at
            updated_at
            cover {
              source
            }
      `;
      try {
        const response = await postService().getPost({
          id: this.postId as string,
          query,
        });

        const title = response.title ? response.title : "";
        const content = response.content ? response.content : "";
        const coverSource = response.cover.source ? response.cover.source : "";
        const created = utcToZonedTime(
          new Date(response.created_at + "Z"),
          "America/Chihuahua"
        );

        const postCreated = format(created, "P");
        const updated = utcToZonedTime(
          new Date(response.updated_at + "Z"),
          "America/Chihuahua"
        );
        const postUpdated = format(updated, "P");

        this.setData({
          title,
          content,
          coverSource,
          created: postCreated,
          updated: postUpdated,
        });
        loading.dismiss();
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
        loading.dismiss();
      }
    },
    setData(data: {
      title: string;
      content: string;
      coverSource: string;
      created: string;
      updated: string;
    }) {
      this.post.title = data.title;
      this.post.content = data.content;
      this.post.cover = "data:image/png;base64," + data.coverSource;
      this.post.created = data.created;
      this.post.updated = data.updated;
    },
    updatePost() {
      this.$router.push("/blog/editor/update/" + this.postId);
    },
    async deletePost() {
      const loading = await systemService().presentLoading({
        message: "Eliminando publicación",
      });
      loading.present();

      postService()
        .deletePost({ id: this.postId as string })
        .then(() => {
          loading.dismiss();
          this.$router.push("/blog");
        })
        .catch((e) => {
          loading.dismiss();
          console.error(e);
          systemService().openToastErrror(e);
        });
    },

    async verifyUserAdmin() {
      if (navigator.onLine) {
        try {
          const response = await userService().getUserPermissions();
          this.isUserAdmin = response.admin ? response.admin != null : false;
        } catch (e: any) {
          this.isUserAdmin = false;
          if (e.message == "Unauthorized") return;
          else {
            systemService().openToastErrror(e);
            console.error(e);
          }
        }
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
