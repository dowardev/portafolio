<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end" :mode="designPlatform">
        <DateSelectorComponent :loading="dateLoading"></DateSelectorComponent>
        <ion-button
          v-if="userController.hasRole({ slug: 'admin' })"
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

        <ion-button fill="clear" @click="previousDate()">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>

        <ion-button fill="clear" @click="nextDate()">
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
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <!-- posts -->
    <section v-if="posts.length > 0">
      <ion-row class="ion-justify-content-center" style="display: flex">
        <ion-col size-xs="12" size-md="8" size-lg="4">
          <div
            v-for="post in filterPosts"
            :key="post.id"
            class="ion-justify-content-center"
            style="display: flex"
          >
            <ion-card
              class="card-post no-shadow post-background"
              @mouseover="postHoverId = post.id"
              @mouseleave="postHoverId = -1"
              @touchstart="handleTouchStart({ postId: post.id, event: $event })"
              @touchend="handleTouchEnd"
            >
              <ion-card-content>
                <div
                  style="display: flex; cursor: pointer"
                  class="ion-justify-content-between"
                  @click="openPost({ id: post.id })"
                >
                  <div style="display: flex" class="ion-align-items-center">
                    <span>
                      {{ post.title }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="userController.hasRole({ slug: 'admin' })"
                  class="ion-padding-top ion-justify-content-end"
                  style="display: flex; height: 46px"
                >
                  <ion-chip
                    :color="getPostStatusColor({ status: post.status })"
                  >
                    {{ post.status }}
                  </ion-chip>

                  <transition name="slide-fade-post-action-buttons">
                    <div
                      v-if="post.id == postHoverId"
                      class="action-post-buttons"
                    >
                      <ion-button fill="clear">
                        <ion-icon :icon="createOutline"></ion-icon>
                      </ion-button>

                      <ion-button
                        color="danger"
                        fill="clear"
                        @click="
                          idPostSelected = post.id;
                          isAlertDeletePostOpen = true;
                        "
                      >
                        <ion-icon :icon="trashOutline"></ion-icon>
                      </ion-button>
                    </div>
                  </transition>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </ion-col>
      </ion-row>
    </section>

    <!-- end posts -->

    <!-- no posts -->
    <section v-if="posts.length == 0 && loadFinished">
      <div class="center">
        <ion-item lines="none">
          <ion-icon slot="start" :icon="banOutline" color="danger"></ion-icon>
          <ion-label color="danger">No se encontraron datos</ion-label>
        </ion-item>
      </div>
    </section>

    <!-- loading skeleton -->
    <section v-if="posts.length == 0 && !loadFinished">
      <ion-row class="ion-justify-content-center">
        <ion-col size-xs="12" size-md="8" size-lg="4">
          <div v-for="n in 5" :key="n" class="ion-justify-content-center" style="display: flex">
            <ion-card class="card-post no-shadow">
              <ion-card-content>
                <ion-item lines="none" class="transparent">
                  <ion-skeleton-text animated style="width: 80%; height: 24px"></ion-skeleton-text>
                </ion-item>
                <ion-item lines="none" class="transparent">
                  <ion-skeleton-text animated style="width: 40%; height: 16px"></ion-skeleton-text>
                </ion-item>
              </ion-card-content>
            </ion-card>
          </div>
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
  <!-- popover main options -->
  <ion-popover
    :is-open="popOverMainOPtions.isOpen"
    :event="popOverMainOPtions.event"
    :show-backdrop="false"
    @did-dismiss="popOverMainOPtions.isOpen = false"
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
      <ion-list v-if="userController.hasRole({ slug: 'admin' })">
        <ion-list-header>
          <ion-label>Filtro</ion-label>
        </ion-list-header>

        <ion-radio-group :value="filter.selected">
          <ion-item
            v-for="(option, key) in filter.options"
            :key="key"
            lines="full"
          >
            <ion-radio
              slot="start"
              label-placement="end"
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
    :dismiss-on-select="false"
    @did-dismiss="popoverPostOptions.isOpen = false"
  >
    <ion-content>
      <ion-row>
        <ion-col>
          <CardOptionsExpand
            :expanded="cardDeletePostOptions.expanded"
            :border="{
              active:
                cardDeletePostOptions.expanded || cardDeletePostOptions.hover,
              type: 'solid',
              color: 'primary',
            }"
            class="no-shadow"
            @mouseover="cardDeletePostOptions.hover = true"
            @mouseleave="cardDeletePostOptions.hover = false"
          >
            <template #header>
              <ion-item
                :lines="cardDeletePostOptions.expanded ? 'full' : 'none'"
                button
                @click="
                  cardDeletePostOptions.expanded =
                    !cardDeletePostOptions.expanded
                "
              >
                <ion-icon
                  slot="start"
                  :icon="trashOutline"
                  color="danger"
                ></ion-icon>
                <ion-label color="danger">Borrar</ion-label>
              </ion-item>
            </template>

            <template #content>
              <ion-item
                button
                @click="
                  cardDeletePostOptions.expanded = false;
                  popoverPostOptions.isOpen = false;
                "
              >
                <ion-label>No</ion-label>
              </ion-item>

              <ion-item button @click="deletePost({ id: idPostSelected })">
                <ion-label color="danger">Si</ion-label>
              </ion-item>
            </template>
          </CardOptionsExpand>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <!-- update post -->
          <ion-item
            button
            lines="full"
            class="transparent"
            @click="updatePost({ id: idPostSelected!.toString() })"
          >
            <ion-icon slot="start" :icon="createOutline"> </ion-icon>

            <ion-label>Editar</ion-label>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-popover>

  <!-- alerts -->
  <ion-alert
    :is-open="isAlertDeletePostOpen"
    header="Eliminar post"
    message="Continuar?"
    :buttons="alertDeletePostButtons"
    @did-dismiss="isAlertDeletePostOpen = false"
  ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonModal, IonPage, IonPopover, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSkeletonText, IonSpinner, IonTitle, IonToolbar, isPlatform } from "@ionic/vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  addOutline,
  banOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  ellipsisVerticalOutline,
  refreshOutline,
  searchOutline,
  trashOutline,
} from "ionicons/icons";

// controllers
import UserController from "@/controllers/userController";
import PostController from "@/controllers/postController";
import SystemController from "@/controllers/systemController";
import ErrorController from "@/controllers/errorController";
const userController = new UserController();
const postController = new PostController();
const systemController = new SystemController();
const errorController = new ErrorController();

// components
import type { filterPostOptions } from "@/controllers/postController";
import { CardOptionsExpand } from "ionic-extra-components";
import DateSelectorComponent from "@/components/posts/DateSelectorComponent.vue";

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
const navigating = ref(false);
const dateLoading = ref(false);
const searchResult = ref(Array<{ id: string; title: string }>());
const currentPage = ref("");
const dates = computed(() => postController.dates.value ?? []);
const index = ref(-1);
const currentPageIndex = ref(0);
const popOverMainOPtions = ref({
  isOpen: false,
  event: undefined as Event | undefined,
});
const filter = reactive({
  selected: "active" as filterPostOptions,
  options: {
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
    draft: "Borrador",
  },
});
const popoverPostOptions = ref({ isOpen: false, event: {} as MouseEvent });
const idPostSelected = ref(-1);
const touchTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const designPlatform = isPlatform("ios") ? "ios" : "md";
const postProgress = ref({ status: false, id: "", color: "" });
const postHoverId = ref(-1);
const isAlertDeletePostOpen = ref(false);
const alertDeletePostButtons = [
  {
    text: "Cancelar",
    role: "cancel",
    handler: () => {
      // console.log("Alert canceled");
    },
  },
  {
    text: "Confirmar",
    role: "confirm",
    cssClass: "alert-delete-post-button-confirm",
    handler: async () => {
      await deletePost({ id: idPostSelected.value });
    },
  },
];
const cardDeletePostOptions = reactive({ expanded: false, hover: false });
// end vars

// computed
const posts = computed(() => postController.getPosts() ?? []);
const filterPosts = computed(() => {
  const posts = postController.getPosts()!;
  const currentPage = postController.getCurrentPage();
  const result = posts.filter(
    (post) => post.createdAt!.split("T")[0] == currentPage,
  );
  return result;
});
// end computed

// watch
watch(
  () => postController.getCurrentPage(),
  (newValue) => {
    currentPage.value = newValue ?? "";
  },
);
watch(
  dates,
  (newValue) => {
    index.value = newValue.indexOf(currentPage.value);
    currentPageIndex.value = index.value;
  },
);

// load posts
onMounted(async () => {
  const routeDate = route.params.date as string | undefined;
  if (routeDate && routeDate !== '') {
    await loadContent({ status: filter.selected });
  } else {
    navigating.value = true;
    await loadContent({ status: filter.selected });
    const page = postController.getCurrentPage();
    if (page) {
      await router.replace({ name: "PostsPage", params: { date: page } });
    }
    navigating.value = false;
  }
})

watch(
  () => route.params.date as string | undefined,
  (newDate) => {
    if (navigating.value) return;
    if (newDate && newDate !== '') {
      loadContent({ status: filter.selected });
    }
  },
);
// end watch

// functions
async function addPost(): Promise<void> {
  spinners.value.buttonAddPost = true;
  await router.push({ name: "CreatePostPage" });
  spinners.value.buttonAddPost = false;
}

async function refreshContent(): Promise<void> {
  postController.clearCache()
  await loadContent({ status: filter.selected });
}

async function loadContent(params: {
  status: filterPostOptions;
}): Promise<void> {
  const { status } = params;
  loadFinished.value = false;
  dateLoading.value = true;
  openPostLoader({ id: "" });

  try {
    const routeDate = route.params.date as string | undefined;
    if (routeDate && routeDate !== '') {
      await Promise.all([
        getPostsDates({ status }),
        postController.loadPosts({
          date: routeDate,
          filter: status,
          fields: ["id", "title", "cover", "created_at", "status"],
        }),
      ]);

      const datesArray = postController.getDates()!;
      if (datesArray == undefined) return;

      currentPage.value = loadData({ dates: datesArray });
      postController.updateCurrentPage({ currentPage: currentPage.value });
    } else {
      await getPostsDates({ status });

      const datesArray = postController.getDates()!;
      if (datesArray == undefined) return;

      currentPage.value = loadData({ dates: datesArray });
      postController.updateCurrentPage({ currentPage: currentPage.value });

      await postController.loadPosts({
        date: currentPage.value,
        filter: status,
        fields: ["id", "title", "cover", "created_at", "status"],
      });
    }
  } catch (error: any) {
    console.error(error.message);
  } finally {
    loadFinished.value = true;
    dateLoading.value = false;
    closePostLoader();
  }
}

async function getPostsDates(params: {
  status: filterPostOptions;
}): Promise<void> {
  const { status } = params;

  try {
    await postController.loadDates({ status });
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
    throw e;
  }
}

function loadData(params: { dates: Array<string> }): string {
  const routeDate = route.params.date as string | undefined;
  let targetDate = "";
  if (routeDate && routeDate !== '') {
    targetDate = params.dates.filter((element) => {
      if (element == routeDate) return element;
    })[0] ?? params.dates[0];
  } else {
    targetDate = params.dates[0];
  }
  currentPage.value = targetDate;
  currentPageIndex.value = params.dates.indexOf(targetDate);
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

async function openPost(params: { id: number }) {
  const { id } = params;
  openPostLoader({ id });
  await router.push({ name: "PostPage", params: { id } });
  closePostLoader();
}

async function updatePost(params: { id: string }) {
  const { id } = params;
  openPostLoader({ id, color: "primary" });
  await router.push({ name: "UpdatePostPage", params: { id } });
  closePostLoader();
}

async function deletePost(params: { id: number }) {
  const id = params.id;
  openPostLoader({ id, color: "danger" });

  try {
    await postController.deletePost({ id });
    loadContent({ status: filter.selected });
  } catch (error) {
    console.error(error);
  } finally {
    closePostLoader();
  }
}

function closeModalSearchPosts() {
  isOpenSearchModal.value = false;
}

async function navigateToDate(params: { dateIndex: number }): Promise<void> {
  const { dateIndex } = params;
  const newDate = dates.value[dateIndex];

  if (!newDate) return;

  currentPage.value = newDate;
  currentPageIndex.value = dateIndex;
  updatecurrentPage();
  loadFinished.value = false;
  postController.clearPosts();
  navigating.value = true;

  try {
    await Promise.all([
      postController.loadPosts({
        date: currentPage.value,
        filter: filter.selected,
        fields: ["id", "title", "cover", "created_at", "status"],
      }),
      router.replace({ name: "PostsPage", params: { date: currentPage.value } }),
    ]);

    preloadAdjacentDates();
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
    throw e;
  } finally {
    loadFinished.value = true;
    navigating.value = false;
  }
}

async function nextDate(): Promise<void> {
  const newDateIndex = +currentPageIndex.value + 1;
  if (newDateIndex >= dates.value.length) return;
  await navigateToDate({ dateIndex: newDateIndex });
}

async function previousDate(): Promise<void> {
  const newDateIndex = +currentPageIndex.value - 1;
  if (newDateIndex < 0) return;
  await navigateToDate({ dateIndex: newDateIndex });
}

async function selectDate(params: { date: string }): Promise<void> {
  const date = params.date;
  const dateIndex = dates.value.indexOf(date);
  if (dateIndex === -1) return;
  await navigateToDate({ dateIndex });
}

function preloadAdjacentDates(): void {
  const nextIndex = currentPageIndex.value + 1;
  const prevIndex = currentPageIndex.value - 1;

  if (nextIndex < dates.value.length) {
    const nextDate = dates.value[nextIndex];
    postController.loadPosts({
      date: nextDate,
      filter: filter.selected,
      fields: ["id", "title", "cover", "created_at", "status"],
      preload: true,
    }).catch(() => {});
  }

  if (prevIndex >= 0) {
    const prevDate = dates.value[prevIndex];
    postController.loadPosts({
      date: prevDate,
      filter: filter.selected,
      fields: ["id", "title", "cover", "created_at", "status"],
      preload: true,
    }).catch(() => {});
  }
}

function updatecurrentPage(): void {
  postController.updateCurrentPage({ currentPage: currentPage.value });
}

function openPostLoader(params: { id: number | string; color?: string }) {
  const { id, color = "primary" } = params;
  postProgress.value.status = true;
  postProgress.value.color = color;
  postProgress.value.id = id.toString();
  systemController.enableLoader({ color });
}

function closePostLoader() {
  postProgress.value.status = false;
  systemController.disableLoader();
}

function handleTouchStart(params: { postId: number; event: MouseEvent }) {
  const { event, postId } = params;

  touchTimer.value = setTimeout(() => {
    popoverPostOptions.value.event = event;
    popoverPostOptions.value.isOpen = true;
    idPostSelected.value = postId;
  }, 500);
}

function handleTouchEnd() {
  if (touchTimer.value) {
    clearTimeout(touchTimer.value);
    touchTimer.value = null;
  }
}

function getPostStatusColor(params: { status: string }): string {
  const { status } = params;

  return status == "active"
    ? "success"
    : status == "inactive"
      ? "danger"
      : "warning";
}
// end functions
</script>

<style>
button.alert-button.alert-delete-post-button-confirm {
  color: var(--ion-color-danger);
}
</style>

<style scoped>
.card-post {
  position: relative;
  border-bottom: 1px solid var(--ion-background-color-step-150);
  width: 76%;
}

.card-post:hover {
  background-color: var(--ion-color-step-50, rgba(0, 0, 0, 0.04));
}

.action-post-buttons {
  display: inline-flex;
  position: absolute;
  bottom: 0px;
  right: 0px;
  align-items: flex-end;
  z-index: 100;
  background-color: var(--ion-background-color);
}

.slide-fade-post-action-buttons-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-post-action-buttons-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-post-action-buttons-enter-from,
.slide-fade-post-action-buttons-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
