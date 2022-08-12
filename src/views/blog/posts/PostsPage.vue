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
          <ion-button v-if="isUserAdmin" @click="addPost()">
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
            <ion-button v-if="isUserAdmin" @click="addPost()">
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

      <section
        :class="{
          loadContent:
            loadingData.posts.status == 'loading' ||
            loadingData.data.status == 'loading' ||
            loadingData.data.status == 'loading',
        }"
      >
        <!-- date selector -->
        <ion-item-divider sticky>
          <div style="width: 100%; display: flex; justify-content: center">
            <ion-button fill="clear" @click="previousPage({ currentPage })">
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>

            <!-- pages -->
            <ion-item id="open-date-input" :button="true" lines="none">
              <ion-text style="color: var(--accent-color) !important">
                {{ currentPage }}
              </ion-text>
              <ion-popover trigger="open-date-input" :show-backdrop="false">
                <ion-datetime
                  ref="datetime"
                  :is-date-enabled="getDaysEnabled"
                  presentation="date"
                  :value="currentPage"
                  :first-day-of-week="1"
                  locale="es-mx"
                  @ion-change="
                    goToPage({ currentPage: $event.detail.value as string })
                  "
                ></ion-datetime>
              </ion-popover>
            </ion-item>

            <!-- navigation button -->
            <ion-button fill="clear" @click="nextPage({ currentPage })">
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </ion-button>
          </div>
        </ion-item-divider>

        <!-- posts -->
        <section class="ion-padding">
          <ion-row v-for="(post, index) in posts" :key="post">
            <ion-col size="4">
              <img
                :src="coverToBase64(post.cover.source!)"
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

            <ion-col v-if="isUserAdmin" size="12">
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
                @click="deletePost(post.id!, index)"
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
                  isUserAdmin
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
                @click="loadContent()"
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
  IonDatetime,
  IonPopover,
  IonItemDivider,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  getPosts as getPostsService,
  getPostsDates as getPostsDatesService,
  deletePost as deletePostService,
} from "../../../services/post";
import formatISO from "date-fns/formatISO";
import eventBus from "../../../EventBus";
import {
  openToastErrror,
  openToast,
  presentAlertConfirmation,
} from "../../../services/system";
import { Post } from "../../../services/interfaces";
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
import { getUser } from "../../../services/user";
import {
  ALL_POSTS_DETAILS,
  POST_DATES,
  USER_PERMISSIONS,
} from "../../../services/graphql";

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
    IonDatetime,
    IonPopover,
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
    };
  },

  data() {
    return {
      pageTitle: "Blog",
      dates: Array<string>(),
      posts: Array<Post>(),
      currentPage: String(),
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
      isUserAdmin: false,
      spinners: {
        buttonAddPost: false,
        buttonAddNewPost: false,
        buttonEditPost: "",
        buttonDeletePost: "",
      },
    };
  },

  mounted() {
    this.verifyUserAdmin();
    this.loadContent();

    // eventBus().emitter.on("event-posts1-data", (response: any) => {
    //   if (response.option == "next") this.nextPage(response.currentPage);

    //   if (response.option == "previous")
    //     this.previousPage(response.currentPage);

    //   if (response.option == "goTo") this.goToPage(response.currentPage);

    //   if (response.option == "refresh") this.loadContent(true);
    // });

    // eventBus().emitter.on("new-post", () => {
    //   this.loadContent();
    // });

    // eventBus().emitter.on("update-post", () => {
    //   this.loadContent();
    // });
  },

  methods: {
    async getPostsDates(params: { refetch: boolean }): Promise<Array<string>> {
      const dates = Array<string>();
      try {
        const response = await getPostsDatesService({
          refetch: params.refetch,
          graphql: { name: POST_DATES, fragment: "PostDates" },
        });
        response.forEach((element: any) => {
          dates.push(
            formatISO(new Date(element), {
              representation: "date",
            }).replaceAll("/", "-")
          );
        });

        this.dates = dates;
      } catch (e: any) {
        this.loadingData.dates.status = "error";
        console.error(e);
        openToastErrror(e);
        throw new Error(e.message);
      }

      this.loadingData.dates.status = "finished";
      return dates;
    },

    loadData(params: { dates: Array<string> }): string {
      let currentPage =
        this.$route.params.date != undefined
          ? (this.$route.params.date as string)
          : this.currentPage;

      if (this.$route.path == "/blog" || this.$route.path == "/blog/") {
        try {
          const date = params.dates[params.dates.length - 1];
          currentPage = new Date(date).toISOString().split("T")[0];
          // this.$router.replace("/blog/" + currentPage);
        } catch (e: any) {
          if (e.message == "No dates") {
            const today = formatISO(new Date(), {
              representation: "date",
            });
            this.$router.replace("/blog/" + today);
            return "";
          }
          console.error(e);
          openToastErrror(e);
          return "";
        }
      }
      return currentPage;
    },

    async getPosts(params: {
      currentPage: string;
      refetch?: boolean;
    }): Promise<Array<Post>> {
      try {
        const response = await getPostsService({
          date: params.currentPage,
          refetch: params.refetch,
          graphql: { name: ALL_POSTS_DETAILS, fragment: "PostsDetails" },
        });

        return response;
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
        throw new Error(e.message);
      }
    },

    async loadContent(refetch = false) {
      this.loadingData.data.status = "loading";
      this.loadingData.dates.status = "loading";
      this.loadingData.posts.status = "loading";

      const dates = await this.getPostsDates({ refetch });
      if (dates.length == 0) {
        this.loadingData.dates.status = "error";
        this.loadingData.dates.message = "No dates";
        return;
      }
      this.loadingData.data.status = "finished";

      const currentPage = this.loadData({ dates });
      if (currentPage == "") {
        this.loadingData.dates.status = "error";
      }
      this.loadingData.dates.status = "finished";

      const posts = await this.getPosts({ currentPage, refetch: true });
      if (posts.length == 0) {
        this.loadingData.posts.status = "error";
      }
      this.loadingData.posts.status = "finished";

      this.currentPage = currentPage;
      this.dates = dates;
      this.posts = posts;
    },

    async nextPage(params: { currentPage: string }) {
      this.loadingData.posts.status = "loading";
      const index = this.dates.indexOf(params.currentPage);

      if (index == 0) {
        this.loadingData.posts.status = "finished";
        return;
      }

      const date = this.dates[index - 1];
      let posts = Array<Post>();

      try {
        posts = await this.getPosts({ currentPage: date });
        this.loadingData.posts.status = "finished";
      } catch (e: any) {
        this.loadingData.posts.status = "error";
      }

      this.currentPage = date;
      this.posts = posts;
      this.$router.replace("/blog/" + date.replaceAll("/", "-"));
    },

    async previousPage(params: { currentPage: string }) {
      this.loadingData.posts.status = "loading";
      const index = this.dates.indexOf(params.currentPage);

      if (index == this.dates.length - 1) {
        this.loadingData.posts.status = "finished";
        return;
      }

      const date = this.dates[index + 1];

      let posts = Array<Post>();
      try {
        posts = await this.getPosts({ currentPage: date });
        this.loadingData.posts.status = "finished";
      } catch (e: any) {
        this.loadingData.posts.status = "error";
      }

      this.currentPage = date;
      this.posts = posts;
      this.$router.replace("/blog/" + date);
    },

    async goToPage(params: { currentPage: string }) {
      this.loadingData.posts.status = "loading";
      const date = this.dates.filter(
        (element) => element == params.currentPage
      )[0];

      let posts = Array<Post>();
      try {
        posts = await this.getPosts({ currentPage: date, refetch: true });
        this.loadingData.posts.status = "finished";
      } catch (e: any) {
        this.loadingData.posts.status = "error";
      }

      this.currentPage = date;
      this.posts = posts;
      this.$router.replace("/blog/" + date);
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

    async addPost() {
      this.spinners.buttonAddPost = true;
      await this.$router.push("/blog/editor/create");
      this.spinners.buttonAddPost = false;
    },

    getDaysEnabled(date: string) {
      // eslint-disable-next-line
      const result = this.dates!.filter((element) => element == date);
      if (result.length > 0) {
        return true;
      }
      return false;
    },

    coverToBase64(cover: string) {
      return "data:image/png;base64," + cover;
    },

    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },

    async updatePost(id: string) {
      this.spinners.buttonEditPost = id;
      await this.$router.push("/blog/editor/update/" + id);
      this.spinners.buttonEditPost = "";
    },

    async deletePost(id: string, index: number) {
      this.spinners.buttonDeletePost = id;

      const response = await presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });
      if (response == false) {
        this.spinners.buttonDeletePost = "";
        return;
      }

      deletePostService({ id })
        .then(() => {
          this.spinners.buttonDeletePost = "";
          // eslint-disable-next-line
          this.posts!.splice(index, 1);
          openToast({ message: "Post eliminado" });
        })
        .catch((e) => {
          this.spinners.buttonDeletePost = "";
          console.error(e);
        });
    },

    async refreshContent() {
      eventBus().emitter.emit("event-posts1-data", {
        option: "refresh",
        currentPage: this.currentPage,
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
