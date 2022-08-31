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
          <ion-button
            :class="{
              loadContent:
                loadingData.posts.status == 'loading' ||
                loadingData.data.status == 'loading' ||
                loadingData.data.status == 'loading',
            }"
            @click="refreshContent()"
          >
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
            <ion-button
              :class="{
                loadContent:
                  loadingData.posts.status == 'loading' ||
                  loadingData.data.status == 'loading' ||
                  loadingData.data.status == 'loading',
              }"
              @click="refreshContent"
            >
              <ion-icon :icon="refreshOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <section
        :class="{
          loadContent:
            loadingData.posts.status == 'loading' ||
            loadingData.data.status == 'loading' ||
            loadingData.data.status == 'loading',
        }"
      >
        <!-- date selector -->
        <!-- prev date -->
        <ion-item-divider sticky>
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

        <!-- posts -->
        <section class="ion-padding">
          <ion-row
            v-for="(post ) in usePost.getPosts({
              date: usePost.getCurrentPage()!,
            })"
            :key="post"
          >
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
      </section>

      <div style="background-color: var(--background-color); height: 100%">
        <section
          v-if="
            loadingData.posts.status != 'finished' ||
            (loadingData.data.status == 'error' &&
              loadingData.data.status == 'error')
          "
          class="align-vertical"
        >
          <!-- dates -->
          <div class="center">
            <ion-item lines="none">
              <ion-spinner
                v-if="
                  loadingData.dates.status == 'loading' &&
                  loadingData.data.status != 'error' &&
                  loadingData.posts.status != 'error'
                "
                slot="start"
                name="crescent"
              >
              </ion-spinner>
              <ion-icon
                v-if="loadingData.dates.status == 'finished'"
                slot="start"
                :icon="checkmarkOutline"
              ></ion-icon>
              <ion-icon
                v-if="loadingData.dates.status == 'error'"
                slot="start"
                :icon="closeOutline"
                color="danger"
              ></ion-icon>
              <ion-label
                v-if="
                  loadingData.dates.status == 'loading' ||
                  loadingData.dates.status == 'finished'
                "
                >Cargando fechas</ion-label
              >
              <ion-chip
                v-if="loadingData.dates.status == 'error'"
                color="danger"
              >
                <ion-label class="error">No se encontraron posts</ion-label>
              </ion-chip>
              <ion-button
                v-if="
                  loadingData.dates.status == 'error' &&
                  loadingData.dates.message == 'No dates' &&
                  useUser.user.value.isAdmin
                "
                fill="clear"
                @click="addPost()"
              >
                <ion-label v-if="spinners.buttonAddPost == false"
                  ><ion-icon :icon="addOutline"></ion-icon
                ></ion-label>
                <ion-spinner
                  v-if="spinners.buttonAddPost"
                  name="crescent"
                ></ion-spinner>
              </ion-button>

              <ion-button
                v-if="
                  loadingData.dates.status == 'error' &&
                  loadingData.dates.message == 'No dates'
                "
                fill="clear"
                @click="loadContent({ refetch: true })"
              >
                <ion-label v-if="spinners.buttonAddPost == false"
                  ><ion-icon :icon="refreshOutline"></ion-icon
                ></ion-label>
              </ion-button>
            </ion-item>
          </div>

          <!-- data -->
          <div class="center">
            <ion-item lines="none">
              <ion-spinner
                v-if="
                  loadingData.data.status == 'loading' &&
                  loadingData.dates.status != 'error' &&
                  loadingData.posts.status != 'error'
                "
                slot="start"
                name="crescent"
              >
              </ion-spinner>
              <ion-icon
                v-if="loadingData.data.status == 'finished'"
                slot="start"
                :icon="checkmarkOutline"
              ></ion-icon>
              <ion-icon
                v-if="loadingData.data.status == 'error'"
                slot="start"
                :icon="closeOutline"
                color="danger"
              ></ion-icon>
              <ion-label
                v-if="
                  loadingData.data.status == 'loading' ||
                  loadingData.data.status == 'finished'
                "
                >Cargando datos</ion-label
              >
            </ion-item>
          </div>

          <!-- posts -->
          <div class="center">
            <ion-item lines="none">
              <ion-spinner
                v-if="
                  loadingData.posts.status == 'loading' &&
                  loadingData.data.status != 'error' &&
                  loadingData.dates.status != 'error'
                "
                slot="start"
                name="crescent"
              >
              </ion-spinner>
              <ion-icon
                v-if="loadingData.posts.status == 'finished'"
                slot="start"
                :icon="checkmarkOutline"
              ></ion-icon>
              <ion-icon
                v-if="loadingData.posts.status == 'error'"
                slot="start"
                :icon="closeOutline"
                color="danger"
              ></ion-icon>
              <ion-label
                v-if="
                  loadingData.posts.status == 'loading' ||
                  loadingData.posts.status == 'finished'
                "
                >Cargando posts</ion-label
              >
            </ion-item>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IonPage,
  IonChip,
  IonLabel,
  IonItem,
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
import {
  openToastErrror,
  openToast,
  presentAlertConfirmation,
} from "../../../services/system";
import {
  checkmarkOutline,
  closeOutline,
  addOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "../../../services/graphql";
import { useUser } from "../../../composables/useUser";
import { usePost } from "../../../composables/usePost";
import PopoverDateSelector from "./PopoverDateSelector.vue";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonPage,
    IonChip,
    IonLabel,
    IonItem,
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
    };
  },

  data() {
    return {
      pageTitle: "Blog",
      loadingData: {
        data: {
          status: "loading | finished | error",
          message: "",
        },
        dates: {
          status: "loading | finished | error",
          message: "",
        },
        posts: {
          status: "loading | finished | error",
          message: "",
        },
      },
      spinners: {
        buttonAddPost: false,
        buttonAddNewPost: false,
        buttonEditPost: "",
        buttonDeletePost: "",
      },
    };
  },

  mounted() {
    this.loadContent({ refetch: true });
  },

  methods: {
    async loadContent(params: { refetch: boolean }) {
      const refetch = params.refetch == false ? false : true;

      this.loadingData.data.status = "loading";
      this.loadingData.dates.status = "loading";
      this.loadingData.posts.status = "loading";

      try {
        await this.getPostsDates({ refetch });
        this.loadingData.data.status = "finished";
      } catch {
        this.loadingData.dates.status = "error";
        this.loadingData.dates.message = "No dates";
        return;
      }
      let dates = Array<string>();
      try {
        dates = this.usePost.getDates()!;
      } catch (error: any) {
        console.error(error);
        return;
      }

      let currentPage = "";
      try {
        currentPage = this.loadData({ dates });
        this.loadingData.dates.status = "finished";
        this.usePost.updateCurrentPage({ currentPage });
      } catch (error) {
        this.loadingData.dates.status = "error";
      }

      try {
        await this.getPosts({
          currentPage,
          refetch,
        });
        this.loadingData.posts.status = "finished";
      } catch (error) {
        this.loadingData.posts.status = "error";
      }
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
        this.loadingData.dates.status = "error";
        console.error(e);
        openToastErrror(e);
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

    async getPosts(params: { currentPage: string; refetch?: boolean }) {
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
        openToastErrror(e);
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

      this.loadingData.posts.status = "loading";
      this.usePost.updateCurrentPage({ currentPage: dates[index] });
      try {
        await this.getPosts({
          currentPage: dates[index],
        });

        this.$router.replace("/blog/" + dates[index]);
        this.loadingData.posts.status = "finished";
      } catch (error) {
        console.error(error);
        this.loadingData.posts.status = "error";
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
</style>
