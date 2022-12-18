<template>
  <ion-page>
    <ion-header collapse="fade" :translucent="true" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end" :disabled="spinners.buttonAddNewPost">
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
        </ion-toolbar>
      </ion-header>

      <ion-header mode="ios" :translucent="true" class='sticky'>
        <ion-toolbar >
          <ion-item-divider style='--background: transparent;'>
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
        </ion-toolbar>
      </ion-header>

      <!-- posts -->
      <section v-if="getPosts!.length > 0">
        <ion-row class="center">
          <ion-col
            v-for="post in getPosts"
            :key="post"
            size-xs="12"
            size-md="12"
            size-lg="10"
            size-xl="8"
          >
            <ion-card>
              <ion-row
                class="ion-padding-top ion-padding-start ion-padding-bottom"
              >
                <ion-col size="4">
                  <img
                    :src="(post.cover.source!)"
                    style="cursor: pointer"
                    @click="openPost(post.id!)"
                  />
                </ion-col>

                <ion-col size="6">
                  <h2
                    style="margin-top: 4px; cursor: pointer; font-size: 18px"
                    @click="openPost(post.id!)"
                  >
                    {{ post.title }}
                  </h2>
                </ion-col>

                <ion-col v-if="useUser.user.value.isAdmin" size="2">
                  <ion-button :id="post.id" fill="clear">
                    <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
                  </ion-button>
                  <ion-popover :trigger="post.id" :dismiss-on-select="true">
                    <ion-content>
                      <ion-item
                        button
                        :disabled="spinners.buttonEditPost ==post.id!"
                        @click="updatePost(post.id!)"
                      >
                        <ion-icon
                          v-if="spinners.buttonEditPost ==''|| spinners.buttonEditPost != post.id!"
                          slot="start"
                          :icon="createOutline"
                        ></ion-icon>
                        <ion-label>Editar</ion-label>
                      </ion-item>

                      <ion-item button @click="deletePost({ id: post.id! })">
                        <ion-icon
                          slot="start"
                          :icon="trashOutline"
                          color="danger"
                        ></ion-icon>
                        <ion-label>Borrar</ion-label>
                      </ion-item>
                    </ion-content>
                  </ion-popover>
                </ion-col>
              </ion-row>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="getPosts!.length == 0 && loadFinished">
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

      <section v-if="getPosts!.length == 0 && loadFinished==false">
        <div class="align-vertical">
          <div class="center">
            <ion-item lines="none">
              <ion-spinner slot="start" name="crescent"></ion-spinner>
              <ion-label>Cargando</ion-label>
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
  loadingController,
  IonPopover,
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
  ellipsisVerticalOutline,
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
    IonPopover,
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
      ellipsisVerticalOutline,
    };
  },

  data() {
    return {
      pageTitle: "Blog",
      spinners: {
        buttonAddPost: false,
        buttonAddNewPost: false,
        buttonEditPost: "",
      },
      loadFinished: false,
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
      if (dates.length == 0) {
        this.loadFinished = true;
        return;
      }

      let currentPage = "";
      currentPage = this.loadData({ dates });
      this.usePost.updateCurrentPage({ currentPage });

      await this.loadPosts({
        currentPage,
        refetch,
      });
      this.loadFinished = true;
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
        const p = await this.usePost.loadPosts({
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
      const response = await presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });

      if (response == false) return;

      const loading = await loadingController.create({
        message: "Eliminando publicacion",
      });

      loading.present();
      try {
        await this.usePost.deletePost({ id });
        this.loadContent({ refetch: true });
        openToast({ message: "Post eliminado" });
      } catch (error) {
        console.error(error);
      } finally {
        loading.dismiss();
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
