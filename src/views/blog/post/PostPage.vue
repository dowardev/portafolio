<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title
          v-if="usePost.getPost({ id: postId as string })! != undefined"
        >
          {{ usePost.getPost({ id: postId })!.title }}
        </ion-title>

        <ion-buttons
          v-if="useUser.user.value.isAdmin"
          slot="end"
          :collapse="true"
        >
          <ion-button fill="clear" @click="updatePost()">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="deletePost()">
            <ion-icon :icon="trashOutline" color="danger"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button
            v-if="hideIndexContentComponentvalue == false"
            @click="openModalIndexContent()"
          >
            <ion-icon :icon="menuOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content
      v-if="usePost.getPost({ id: postId }) != undefined"
      :fullscreen="true"
    >
      <div>
        <section class="content-container">
          <div>
            <div>
              <ion-row class="hidde-scroll">
                <ion-col
                  size="4"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    <img
                      :src="usePost.getPost({ id: postId })!.cover.source"
                      alt=""
                    />
                  </div>
                </ion-col>

                <ion-col size="8">
                  <section>
                    <ion-header collapse="condense" mode="ios">
                      <ion-toolbar>
                        <div>
                          <div>
                            <!-- post title -->
                            <h1>
                              {{ usePost.getPost({ id: postId })!.title }}
                            </h1>

                            <!-- options post -->
                            <ion-buttons
                              v-if="useUser.user.value.isAdmin"
                              slot="end"
                              :collapse="true"
                            >
                              <ion-button
                                fill="clear"
                                :disabaled="spinners.buttonUpdate == true"
                                @click="updatePost()"
                              >
                                <ion-icon
                                  v-if="spinners.buttonUpdate == false"
                                  :icon="createOutline"
                                ></ion-icon>
                                <ion-spinner
                                  v-if="spinners.buttonUpdate == true"
                                  name="crescent"
                                ></ion-spinner>
                              </ion-button>

                              <ion-button
                                fill="clear"
                                :disabaled="spinners.buttonDelete == true"
                                @click="deletePost()"
                              >
                                <ion-icon
                                  v-if="spinners.buttonDelete == false"
                                  :icon="trashOutline"
                                  color="danger"
                                ></ion-icon>
                                <ion-spinner
                                  v-if="spinners.buttonDelete == true"
                                  name="crescent"
                                ></ion-spinner>
                              </ion-button>
                            </ion-buttons>
                          </div>
                        </div>
                      </ion-toolbar>
                    </ion-header>
                  </section>

                  <!-- post data -->
                  <section>
                    <!-- date created -->
                    <div>
                      <div>
                        <p
                          v-if="usePost.getPost({ id: postId })!.createdAt"
                          class="post-date"
                        >
                          Creación del post:
                          {{
                            format(
                              new Date(
                                usePost.getPost({ id: postId })!
                                  .createdAt as string
                              ),
                              "P",
                              { locale: locale.es }
                            ) +
                            " " +
                            format(
                              new Date(
                                usePost.getPost({ id: postId })!
                                  .createdAt as string
                              ),
                              "p"
                            )
                          }}
                        </p>

                        <!-- date updates -->
                        <p
                          v-if="usePost.getPost({ id: postId })!.updatedAt"
                          class="post-date"
                        >
                          Ultimá actualización del post:
                          {{
                            format(
                              new Date(
                                usePost.getPost({ id: postId })!
                                  .updatedAt as string
                              ),
                              "P"
                            ) +
                            " " +
                            format(
                              new Date(
                                usePost.getPost({ id: postId })!
                                  .updatedAt as string
                              ),
                              "p"
                            )
                          }}
                        </p>
                      </div>
                    </div>
                  </section>
                </ion-col>
              </ion-row>

              <!-- content -->
              <ion-row>
                <ion-col>
                  <MarkdownItComponent
                    :source="usePost.getPost({ id: postId })!.content"
                  />
                </ion-col>
              </ion-row>
            </div>
          </div>
        </section>

        <!-- index content -->
        <section v-if="hideIndexContentComponentvalue" class="indexContent">
          <indexContentComponent
            :index-content="indexContent"
            :auto-hide-content="hideContentIndexValue"
            @element-id="goToSection({ id: $event })"
          />
        </section>
      </div>
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
  IonButtons,
  IonIcon,
  IonRow,
  IonCol,
  isPlatform,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { deletePost } from "../../../services/post";
import {
  alertCircleOutline,
  chevronBackOutline,
  createOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import {
  presentLoading,
  presentAlertConfirmation,
  getTheme,
} from "../../../services/system";
import eventBus from "../../../EventBus";
import { POST_DETAILS } from "../../../services/graphql";
import { usePost } from "../../../composables/usePost";
import { useUser } from "../../../composables/useUser";
import { format, formatISO } from "date-fns";
import { useSystem } from "../../../composables/useSystem";
import MarkdownItComponent from "../../../components/markdownit/MarkdownItComponent.vue";
import { es } from "date-fns/locale";
import indexContentComponent from "./indexContentComponent.vue";
import modalIndexContent from "./modalIndexContent.vue";

export default defineComponent({
  name: "PostPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonRow,
    IonCol,
    MarkdownItComponent,
    indexContentComponent,
  },

  setup() {
    const hideContentIndexValue = isPlatform("desktop") == true ? true : false;
    const hideIndexContentComponentvalue =
      isPlatform("desktop") == true ? true : false;

    return {
      chevronBackOutline,
      createOutline,
      trashOutline,
      useUser: useUser(),
      usePost: usePost(),
      format: format,
      openToastError: useSystem().openToastError,
      locale: { es: es },
      formatISO,
      alertCircleOutline,
      hideContentIndexValue,
      hideIndexContentComponentvalue,
      menuOutline,
    };
  },

  data() {
    return {
      postId: this.$route.params.id as string,
      post: {
        title: "",
        content: "",
        cover: "",
        created: "",
        updated: "",
      },
      spinners: { buttonUpdate: false, buttonDelete: false },
      indexContent: [] as Array<{ name: string; id: string; type: string }>,
    };
  },

  mounted() {
    this.start();
  },

  methods: {
    async start() {
      await this.getPost();
      await this.setThemeCodePreview();
      this.generarIndexContent();
    },

    async getPost() {
      const loading = await presentLoading({
        message: "Obteniendo publicación",
      });
      loading.present();

      try {
        await this.usePost.loadPost({
          id: this.postId,
          graphql: {
            name: POST_DETAILS,
            fragment: "PostDetails",
            refetch: false,
          },
        });
      } catch (e: any) {
        console.error(e);
      } finally {
        loading.dismiss();
      }
    },

    setData(data: {
      title: string;
      content: string;
      coverSource: string;
      created: string;
      updated: string;
    }) {
      this.post.title = data.title;
      this.post.content = data.content;
      this.post.cover = "data:image/png;base64," + data.coverSource;
      this.post.created = data.created;
      this.post.updated = data.updated;
    },

    async updatePost() {
      this.spinners.buttonUpdate = true;
      await this.$router.push("/blog/editor/update/" + this.postId);
      this.spinners.buttonUpdate = false;
    },

    async deletePost() {
      this.spinners.buttonDelete = true;

      const alertResponse = await presentAlertConfirmation({
        message: "¿Desea eliminar el post?",
      });

      if (alertResponse == false) {
        this.spinners.buttonDelete = false;
        return;
      }

      try {
        await deletePost({ id: this.postId as string });
        this.spinners.buttonDelete = false;
        this.$router.go(-1);
        eventBus().emitter.emit("new-post");
      } catch (e: any) {
        this.spinners.buttonDelete = false;
        this.openToastError(e);
      }
    },

    async setThemeCodePreview() {
      const theme = await getTheme();
      let file = "" as any;

      if (theme == "nord")
        file = await import(
          "../../../../node_modules/highlight.js/styles/atom-one-dark.css"
        );
      if (theme == "gruvbox")
        file = await import(
          "../../../../node_modules/highlight.js/styles/dark.css"
        );
      if (theme == "light")
        file = await import(
          "../../../../node_modules/highlight.js/styles/atom-one-light.css"
        );

      const cssNode = document.createElement("style");
      cssNode.innerHTML = file.default;
      document.head.appendChild(cssNode);
    },

    generarIndexContent() {
      const headings = this.$el.querySelectorAll("h2, h3, h4, h5, h6");

      let count = 0;
      headings.forEach(
        (heading: { id: string; textContent: string; tagName: string }) => {
          heading.id = count.toString();

          this.indexContent.push({
            name: heading.textContent as string,
            id: count.toString(),
            type: heading.tagName.toLowerCase(),
          });

          count++;
        }
      );
    },

    goToSection(params: { id: string }) {
      const id = params.id;
      const element = document.getElementById(id);
      if (element)
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    },

    async openModalIndexContent() {
      const modal = await modalController.create({
        component: modalIndexContent,
        componentProps: {
          indexContent: this.indexContent,
        },
      });
      modal.present();

      const { data } = await modal.onWillDismiss();
      if (data != null) {
        const elementId = data.elementId;
        this.goToSection({ id: elementId });
      }
    },
  },
});
</script>

<style scoped>
.post-date {
  font-size: 12px !important;
}

.content-container {
  width: 100%;
}

.content-container > div {
  display: flex;
  justify-content: center;
}

.content-container > div > div {
  width: 90%;
}

.indexContent {
  position: fixed;
  top: 8vh;
  right: 0;
  width: 24%;
  display: none;
}

@media only screen and (min-width: 768px) {
  .content-container {
    width: 100%;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 70%;
  }
}

@media only screen and (min-width: 992px) {
  .content-container {
    width: 70%;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 60%;
  }
}

@media only screen and (min-width: 1200px) {
  .content-container {
    width: 70%;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 60%;
  }

  .indexContent {
    display: block;
  }
}
</style>
