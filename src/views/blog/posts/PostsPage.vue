<template>
  <ion-page>
    <section
      v-if="
        loadingData.data.status == 'finished' &&
        loadingData.dates.status == 'finished' &&
        loadingData.posts.status == 'finished'
      "
    >
      <ion-router-outlet />
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
              class="loading-label"
              v-if="loadingData.dates.status == 'loading'"
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
              @click="loadData()"
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
              class="loading-label"
              v-if="loadingData.data.status == 'loading'"
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
              class="loading-label"
              v-if="loadingData.posts.status == 'loading'"
              >Cargando posts</ion-label
            >
          </ion-item>
        </div>
      </section>
    </div>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonRouterOutlet,
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

export default defineComponent({
  name: "PostsPage",
  components: {
    IonPage,
    IonRouterOutlet,
    IonChip,
    IonLabel,
    IonItem,
    IonSpinner,
    IonIcon,
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

  async mounted() {
    await this.verifyUserAdmin();
    this.loadData();

    eventBus().emitter.on("event-posts1-data", (response: any) => {
      if (response.option == "next") this.nextPage(response.currentPage);

      if (response.option == "previous")
        this.previousPage(response.currentPage);

      if (response.option == "goTo") this.goToPage(response.currentPage);

      if (response.option == "refresh") this.loadData();
    });

    eventBus().emitter.on("refresh-content", (response: any) => {
      if (response.event == "new-post") {
        this.loadData();
      }
    });
  },

  methods: {
    async loadData() {
      this.loadingData.data.status = "loading";
      this.loadingData.dates.status = "loading";
      this.loadingData.posts.status = "loading";

      let dates = Array<string>();
      try {
        dates = await this.getPostsDates();
        if (dates.length == 0) {
          this.loadingData.dates.status = "error";
          this.loadingData.dates.message = "No dates";
          return;
        }
        this.loadingData.dates.status = "finished";
      } catch (e: any) {
        this.loadingData.dates.status = "error";
        return;
      }

      let currentPage = String();
      currentPage = this.$route.params.date as string;

      if (this.$route.path == "/blog" || this.$route.path == "/blog/") {
        try {
          const date = dates.pop() as string;
          currentPage = new Date(date).toISOString().split("T")[0];
          this.$router.replace("/blog/" + currentPage);
        } catch (e: any) {
          if (e.message == "No dates") {
            const today = formatISO(new Date(), {
              representation: "date",
            });
            this.$router.replace("/blog/" + today);
            return;
          }
          this.loadingData.data.status = "error";
          console.error(e);
          systemService().openToastErrror(e);
          return;
        }
      }
      this.loadingData.data.status = "finished";

      let posts = Array<Post>();

      try {
        posts = await this.getPosts(currentPage);
        this.loadingData.posts.status = "finished";
      } catch (e: any) {
        this.loadingData.posts.status = "error";
      }

      setTimeout(() => {
        this.passData({ currentPage, dates, posts });
      }, 500);
    },

    passData(data: {
      dates?: Array<string>;
      currentPage?: string;
      posts?: Array<Post> | void;
    }) {
      eventBus().emitter.emit("event-posts2-data", {
        dates: data.dates,
        currentPage: data.currentPage,
        posts: data.posts,
      });
    },

    async nextPage(currentPage: string) {
      const index = this.dates.indexOf(currentPage);
      if (index == this.dates.length - 1) return;
      const date = this.dates[index + 1];
      await this.$router.replace("/blog/" + date.replaceAll("/", "-"));
      this.loadData();
    },

    async previousPage(currentPage: string) {
      const index = this.dates.indexOf(currentPage);
      if (index <= 0) return;
      const date = this.dates[index - 1];
      await this.$router.replace("/blog/" + date.replaceAll("/", "-"));
      this.loadData();
    },

    async goToPage(currentPage: string) {
      const date = this.dates.filter((element) => element == currentPage)[0];
      await this.$router.replace("/blog/" + date);
      this.loadData();
    },

    async getPosts(date: string): Promise<Array<Post>> {
      const query = `
            id
            title
            cover {
              source
            }
      `;

      let posts = Array<Post>();
      try {
        posts = await postService().getPosts({
          date: date,
          query,
        });

        return posts;
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
        throw new Error(e.message);
      }
    },

    async getPostsDates(): Promise<Array<string>> {
      try {
        const response = await postService().getPostsDates();

        const dates = Array<string>();
        response.forEach((element: any) => {
          dates.push(
            formatISO(new Date(element), {
              representation: "date",
            }).replaceAll("/", "-")
          );
        });

        this.dates = dates;
        return dates;
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
        throw new Error(e.message);
      }
    },

    async verifyUserAdmin() {
      if (navigator.onLine) {
        try {
          const response = await userService().getUserPermissions();
          this.isUserAdmin = response.admin ? response.admin != null : false;
        } catch (e: any) {
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
/* .loading-label { */
/*   color: white !important; */
/* } */
</style>
