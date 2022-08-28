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
        <ion-title
          v-if="usePost.getPost({ id: postId as string })! != undefined"
        >
          {{ usePost.getPost({ id: postId })!.title }}
        </ion-title>
        <ion-buttons
          v-if="useUser.user.value.isAdmin"
          slot="end"
          :collapse="true"
        >
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
      <section v-if="usePost.getPost({ id: postId }) != undefined">
        <ion-row>
          <ion-col size="12">
            <img :src="usePost.getPost({ id: postId })!.cover.source" alt="" />
          </ion-col>
        </ion-row>

        <ion-header collapse="condense" mode="ios">
          <ion-toolbar>
            <h1 class="ion-padding-start">
              {{ usePost.getPost({ id: postId })!.title }}
            </h1>
            <ion-buttons
              v-if="useUser.user.value.isAdmin"
              slot="end"
              :collapse="true"
            >
              <ion-button
                fill="clear"
                :disabaled="spinners.buttonUpdate == true"
                @click="updatePost()"
              >
                <ion-icon
                  v-if="spinners.buttonUpdate == false"
                  :icon="createOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.buttonUpdate == true"
                  name="crescent"
                ></ion-spinner>
              </ion-button>

              <ion-button
                fill="clear"
                :disabaled="spinners.buttonDelete == true"
                @click="deletePost()"
              >
                <ion-icon
                  v-if="spinners.buttonDelete == false"
                  :icon="trashOutline"
                  color="danger"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.buttonDelete == true"
                  name="crescent"
                ></ion-spinner>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-row class="ion-padding-start">
          <ion-col>
            <p class="post-date">
              Creación del post:
              {{ usePost.getPost({ id: postId })!.created_at }}
            </p>
            <p class="post-date">
              Ultimá actualización del post:
              {{ usePost.getPost({ id: postId })!.updated_at }}
            </p>
          </ion-col>
        </ion-row>

        <ion-row class="ion-padding-start">
          <ion-col size="12">
            <Markdown
              :source="usePost.getPost({ id: postId })!.content"
              :html="true"
            />
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
// @ts-ignore
import Markdown from "vue3-markdown-it";
import { getPost, deletePost } from "../../../services/post";
import {
  chevronBackOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import {
  presentLoading,
  presentAlertConfirmation,
  openToastErrror,
} from "../../../services/system";
import { getUser } from "../../../services/user";
import { format, parseISO } from "date-fns";
import eventBus from "../../../EventBus";
import { POST_DETAILS, USER_PERMISSIONS } from "../../../services/graphql";
import { usePost } from "../../../composables/usePost";
import { useUser } from "../../../composables/useUser";

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
    return {
      chevronBackOutline,
      createOutline,
      trashOutline,
      useUser: useUser(),
      usePost: usePost(),
    };
  },

  data() {
    return {
      postId: this.$route.params.id as string,
      post: {
        title: "",
        content: "",
        cover: "",
        created: "",
        updated: "",
      },
      spinners: { buttonUpdate: false, buttonDelete: false },
    };
  },

  mounted() {
    this.getPost();
  },

  methods: {
    async getPost() {
      const loading = await presentLoading({
        message: "Obteniendo publicación",
      });
      loading.present();

      try {
        await this.usePost.loadPost({
          id: this.postId,
          graphql: {
            name: POST_DETAILS,
            fragment: "PostDetails",
            refetch: true,
          },
        });

        loading.dismiss();
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
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

    async updatePost() {
      this.spinners.buttonUpdate = true;
      await this.$router.push("/blog/editor/update/" + this.postId);
      this.spinners.buttonUpdate = false;
    },

    async deletePost() {
      this.spinners.buttonDelete = true;

      const alertResponse = await presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });

      if (alertResponse == false) {
        this.spinners.buttonDelete = false;
        return;
      }

      try {
        await deletePost({ id: this.postId as string });
        this.spinners.buttonDelete = false;
        this.$router.go(-1);
        eventBus().emitter.emit("new-post");
      } catch (e: any) {
        this.spinners.buttonDelete = false;
        openToastErrror(e);
      }
    },
  },
});
</script>

<style scoped>
@import "highlight.js/styles/atom-one-dark.css";
.post-date {
  font-size: 12px !important;
}
</style>
