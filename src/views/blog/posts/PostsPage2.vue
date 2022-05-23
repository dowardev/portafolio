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
        <ion-buttons
          slot="end"
          :disabled="spinners.buttonAddNewPost"
          :collapse="true"
        >
          <ion-button @click="addPost()" v-if="isUserAdmin">
            <ion-icon
              :icon="addOutline"
              v-if="spinners.buttonAddNewPost == false"
            ></ion-icon>
            <ion-spinner
              name="crescent"
              v-if="spinners.buttonAddNewPost"
              color="primary"
            ></ion-spinner>
          </ion-button>
          <ion-button @click="refreshContent">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>Blog</h1>
          <ion-buttons
            slot="end"
            :disabled="spinners.buttonAddNewPost"
            :collapse="true"
          >
            <ion-button @click="addPost()" v-if="isUserAdmin">
              <ion-icon
                :icon="addOutline"
                v-if="spinners.buttonAddNewPost == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonAddNewPost"
                color="primary"
              ></ion-spinner>
            </ion-button>
            <ion-button @click="refreshContent">
              <ion-icon :icon="refreshOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- date selector -->
      <section>
        <ion-row v-if="dates!.length > 0">
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
              v-if="dates!.length > 0"
            >
              <ion-text style="color: var(--accent-color) !important">
                {{ currentPage }}
              </ion-text>
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
      <section v-if="posts!.length > 0">
        <ion-row v-for="(post, index) in posts" :key="post">
          <ion-col size="4">
            <img
              :src="coverToBase64(post.cover.source!)"
              @click="openPost(post.id!)"
              style="cursor: pointer"
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

          <ion-col size="12" v-if="isUserAdmin">
            <ion-button
              fill="clear"
              @click="updatePost(post.id!)"
              :disabled="spinners.buttonEditPost"
            >
              <ion-icon
                :icon="createOutline"
                v-if="spinners.buttonEditPost == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonEditPost"
                color="primary"
              ></ion-spinner>
            </ion-button>

            <ion-button
              fill="clear"
              @click="deletePost(post.id!, index)"
              :disabled="spinners.buttonDeletePost"
            >
              <ion-icon
                :icon="trashOutline"
                color="danger"
                v-if="spinners.buttonDeletePost == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonDeletePost"
                color="danger"
              ></ion-spinner>
            </ion-button>
          </ion-col>
          <hr />
        </ion-row>
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
import { defineComponent, PropType } from "vue";
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
import { Post } from "@/services/interfaces.vue";

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

  props: {
    dates: { type: Array as PropType<string[]> },
    currentPage: { type: String },
    posts: { type: Array as PropType<Post[]> },
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
      isUserAdmin: false,
      spinners: {
        buttonAddNewPost: false,
        buttonEditPost: false,
        buttonDeletePost: false,
      },
    };
  },
  mounted() {
    this.verifyUserAdmin();
    eventBus().emitter.on("refresh-user-content", () => {
      this.verifyUserAdmin();
    });
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
      this.$emit("nextPage", { currentPage: this.currentPage });
    },

    async previousPage() {
      this.$emit("previousPage", { currentPage: this.currentPage });
    },

    async goToPage(date: string) {
      await (this.$refs.datetime as any).$el.confirm(true);
      const d = new Date(date).toISOString();
      this.$emit("goToPage", {
        currentPage: formatISO(new Date(d.replaceAll("Z", "")), {
          representation: "date",
        }),
      });
    },

    openPost(id: string) {
      this.$router.push({ name: "PostPage", params: { id } });
    },

    async updatePost(id: string) {
      this.spinners.buttonEditPost = true;
      await this.$router.push("/blog/editor/update/" + id);
      this.spinners.buttonEditPost = false;
    },

    async deletePost(id: string, index: number) {
      this.spinners.buttonDeletePost = true;

      const response = await systemService().presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });
      if (response == false) {
        this.spinners.buttonDeletePost = false;
        return;
      }

      postService()
        .deletePost({ id })
        .then(() => {
          this.spinners.buttonDeletePost = false;
          // eslint-disable-next-line
          this.posts!.splice(index, 1);
        })
        .catch((e) => {
          this.spinners.buttonDeletePost = false;
          console.log(e);
        });
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

    async addPost() {
      this.spinners.buttonAddNewPost = true;
      await this.$router.push("/blog/editor/create");
      this.spinners.buttonAddNewPost = false;
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
