<template>
  <ion-page>
    <ion-header collapse="fade" :translucent="true" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons
          slot="end"
          :disabled="spinners.buttonAddNewPost"
          :collapse="true"
        >
          <ion-button v-if="useUser.user.value.isAdmin" @click="addPost()">
            <ion-icon
              v-if="spinners.buttonAddNewPost == false"
              :icon="addOutline"
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonAddNewPost"
              name="crescent"
              color="primary"
            ></ion-spinner>
          </ion-button>
          <ion-button @click="refreshContent()">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
          <ion-buttons
            slot="end"
            :disabled="spinners.buttonAddNewPost"
            :collapse="true"
          >
            <ion-button v-if="useUser.user.value.isAdmin" @click="addPost()">
              <ion-icon
                v-if="spinners.buttonAddNewPost == false"
                :icon="addOutline"
              ></ion-icon>
              <ion-spinner
                v-if="spinners.buttonAddNewPost"
                name="crescent"
                color="primary"
              ></ion-spinner>
            </ion-button>
            <ion-button @click="refreshContent">
              <ion-icon :icon="refreshOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <section v-if="getPosts!.length > 0" class="sticky">
        <!-- date selector -->
        <!-- prev date -->
        <ion-item-divider class="blur-effect blur-effect-color">
          <div style="width: 100%; display: flex; justify-content: center">
            <ion-button
              fill="clear"
              @click="
                goToPage({
                  currentPage: usePost.getCurrentPage()!,
                  option: 'prev',
                })
              "
            >
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>

            <ion-button
              v-if="usePost.getCurrentPage()!"
              fill="clear"
              @click="openPopover({ event: $event })"
            >
              {{ usePost.getCurrentPage()! }}
            </ion-button>

            <!-- next date -->
            <ion-button
              fill="clear"
              @click="
                goToPage({
                  currentPage: usePost.getCurrentPage()!,
                  option: 'next',
                })
              "
            >
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </ion-button>
          </div>
        </ion-item-divider>
      </section>

      <!-- posts -->
      <section v-if="getPosts!.length > 0" class="ion-padding">
        <ion-row v-for="post in getPosts" :key="post">
          <ion-col size="4">
            <img
              :src="(post.cover.source!)"
              style="cursor: pointer"
              @click="openPost(post.id!)"
            />
          </ion-col>
          <ion-col size="8">
            <h2
              style="margin-top: 4px; cursor: pointer"
              @click="openPost(post.id!)"
            >
              {{ post.title }}
            </h2>
          </ion-col>

          <ion-col v-if="useUser.user.value.isAdmin" size="12">
            <ion-button
              fill="clear"
              :disabled="spinners.buttonEditPost ==post.id!"
              @click="updatePost(post.id!)"
            >
              <ion-icon
                v-if="spinners.buttonEditPost ==''|| spinners.buttonEditPost != post.id!"
                :icon="createOutline"
              ></ion-icon>
              <ion-spinner
                v-if="spinners.buttonEditPost==post.id!"
                name="crescent"
                color="primary"
              ></ion-spinner>
            </ion-button>

            <ion-button
              fill="clear"
              :disabled="spinners.buttonDeletePost ==post.id!"
              @click="deletePost({ id: post.id! })"
            >
              <ion-icon
                v-if="spinners.buttonDeletePost==''|| spinners.buttonDeletePost!= post.id!"
                :icon="trashOutline"
                color="danger"
              ></ion-icon>
              <ion-spinner
                v-if="spinners.buttonDeletePost==post.id!"
                name="crescent"
                color="danger"
              ></ion-spinner>
            </ion-button>
          </ion-col>
          <hr />
        </ion-row>
      </section>

      <section v-if="getPosts!.length == 0">
        <div class="align-vertical">
          <div class="center">
            <ion-item lines="none">
              <ion-icon
                slot="start"
                :icon="banOutline"
                color="danger"
              ></ion-icon>
              <ion-label color="danger">No se encontraron datos</ion-label>
            </ion-item>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IonPage,
  IonSpinner,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonItemDivider,
  popoverController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { openToast, presentAlertConfirmation } from "../../../services/system";
import {
  checkmarkOutline,
  closeOutline,
  addOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  chevronBackOutline,
  chevronForwardOutline,
  banOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "../../../services/graphql";
import { useUser } from "../../../composables/useUser";
import { usePost } from "../../../composables/usePost";
import PopoverDateSelector from "./PopoverDateSelector.vue";
import { Post } from "../../../services/interfaces";
import { useSystem } from "../../../composables/useSystem";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonPage,
    IonSpinner,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonItemDivider,
  },

  setup() {
    return {
      checkmarkOutline,
      closeOutline,
      addOutline,
      refreshOutline,
      createOutline,
      trashOutline,
      chevronBackOutline,
      chevronForwardOutline,
      useUser: useUser(),
      usePost: usePost(),
      banOutline,
      openToastError: useSystem().openToastError,
    };
  },

  data() {
    return {
      pageTitle: "Blog",
      spinners: {
        buttonAddPost: false,
        buttonAddNewPost: false,
        buttonEditPost: "",
        buttonDeletePost: "",
      },
    };
  },

  computed: {
    getPosts(): Post[] | undefined {
      return this.usePost.getPosts();
    },
  },

  mounted() {
    this.loadContent({ refetch: true });
  },

  methods: {
    async loadContent(params: { refetch: boolean }) {
      const refetch = params.refetch == false ? false : true;

      await this.getPostsDates({ refetch });

      let dates = Array<string>();
      dates = this.usePost.getDates()!;
      if (dates.length == 0) return;

      let currentPage = "";
      currentPage = this.loadData({ dates });
      this.usePost.updateCurrentPage({ currentPage });

      await this.loadPosts({
        currentPage,
        refetch,
      });
    },

    async getPostsDates(params: { refetch: boolean }): Promise<void> {
      try {
        await this.usePost.loadDates({
          graphql: {
            name: POST_DATES,
            fragment: "PostDates",
            refetch: params.refetch,
          },
        });
      } catch (e: any) {
        console.error(e);
        this.openToastError(e);
        throw e;
      }
    },

    loadData(params: { dates: Array<string> }): string {
      let currentPage = "";
      if (this.$route.params.date != undefined) {
        currentPage = params.dates.filter((element) => {
          if (element == this.$route.params.date) return element;
        })[0];
      } else {
        currentPage = params.dates[0];
      }
      return currentPage;
    },

    async loadPosts(params: { currentPage: string; refetch?: boolean }) {
      const refetch = params.refetch ? params.refetch : false;
      try {
        await this.usePost.loadPosts({
          date: params.currentPage,
          graphql: {
            name: ALL_POSTS_DETAILS,
            fragment: "PostsDetails",
            refetch,
          },
        });
      } catch (e: any) {
        console.error(e);
        this.openToastError(e);
        throw e;
      }
    },

    async goToPage(params: {
      currentPage: string;
      option: "prev" | "next" | "custom";
    }): Promise<void> {
      const date = params.currentPage;
      const dates = this.usePost.getDates()!;
      let index = dates.indexOf(date);

      if (params.option == "prev") {
        index--;
        if (index == -1) return;
      }

      if (params.option == "next") {
        index++;
        if (index == dates.length) return;
      }

      if (params.option == "custom") {
        const customDate = dates.filter((element) => {
          if (element == params.currentPage) return parseInt(element);
        })[0];
        index = dates.indexOf(customDate);
      }

      this.usePost.updateCurrentPage({ currentPage: dates[index] });
      try {
        await this.loadPosts({
          currentPage: dates[index],
        });

        this.$router.replace("/blog/" + dates[index]);
      } catch (error) {
        console.error(error);
      }
    },

    async addPost() {
      this.spinners.buttonAddPost = true;
      await this.$router.push("/blog/editor/create");
      this.spinners.buttonAddPost = false;
    },

    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },

    async updatePost(id: string) {
      this.spinners.buttonEditPost = id;
      await this.$router.push("/blog/editor/update/" + id);
      this.spinners.buttonEditPost = "";
    },

    async deletePost(params: { id: string }) {
      const id = params.id;

      this.spinners.buttonDeletePost = id;

      const response = await presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });
      if (response == false) {
        this.spinners.buttonDeletePost = "";
        return;
      }

      try {
        await this.usePost.deletePost({ id });
        this.loadContent({ refetch: true });
        openToast({ message: "Post eliminado" });
      } catch (error) {
        console.error(error);
      } finally {
        this.spinners.buttonDeletePost = "";
      }
    },

    async refreshContent() {
      this.loadContent({ refetch: true });
    },

    async openPopover(params: { event: Event }) {
      const event = params.event;
      const popover = await popoverController.create({
        component: PopoverDateSelector,
        event: event,
      });
      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data != undefined)
        this.goToPage({
          currentPage: data,
          option: "custom",
        });
    },
  },
});
</script>

<style scoped>
.align-vertical {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.loadContent {
  display: none !important;
}
.sticky {
  position: sticky;
  z-index: 3;
  top: 0px;
}
</style>
