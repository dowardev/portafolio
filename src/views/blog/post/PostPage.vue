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
        <ion-title>
          {{ post.title }}
        </ion-title>
        <ion-buttons slot="end" v-if="isUserAdmin" :collapse="true">
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
          <h1 class="ion-padding-start">{{ post.title }}</h1>
          <ion-buttons slot="end" v-if="isUserAdmin" :collapse="true">
            <ion-button
              fill="clear"
              @click="updatePost()"
              :disabaled="spinners.buttonUpdate == true"
            >
              <ion-icon
                :icon="createOutline"
                v-if="spinners.buttonUpdate == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonUpdate == true"
              ></ion-spinner>
            </ion-button>

            <ion-button
              fill="clear"
              @click="deletePost()"
              :disabaled="spinners.buttonDelete == true"
            >
              <ion-icon
                :icon="trashOutline"
                color="danger"
                v-if="spinners.buttonDelete == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonDelete == true"
              ></ion-spinner>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-row class="ion-padding-start">
        <ion-col>
          <p class="post-date">Creación del post: {{ post.created }}</p>
          <p class="post-date">
            Ultimá actualización del post: {{ post.updated }}
          </p>
        </ion-col>
      </ion-row>

      <ion-row class="ion-padding-start">
        <ion-col size="12">
          <Markdown :source="post.content" :html="true" />
        </ion-col>
      </ion-row>
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
      spinners: { buttonUpdate: false, buttonDelete: false },
    };
  },

  mounted() {
    this.getPost();
    this.verifyUserAdmin();
    eventBus().emitter.on("update-post", () => {
      this.getPost();
    });
  },

  methods: {
    async getPost() {
      const loading = await presentLoading({
        message: "Obteniendo publicación",
      });
      loading.present();

      try {
        const response = await getPost({
          id: this.postId as string,
          graphql: { name: POST_DETAILS, fragment: "PostDetails" },
        });

        const title = response.title ? response.title : "";
        const content = response.content ? response.content : "";
        const coverSource = response.cover.source ? response.cover.source : "";

        const postCreated = format(
          // eslint-disable-next-line
          parseISO(response.created_at!),
          "dd/MM/yyyy"
        );

        const postUpdated = format(
          // eslint-disable-next-line
          parseISO(response.updated_at!),
          "dd/MM/yyyy"
        );

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

    async verifyUserAdmin() {
      if (navigator.onLine) {
        try {
          this.isUserAdmin = (
            await getUser({
              graphql: { name: USER_PERMISSIONS, fragment: "UserPermissions" },
            })
          ).is_admin!;
        } catch (e: any) {
          this.isUserAdmin = false;
          if (e.message == "Unauthorized") return;
          else {
            openToastErrror(e);
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
  font-size: 12px !important;
}
</style>
