<template>
  <ion-page>
    <section
      :class="{
        loadContent:
          loadingData.posts.status == 'loading' ||
          loadingData.data.status == 'loading' ||
          loadingData.data.status == 'loading',
      }"
    >
      <PostsComponent
        :dates="dates"
        :posts="posts"
        :currentPage="currentPage"
        @nextPage="nextPage($event)"
        @previousPage="previousPage($event)"
        @goToPage="goToPage($event)"
      ></PostsComponent>
    </section>

    <div style="background-color: var(--background-color); height: 100%">
      <section
        class="align-vertical"
        v-if="
          loadingData.posts.status != 'finished' ||
          (loadingData.data.status == 'error' &&
            loadingData.data.status == 'error')
        "
      >
        <!-- dates -->
        <div class="center">
          <ion-item lines="none">
            <ion-spinner
              name="crescent"
              slot="start"
              v-if="
                loadingData.dates.status == 'loading' &&
                loadingData.data.status != 'error' &&
                loadingData.posts.status != 'error'
              "
            >
            </ion-spinner>
            <ion-icon
              :icon="checkmarkOutline"
              v-if="loadingData.dates.status == 'finished'"
              slot="start"
            ></ion-icon>
            <ion-icon
              :icon="closeOutline"
              v-if="loadingData.dates.status == 'error'"
              slot="start"
              color="danger"
            ></ion-icon>
            <ion-label
              v-if="
                loadingData.dates.status == 'loading' ||
                loadingData.dates.status == 'finished'
              "
              >Cargando fechas</ion-label
            >
            <ion-chip color="danger" v-if="loadingData.dates.status == 'error'">
              <ion-label class="error">No se encontraron posts</ion-label>
            </ion-chip>
            <ion-button
              fill="clear"
              v-if="
                loadingData.dates.status == 'error' &&
                loadingData.dates.message == 'No dates' &&
                isUserAdmin
              "
              @click="addPost()"
            >
              <ion-label v-if="spinners.buttonAddPost == false"
                ><ion-icon :icon="addOutline"></ion-icon
              ></ion-label>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonAddPost"
              ></ion-spinner>
            </ion-button>

            <ion-button
              fill="clear"
              v-if="
                loadingData.dates.status == 'error' &&
                loadingData.dates.message == 'No dates'
              "
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
              name="crescent"
              slot="start"
              v-if="
                loadingData.data.status == 'loading' &&
                loadingData.dates.status != 'error' &&
                loadingData.posts.status != 'error'
              "
            >
            </ion-spinner>
            <ion-icon
              :icon="checkmarkOutline"
              v-if="loadingData.data.status == 'finished'"
              slot="start"
            ></ion-icon>
            <ion-icon
              :icon="closeOutline"
              v-if="loadingData.data.status == 'error'"
              slot="start"
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
              name="crescent"
              slot="start"
              v-if="
                loadingData.posts.status == 'loading' &&
                loadingData.data.status != 'error' &&
                loadingData.dates.status != 'error'
              "
            >
            </ion-spinner>
            <ion-icon
              :icon="checkmarkOutline"
              v-if="loadingData.posts.status == 'finished'"
              slot="start"
            ></ion-icon>
            <ion-icon
              :icon="closeOutline"
              v-if="loadingData.posts.status == 'error'"
              slot="start"
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import formatISO from "date-fns/formatISO";
import eventBus from "../../../EventBus";
import systemService from "../../../services/system.vue";
import { Post } from "@/services/interfaces.vue";
import {
  checkmarkOutline,
  closeOutline,
  addOutline,
  refreshOutline,
} from "ionicons/icons";
import userService from "../../../services/user.vue";
import PostsComponent from "./PostsPage2.vue";
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
    PostsComponent,
  },

  setup() {
    return {
      checkmarkOutline,
      closeOutline,
      addOutline,
      refreshOutline,
    };
  },

  data() {
    return {
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
      },
    };
  },

  mounted() {
    this.verifyUserAdmin();
    this.loadContent();

    eventBus().emitter.on("event-posts1-data", (response: any) => {
      if (response.option == "next") this.nextPage(response.currentPage);

      if (response.option == "previous")
        this.previousPage(response.currentPage);

      if (response.option == "goTo") this.goToPage(response.currentPage);

      if (response.option == "refresh") this.loadContent(true);
    });

    eventBus().emitter.on("new-post", () => {
      this.loadContent();
    });

    eventBus().emitter.on("update-post", () => {
      this.loadContent();
    });
  },

  methods: {
    async getPostsDates(params: { refetch: boolean }): Promise<Array<string>> {
      const dates = Array<string>();
      try {
        const response = await postService().getPostsDates({
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
        systemService().openToastErrror(e);
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
          systemService().openToastErrror(e);
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
        const response = await postService().getPosts({
          date: params.currentPage,
          refetch: params.refetch,
          graphql: { name: ALL_POSTS_DETAILS, fragment: "PostsDetails" },
        });

        return response;
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
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

      const posts = await this.getPosts({ currentPage, refetch });
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
        posts = await this.getPosts({ currentPage: date });
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
            await userService().getUser({
              graphql: { name: USER_PERMISSIONS, fragment: "UserPermissions" },
            })
          ).is_admin!;
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

    async addPost() {
      this.spinners.buttonAddPost = true;
      await this.$router.push("/blog/editor/create");
      this.spinners.buttonAddPost = false;
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
