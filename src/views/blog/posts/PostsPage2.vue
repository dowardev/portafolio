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
        <ion-title>Blog</ion-title>
        <ion-buttons slot="end">
          <ion-spinner
            name="crescent"
            v-if="spinners.buttonAddNewPost"
          ></ion-spinner>
          <ion-button @click="addPost()" v-if="isUserAdmin">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>Blog</h1>
        </ion-toolbar>
      </ion-header>

      <!-- date selector -->
      <section>
        <ion-row v-if="dates.length > 0">
          <ion-col class="center">
            <!-- navigation button -->
            <ion-button fill="clear" @click="previousPage">
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>

            <!-- pages -->
            <ion-item
              button="true"
              id="open-date-input"
              lines="none"
              v-if="dates.length > 0"
            >
              <ion-text>{{ currentPage }}</ion-text>
              <ion-popover trigger="open-date-input" :show-backdrop="false">
                <ion-datetime
                  :is-date-enabled="getDaysEnabled"
                  presentation="date"
                  @ionChange="goToPage($event.detail.value)"
                  :value="currentPage"
                  ref="datetime"
                  firstDayOfWeek="1"
                ></ion-datetime>
              </ion-popover>
            </ion-item>

            <!-- navigation button -->
            <ion-button fill="clear" @click="nextPage">
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </section>

      <!-- posts -->
      <section v-if="posts.length > 0">
        <ion-row v-for="(post, index) in posts" :key="post">
          <ion-col size="4">
            <img
              :src="coverToBase64(post.cover.source)"
              @click="openPost(post.id)"
              style="cursor: pointer"
            />
          </ion-col>
          <ion-col size="8">
            <h2
              style="margin-top: 4px; cursor: pointer"
              @click="openPost(post.id)"
            >
              {{ post.title }}
            </h2>
          </ion-col>
          <ion-col size="12" v-if="isUserAdmin">
            <ion-button fill="clear" @click="updatePost(post.id)">
              <ion-icon :icon="createOutline"></ion-icon>
            </ion-button>
            <ion-button fill="clear" @click="deletePost(post.id, index)">
              <ion-icon :icon="trashOutline" color="danger"></ion-icon>
            </ion-button>
          </ion-col>
          <hr />
        </ion-row>
      </section>

      <!-- empty icon -->
      <section v-if="posts.length == 0">
        <div class="align-vertical" v-if="posts.length == 0">
          <div>
            <img
              src="../../../../public/assets/otros/empty.png"
              alt=""
              style="width: 180px"
            />
            <p style="text-align: center">No exiten posts</p>
          </div>
        </div>
      </section>
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
  IonButton,
  IonIcon,
  IonButtons,
  IonDatetime,
  IonPopover,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  refreshOutline,
  addOutline,
  createOutline,
  trashOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import userService from "../../../services/user.vue";
import eventBus from "../../../EventBus";
import systemService from "../../../services/system.vue";
import postService from "../../../services/post.vue";
import formatISO from "date-fns/formatISO";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
    IonDatetime,
    IonPopover,
  },
  setup() {
    return {
      refreshOutline,
      addOutline,
      createOutline,
      trashOutline,
      chevronBackOutline,
      chevronForwardOutline,
    };
  },
  data() {
    return {
      posts: Array<any>(),
      isUserAdmin: false,
      currentPage: "",
      dates: Array<string>(),
      spinners: {
        buttonAddNewPost: false,
      },
    };
  },
  mounted() {
    eventBus().emitter.on("refresh-content", (response: any) => {
      if (response.event == "new-post") {
        // this.getPosts();
      }
    });

    eventBus().emitter.on("refresh-user-content", () => {
      this.verifyUserAdmin();
    });

    eventBus().emitter.on("event-posts2-data", (response: any) => {
      if (response.dates != undefined) this.dates = response.dates;

      if (response.currentPage != undefined) {
        const currentPage = response.currentPage;
        this.currentPage = currentPage;
      }

      if (response.posts) {
        this.posts = response.posts;
      }
    });
    this.verifyUserAdmin();
  },

  methods: {
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

    async nextPage() {
      eventBus().emitter.emit("event-posts1-data", {
        option: "next",
        currentPage: this.currentPage,
      });
    },

    async previousPage() {
      eventBus().emitter.emit("event-posts1-data", {
        option: "previous",
        currentPage: this.currentPage,
      });
    },

    async goToPage(date: string) {
      await (this.$refs.datetime as any).$el.confirm(true);
      const d = new Date(date).toISOString();
      eventBus().emitter.emit("event-posts1-data", {
        option: "goTo",
        currentPage: formatISO(new Date(d.replaceAll("Z", "")), {
          representation: "date",
        }),
      });
    },

    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },

    updatePost(id: string) {
      this.$router.push("/blog/editor/update/" + id);
    },

    async deletePost(id: string, index: number) {
      const response = await systemService().presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });
      if (response == false) return;

      const loading = await systemService().presentLoading({
        message: "Eliminando publicación",
      });
      loading.present();

      postService()
        .deletePost({ id })
        .then(() => {
          loading.dismiss();
          this.posts.splice(index, 1);
        })
        .catch((e) => {
          loading.dismiss();
          console.log(e);
        });
    },

    getDaysEnabled(date: string) {
      const result = this.dates.filter((element) => element == date);
      if (result.length > 0) {
        return true;
      }
      return false;
    },

    coverToBase64(cover: string) {
      return "data:image/png;base64," + cover;
    },

    async addPost() {
      this.spinners.buttonAddNewPost = true;
      await this.$router.push("/blog/editor/create");
      this.spinners.buttonAddNewPost = false;
    },
  },
});
</script>

<style scoped>
/* hr.style-five { */
/*   border: 0; */
/*   height: 0; 
*/
/*   box-shadow: 0 0 10px 1px #353535; */
/* } */
hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(32, 31, 31, 0.75),
    rgba(0, 0, 0, 0)
  );
  width: 100%;
  margin-bottom: 16px;
}

.pagination-selected {
  background: #3880ff;
  border-radius: 4px;
  color: white;
}

.align-vertical {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
