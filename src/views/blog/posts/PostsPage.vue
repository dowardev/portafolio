<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
          <!-- <DateSelectorComponent></DateSelectorComponent> -->
          <ion-button
            v-if="userController.getUser()?.isAdmin"
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

          <ion-button @click="previousDate()">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>

          <ion-button @click="nextDate()">
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>

          <!-- button more options -->
          <ion-button
            fill="clear"
            @click="
              popOverMainOPtions.event = $event;
              popOverMainOPtions.isOpen = true;
            "
          >
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- progress bar -->
        <ion-progress-bar
          v-if="postController.getPosts()!.length == 0 && loadFinished == false"
          class="primary-progress-bar"
          type="indeterminate"
        ></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- posts -->
      <ion-row v-if="postController.getPosts()!.length > 0">
        <ion-col
          v-for="(post, indexPost) in filterPosts"
          :key="post.id"
          size="12"
          size-md="6"
        >
          <ion-card class="primary-select-animated" style="cursor: pointer">
            <ion-row>
              <!-- img post -->
              <ion-col
                size="4"
                style="
                  padding-bottom: 0px;
                  padding-left: 0px;
                  padding-top: 0px;
                  cursor: pointer;
                "
                @click="openPost(post.id!)"
              >
                <img
                  :src="post.cover.url"
                  @click="openPost(post.id!)"
                  style="
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    width: 500px;
                    height: 100%;
                  "
                />
              </ion-col>

              <ion-col size="8">
                <ion-row>
                  <ion-col
                    :size="userController.getUser()?.isAdmin ? 10 : 12"
                    @click="openPost(post.id!)"
                    style="cursor: pointer"
                  >
                    <ion-card-title class="truncate-text">
                      {{ post.title }}
                    </ion-card-title>
                  </ion-col>

                  <ion-col size="2" v-if="userController.getUser()?.isAdmin">
                    <ion-button
                      fill="clear"
                      @click="
                        idPostSelected = parseInt(post.id);
                        popoverPostOptions.event = $event;
                        popoverPostOptions.isOpen = true;
                      "
                    >
                      <ion-icon :icon="ellipsisVerticalOutline"> </ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>

                <!-- options post -->
                <ion-row @click="openPost(post.id!)" style="cursor: pointer">
                  <ion-col size="6">
                    <ion-chip
                      v-if="userController.getUser()?.isAdmin"
                      :color="
                        post.status == 'active'
                          ? 'success'
                          : post.status == 'inactive'
                            ? 'danger'
                            : 'warning'
                      "
                      >{{ post.status }}</ion-chip
                    >
                  </ion-col>
                </ion-row>
              </ion-col>
            </ion-row>
          </ion-card>
        </ion-col>
      </ion-row>
      <!-- end posts -->

      <!-- no posts -->
      <section v-if="postController.getPosts()!.length == 0 && loadFinished">
        <div class="center">
          <ion-item lines="none">
            <ion-icon slot="start" :icon="banOutline" color="danger"></ion-icon>
            <ion-label color="danger">No se encontraron datos</ion-label>
          </ion-item>
        </div>
      </section>

      <!-- loading posts -->
      <section
        v-if="postController.getPosts()!.length == 0 && loadFinished == false"
      >
        <ion-row>
          <ion-col size="12" class="center" style="height: 91dvh">
            <ion-item style="width: 20dvw; display: flex" lines="none">
              <ion-label>Cargando, por favor espere</ion-label>
              <ion-spinner name="dots"></ion-spinner>
            </ion-item>
          </ion-col>
        </ion-row>
      </section>
    </ion-content>

    <!-- modals -->
    <!-- modal search posts -->
    <ion-modal
      ref="modalSearchPosts"
      :is-open="isOpenSearchModal"
      mode="md"
      @did-dismiss="isOpenSearchModal = false"
    >
      <ion-header mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="isOpenSearchModal = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>Búsqueda</ion-title>
        </ion-toolbar>

        <ion-toolbar>
          <ion-searchbar
            :debounce="550"
            @ion-input="
              searchPosts({
                search: $event.detail.value as string,
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

    <!-- popovers -->
    <ion-popover
      :is-open="popOverMainOPtions.isOpen"
      @didDismiss="popOverMainOPtions.isOpen = false"
      :event="popOverMainOPtions.event"
      ><ion-content>
        <!-- search -->
        <ion-item
          lines="full"
          button
          @click="
            isOpenSearchModal = true;
            popOverMainOPtions.isOpen = false;
          "
          ><ion-icon slot="start" :icon="searchOutline"></ion-icon
          ><ion-label>Buscar</ion-label></ion-item
        >

        <!-- refresh -->
        <ion-item
          lines="full"
          button
          @click="
            refreshContent();
            popOverMainOPtions.isOpen = false;
          "
          ><ion-icon slot="start" :icon="refreshOutline"></ion-icon
          ><ion-label>Refrescar</ion-label></ion-item
        >

        <!-- filter -->
        <ion-list v-if="userController.getUser()?.isAdmin">
          <ion-list-header>
            <ion-label>Filtro</ion-label>
          </ion-list-header>

          <ion-radio-group :value="filter.selected">
            <ion-item
              lines="full"
              v-for="(option, key) in filter.options"
              :key="key"
            >
              <ion-radio
                label-placement="end"
                slot="start"
                :value="key"
                @click="
                  filter.selected = key;
                  loadContent({ status: key });
                "
                >{{ option }}</ion-radio
              >
            </ion-item>
          </ion-radio-group>
        </ion-list>
      </ion-content>
    </ion-popover>

    <!-- popover post options -->
    <ion-popover
      :is-open="popoverPostOptions.isOpen"
      :event="popoverPostOptions.event"
      :dismiss-on-select="true"
      @didDismiss="popoverPostOptions.isOpen = false"
    >
      <ion-content>
        <ion-item
          button
          lines="full"
          class="transparent"
          @click="updatePost(idPostSelected!.toString())"
        >
          <ion-icon slot="start" :icon="createOutline"> </ion-icon>

          <ion-label>Editar</ion-label>
        </ion-item>

        <ion-item
          button
          v-if="userController.getUser()?.isAdmin"
          lines="none"
          class="transparent"
          @click="deletePost({ id: idPostSelected!.toString() })"
        >
          <ion-icon slot="start" :icon="trashOutline" color="danger"></ion-icon>

          <ion-label>Eliminar</ion-label>
        </ion-item>
      </ion-content>
    </ion-popover>
  </ion-page>
</template>

<script setup lang="ts">
import { IonItem, loadingController, IonPage } from "@ionic/vue";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  addOutline,
  banOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  ellipsisVerticalOutline,
  filterOutline,
  refreshOutline,
  searchOutline,
  trashOutline,
} from "ionicons/icons";

// controllers
import UserController from "@/controllers/userController";
import PostController from "@/controllers/postController";
import SystemController from "@/controllers/systemController";
const userController = new UserController();
const postController = new PostController();
const systemController = new SystemController();

// components
import DateSelectorComponent from "@/components/posts/DateSelectorComponent.vue";
import { onMounted } from "vue";
import { is } from "date-fns/locale";
import { filterPostOptions } from "@/services/types";

// vars
const pageTitle = ref("Blog");
const spinners = ref({
  buttonAddPost: false,
  buttonAddNewPost: false,
  buttonEditPost: "",
});
const route = useRoute();
const router = useRouter();
const isOpenSearchModal = ref(false);
const loadFinished = ref(false);
const searchResult = ref(Array<{ id: string; title: string }>());
const currentPage = ref("");
let dates = reactive([] as Array<string>);
const index = ref();
const currentPageIndex = ref(0);
const popOverMainOPtions = ref({ isOpen: false, event: Event });
const filter = reactive({
  selected: "active" as filterPostOptions,
  options: {
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
    draft: "Borrador",
  },
});
const popoverPostOptions = ref({ isOpen: false, event: Event });
const idPostSelected = ref<undefined | number>(undefined);

// computed
const filterPosts = computed(() => {
  const posts = postController.getPosts()!;
  const result = posts.filter(
    (post) => post.createdAt!.split("T")[0] == postController.getCurrentPage()
  );
  return result;
});

watch(
  () => postController.getDates(),
  (newValue) => {
    dates = newValue as any;
  }
);
watch(
  () => postController.getCurrentPage(),
  (newValue) => {
    currentPage.value = newValue as string;
  }
);
watch(
  () => dates,
  (newValue) => {
    index.value = newValue.indexOf(currentPage.value);
    currentPageIndex.value = index.value;
  }
);
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith("/blog")) {
      loadContent({ status: filter.selected });
    }
  },
  { immediate: true }
);

// functions
async function addPost(): Promise<void> {
  spinners.value.buttonAddPost = true;
  await router.push("/blog/editor/create");
  spinners.value.buttonAddPost = false;
}

async function refreshContent(): Promise<void> {
  loadContent({ status: filter.selected });
}

async function loadContent(params: {
  status: filterPostOptions;
}): Promise<void> {
  const { status } = params;

  try {
    await getPostsDates({ status });

    let dates: undefined | string[] = undefined;
    dates = postController.getDates()!;
    if (dates == undefined) return;

    let currentPage = "";
    currentPage = loadData({ dates });
    postController.updateCurrentPage({ currentPage });

    await postController.loadPosts({
      date: currentPage,
      filter: status,
    });
  } catch (error: any) {
    console.error(error.message);
  } finally {
    loadFinished.value = true;
  }
}

async function getPostsDates(params: {
  status: filterPostOptions;
}): Promise<void> {
  const { status } = params;

  try {
    await postController.loadDates({ status });
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
    throw e;
  }
}

function loadData(params: { dates: Array<string> }): string {
  if (route.params.date != undefined) {
    currentPage.value = params.dates.filter((element) => {
      if (element == route.params.date) return element;
    })[0];
  } else {
    currentPage.value = params.dates[0];
  }
  return currentPage.value;
}

async function searchPosts(params: { search: string }): Promise<void> {
  const search = params.search;

  const searchResultResponse = await postController.searchPosts({
    search,
  });
  searchResult.value = searchResultResponse;
}

async function openPostSearch(params: { id: string }): Promise<void> {
  const id = params.id;
  await router.push({ name: "PostPage", params: { id } });
  closeModalSearchPosts();
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
  const response = await systemController.presentAlertConfirmation({
    message: "¿Desea eliminar el post?",
  });

  if (response == false) return;

  const loading = await loadingController.create({
    message: "Eliminando publicación",
  });

  loading.present();
  try {
    await postController.deletePost({ id });
    loadContent({ status: filter.selected });
    await systemController.presentToast({ message: "Post eliminado" });
  } catch (error) {
    console.error(error);
  } finally {
    loading.dismiss();
  }
}

function closeModalSearchPosts() {
  // (modalSearchPosts as any).$el.dismiss(null, "cancel");
}

async function nextDate(): Promise<void> {
  const newDateIndex = +currentPageIndex.value + 1;

  if (newDateIndex >= dates.length) return;

  // console.log({ old: currentPage.value, new: dates[newDateIndex], dates });
  currentPage.value = dates[newDateIndex];
  currentPageIndex.value = newDateIndex;

  updatecurrentPage();
  // emits("currentPageChange");

  try {
    await postController.loadPosts({
      date: currentPage.value,
    });
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
    throw e;
  }
}

async function previousDate(): Promise<void> {
  const newDateIndex = +currentPageIndex.value - 1;

  if (newDateIndex < 0) return;

  currentPage.value = dates[newDateIndex];
  currentPageIndex.value = newDateIndex;

  updatecurrentPage();

  try {
    await postController.loadPosts({
      date: currentPage.value,
    });
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
    throw e;
  }
}

async function selectDate(params: { date: string }): Promise<void> {
  const date = params.date;
  currentPageIndex.value = dates.indexOf(date);
  updatecurrentPage();

  try {
    await postController.loadPosts({
      date: currentPage.value,
    });
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
    throw e;
  }
}

function updatecurrentPage(): void {
  postController.updateCurrentPage({ currentPage: currentPage.value });
}
</script>

<style scoped>
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
