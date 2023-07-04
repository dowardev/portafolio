<template>
  <ion-page>
    <ion-header :translucent="true" mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="center">
        <ion-col size-xs="12" size-md="11">
          <section class="section-options">
            <ion-row>
              <!-- date selector -->
              <ion-col size="6">
                <div
                  v-if="usePost().getDates()!.length>0 && usePost().getCurrentPage()!=undefined"
                  style="float: left"
                >
                  <DateSelectorComponent
                    @current-date-change="
                      loadPosts({
                        currentPage: usePost().getCurrentPage() as string,
                      })
                    "
                  ></DateSelectorComponent>
                </div>
              </ion-col>
              <!-- end dae selector -->

              <!-- more options -->
              <ion-col size="6">
                <div style="float: right">
                  <!-- button add postt -->
                  <ion-button
                    v-if="useUser().user.value.isAdmin"
                    fill="clear"
                    @click="addPost()"
                  >
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

                  <!-- button search post -->
                  <ion-button id="open-modal-search-post" fill="clear">
                    <ion-icon :icon="searchOutline"></ion-icon>
                  </ion-button>

                  <!-- button refresh content -->
                  <ion-button @click="refreshContent()" fill="clear">
                    <ion-icon :icon="refreshOutline"></ion-icon>
                  </ion-button>
                </div>
              </ion-col>
            </ion-row>
          </section>

          <!-- posts -->
          <section v-if="usePost().getPosts()!.length>0">
            <ion-row>
              <ion-col size="12" class="main-content">
                <ion-row class="card-main-content">
                  <ion-col
                    v-for="( post,indexPost ) in usePost().getPosts()!"
                    :key="post.id"
                    size-xs="12"
                    size-md="12"
                    size-lg="6"
                  >
                    <ion-card
                      v-if="(post.createdAt!).split('T')[0]==usePost().getCurrentPage() as string"
                      style="cursor: pointer"
                      :class="{
                        'element-post-selected': elementPostHover == indexPost,
                        'element-post-no-selected':
                          elementPostHover != indexPost,
                      }"
                      class="blur-element"
                      @mouseenter="elementPostHover = indexPost"
                      @mouseleave="elementPostHover = -1"
                    >
                      <ion-row
                        class="ion-padding-top ion-padding-start ion-padding-bottom"
                        @click="openPost(post.id!)"
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

                      <ion-item
                        v-if="useUser().user.value.isAdmin"
                        lines="none"
                        class="transparent"
                      >
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
                <!-- end posts -->
              </ion-col>
            </ion-row>
          </section>
        </ion-col>
      </ion-row>

      <section v-if="usePost().getPosts()!.length == 0 && loadFinished">
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

      <section
        v-if="usePost().getPosts()!.length == 0 && loadFinished == false"
      >
        <div class="align-vertical">
          <div class="center">
            <ion-item lines="none">
              <ion-spinner slot="start" name="crescent"></ion-spinner>
              <ion-label>Cargando</ion-label>
            </ion-item>
          </div>
        </div>
      </section>

      <!-- modals -->
      <!-- modal search posts -->
      <ion-modal
        ref="modalSearchPosts"
        trigger="open-modal-search-post"
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
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
  loadingController,
  IonModal,
  isPlatform,
  IonSearchbar,
  IonRow,
  IonCol,
  IonCard,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { openToast, presentAlertConfirmation } from "../../../services/system";
import {
  closeOutline,
  addOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  banOutline,
  searchOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "../../../services/graphql";
import { useUser } from "../../../composables/useUser";
import { usePost } from "../../../composables/usePost";
import { useSystem } from "../../../composables/useSystem";

// components
import DateSelectorComponent from "../../../components/posts/DateSelectorComponent.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");

const pageTitle = "Blog";
const spinners = ref({
  buttonAddPost: false,
  buttonAddNewPost: false,
  buttonEditPost: "",
});
const loadFinished = ref(false);
const searchResult = ref(Array<{ id: string; title: string }>());
const modalSearchPosts = ref(null);
const elementPostHover = ref(-1);

// mouted
onMounted(() => {
  loadContent({ refetch: true });
});

// functions
async function loadContent(params: { refetch: boolean }) {
  const refetch = params.refetch == false ? false : true;

  await getPostsDates({ refetch });

  let dates = Array<string>();
  dates = usePost().getDates()!;
  if (dates.length == 0) {
    loadFinished.value = true;
    return;
  }

  let currentPage = "";
  currentPage = loadData({ dates });
  usePost().updateCurrentPage({ currentPage });

  await loadPosts({
    currentPage,
    refetch,
  });
  loadFinished.value = true;
}

async function getPostsDates(params: { refetch: boolean }): Promise<void> {
  try {
    await usePost().loadDates({
      graphql: {
        name: POST_DATES,
        fragment: "PostDates",
        refetch: params.refetch,
      },
    });
  } catch (e: any) {
    console.error(e);
    useSystem().openToastError(e);
    throw e;
  }
}

function loadData(params: { dates: Array<string> }): string {
  let currentPage = "";
  if (route.params.date != undefined) {
    currentPage = params.dates.filter((element) => {
      if (element == route.params.date) return element;
    })[0];
  } else {
    currentPage = params.dates[0];
  }
  return currentPage;
}

async function loadPosts(params: { currentPage: string; refetch?: boolean }) {
  const refetch = params.refetch ? params.refetch : false;
  try {
    await usePost().loadPosts({
      date: params.currentPage,
      graphql: {
        name: ALL_POSTS_DETAILS,
        fragment: "PostsDetails",
        refetch,
      },
    });
  } catch (e: any) {
    console.error(e);
    useSystem().openToastError(e);
    throw e;
  }
}

async function addPost() {
  spinners.value.buttonAddPost = true;
  await router.push("/blog/editor/create");
  spinners.value.buttonAddPost = false;
}

function openPost(id: string) {
  router.push({ name: "PostPage", params: { id } });
}

async function updatePost(id: string) {
  spinners.value.buttonEditPost = id;
  await router.push("/blog/editor/update/" + id);
  spinners.value.buttonEditPost = "";
}

async function deletePost(params: { id: string }) {
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
    await usePost().deletePost({ id });
    loadContent({ refetch: true });
    openToast({ message: "Post eliminado" });
  } catch (error) {
    console.error(error);
  } finally {
    loading.dismiss();
  }
}

async function refreshContent() {
  loadContent({ refetch: true });
}

function closeModalSearchPosts() {
  (modalSearchPosts as any).$el.dismiss(null, "cancel");
}

async function searchPosts(params: { search: string; refetch: boolean }) {
  const search = params.search;
  const refetch = params.refetch;

  const searchResultResponse = await usePost().searchPosts({
    search,
    graphql: {
      refetch,
    },
  });
  searchResult.value = searchResultResponse;
}

async function openPostSearch(params: { id: string }) {
  const id = params.id;
  await router.push({ name: "PostPage", params: { id } });
  closeModalSearchPosts();
}
</script>

<style scoped>
.align-vertical {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.sticky {
  position: sticky;
  z-index: 3;
  top: 0px;
}

.element-post-selected {
  border: 1px solid var(--ion-color-primary);
}

.element-post-no-selected {
  border: 1px solid var(--ion-background-color);
}

.card-main-content {
  height: 82vh;
  overflow: auto;
}

ion-content {
  --overflow: hidden;
}
</style>
