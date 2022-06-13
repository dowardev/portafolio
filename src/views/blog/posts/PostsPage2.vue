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

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
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
      <ion-item-divider sticky>
        <div style="width: 100%; display: flex; justify-content: center">
          <ion-button fill="clear" @click="previousPage()">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>

          <!-- pages -->
          <ion-item button="true" id="open-date-input" lines="none">
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
                locale="es-mx"
              ></ion-datetime>
            </ion-popover>
          </ion-item>

          <!-- navigation button -->
          <ion-button fill="clear" @click="nextPage()">
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
              :disabled="spinners.buttonEditPost ==post.id!"
            >
              <ion-icon
                :icon="createOutline"
                v-if="spinners.buttonEditPost ==''|| spinners.buttonEditPost != post.id!"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonEditPost==post.id!"
                color="primary"
              ></ion-spinner>
            </ion-button>

            <ion-button
              fill="clear"
              @click="deletePost(post.id!, index)"
              :disabled="spinners.buttonDeletePost ==post.id!"
            >
              <ion-icon
                :icon="trashOutline"
                color="danger"
                v-if="spinners.buttonDeletePost==''|| spinners.buttonDeletePost!= post.id!"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinners.buttonDeletePost==post.id!"
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
  IonItemDivider,
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
    IonItemDivider,
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
      pageTitle: "Blog",
    };
  },

  data() {
    return {
      isUserAdmin: false,
      spinners: {
        buttonAddNewPost: false,
        buttonEditPost: "",
        buttonDeletePost: "",
      },
    };
  },

  mounted() {
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
      this.spinners.buttonEditPost = id;
      await this.$router.push("/blog/editor/update/" + id);
      this.spinners.buttonEditPost = "";
    },

    async deletePost(id: string, index: number) {
      this.spinners.buttonDeletePost = id;

      const response = await systemService().presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });
      if (response == false) {
        this.spinners.buttonDeletePost = "";
        return;
      }

      postService()
        .deletePost({ id })
        .then(() => {
          this.spinners.buttonDeletePost = "";
          // eslint-disable-next-line
          this.posts!.splice(index, 1);
          systemService().openToast({ message: "Post eliminado" });
        })
        .catch((e) => {
          this.spinners.buttonDeletePost = "";
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
