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

          <ion-button id="open-modal">
            <ion-icon :icon="searchOutline"></ion-icon>
          </ion-button>
          <ion-modal
            ref="modalSearchPosts"
            trigger="open-modal"
            :mode="modeDesingElements"
          >
            <ion-header mode="ios">
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-button @click="closeModalSearchPosts()">
                    <ion-icon :icon="closeOutline"></ion-icon>
                  </ion-button>
                </ion-buttons>

                <ion-title>Busqueda</ion-title>
              </ion-toolbar>

              <ion-toolbar>
                <ion-searchbar
                  :debounce="350"
                  @ion-change="
                    searchPosts({
                      search: $event.detail.value as string,
                      refetch: true,
                    })
                  "
                ></ion-searchbar>
              </ion-toolbar>
            </ion-header>

            <ion-content class="ion-padding">
              <ion-item
                v-for="result in searchResult"
                :key="result.id"
                button
                @click="openPostSearch({ id: result.id })"
              >
                <ion-label>{{ result.title }}</ion-label>
              </ion-item>
            </ion-content>
          </ion-modal>

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

      <!-- date selector -->
      <ion-header mode="ios" :translucent="true" class="sticky">
        <ion-toolbar>
          <ion-item-divider
            v-if="usePost.getDates()!.length>0&&usePost.getCurrentPage()!=undefined"
            style="--background: transparent"
          >
            <DateSelectorComponent
              @current-date-change="
                loadPosts({ currentPage: usePost.getCurrentPage() as string })
              "
            ></DateSelectorComponent>
          </ion-item-divider>
        </ion-toolbar>
      </ion-header>
      <!-- end dae selector -->

      <!-- posts -->
      <section v-if="usePost.getPosts()!.length>0">
        <ion-row class="center">
          <ion-col
            v-for="post in usePost.getPosts()!"
            :key="post"
            size-xs="12"
            size-md="12"
            size-lg="10"
            size-xl="8"
          >
            <ion-card
              v-if="(post.createdAt!).split('T')[0]==usePost.getCurrentPage() as string"
              style="cursor: pointer"
              @click="openPost(post.id!)"
            >
              <ion-row
                class="ion-padding-top ion-padding-start ion-padding-bottom"
              >
                <ion-col size-xs="12" size-md="4">
                  <img :src="(post.cover.source!)" />
                </ion-col>

                <ion-col size-xs="12" size-md="6">
                  <h2 style="margin-top: 4px; font-size: 18px">
                    {{ post.title }}
                  </h2>
                </ion-col>
              </ion-row>

              <ion-item v-if="useUser.user.value.isAdmin" button lines="none" >
                <ion-button
                  slot="end"
                  :disabled="spinners.buttonEditPost == post.id!"
                  fill="clear"
                  @click="updatePost(post.id!)"
                >
                  <ion-icon
                    v-if="spinners.buttonEditPost == '' || spinners.buttonEditPost != post.id!"
                    slot="start"
                    :icon="createOutline"
                  ></ion-icon>
                </ion-button>

                <ion-button
                  slot="end"
                  fill="clear"
                  @click="deletePost({ id: post.id! })"
                >
                  <ion-icon
                    slot="start"
                    :icon="trashOutline"
                    color="danger"
                  ></ion-icon>
                </ion-button>
              </ion-item>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>
      <!-- end posts -->

      <section v-if="usePost.getPosts()!.length == 0 && loadFinished">
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

      <section v-if="usePost.getPosts()!.length == 0 && loadFinished == false">
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
  IonModal,
  isPlatform,
  IonSearchbar,
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
  searchOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "../../../services/graphql";
import { useUser } from "../../../composables/useUser";
import { usePost } from "../../../composables/usePost";
import { useSystem } from "../../../composables/useSystem";
import { format, isEqual } from "date-fns";

import DateSelectorComponent from "../../../components/posts/DateSelectorComponent.vue";

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
    IonModal,
    IonSearchbar,
    DateSelectorComponent,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
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
      searchOutline,
      modeDesingElements,
      format,
      isEqual,
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
      searchResult: Array<{ id: string; title: string }>(),
    };
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

    closeModalSearchPosts() {
      (this.$refs.modalSearchPosts as any).$el.dismiss(null, "cancel");
    },

    async searchPosts(params: { search: string; refetch: boolean }) {
      const search = params.search;
      const refetch = params.refetch;

      const searchResult = await usePost().searchPosts({
        search,
        graphql: {
          refetch,
        },
      });
      this.searchResult = searchResult;
    },

    async openPostSearch(params: { id: string }) {
      const id = params.id;
      await this.$router.push({ name: "PostPage", params: { id } });
      this.closeModalSearchPosts();
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
