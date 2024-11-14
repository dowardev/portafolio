<template>
  <div
    ref="mainDiv"
    style="overflow: auto; height: 80vh"
    @scroll="setScrollPosition()"
  >
    <ion-row>
      <ion-col>
        <ion-header
          v-if="scrollPosition == 0 && !isPlatform('desktop')"
          class="fade-in-title ion-no-border"
        >
          <ion-toolbar style="--background: transparent">
            <ion-title size="large">{{ props.pageTitle }}</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-col>
    </ion-row>

    <!-- posts -->
    <ion-row v-if="usePost().getPosts()!.length > 0">
      <ion-col
        v-for="(post, indexPost) in filterPosts"
        :key="post.id"
        size-xs="12"
        size-md="6"
        size-lg="3"
      >
        <ion-card
          style="cursor: pointer"
          :class="{
            'element-post-selected': elementPostHover == indexPost,
            'element-post-no-selected': elementPostHover != indexPost,
          }"
          class="blur-element card"
          @mouseenter="elementPostHover = indexPost"
          @mouseleave="elementPostHover = -1"
        >
          <img
            :src="post.cover.source!"
            style="max-width: 300px; object-fit: scale-down"
            @click="openPost(post.id!)"
          />
          <ion-card-header @click="openPost(post.id!)">
            <ion-card-title
              ><span>{{ post.title }}</span></ion-card-title
            >
          </ion-card-header>

          <ion-card-content>
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
                  v-if="
                    spinners.buttonEditPost == '' ||
                    spinners.buttonEditPost != post.id!
                  "
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
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
    <!-- end posts -->

    <section v-if="usePost().getPosts()!.length == 0 && loadFinished">
      <div class="align-vertical">
        <div class="center">
          <ion-item lines="none">
            <ion-icon slot="start" :icon="banOutline" color="danger"></ion-icon>
            <ion-label color="danger">No se encontraron datos</ion-label>
          </ion-item>
        </div>
      </div>
    </section>

    <section v-if="usePost().getPosts()!.length == 0 && loadFinished == false">
      <ion-row>
        <ion-col
          v-for="(item, index) in 8"
          :key="index"
          size-xs="12"
          size-md="6"
          size-lg="3"
        >
          <ion-card style="border: 1px solid var(--ion-color-primary)">
            <ion-item>
              <ion-thumbnail slot="start">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
              </ion-thumbnail>
            </ion-item>

            <ion-card-content>
              <ion-label>
                <p>
                  <ion-skeleton-text
                    :animated="true"
                    style="width: 70%"
                  ></ion-skeleton-text>
                </p>
              </ion-label>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
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
  </div>
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
import { computed, onMounted, ref, watch } from "vue";
import { openToast, presentAlertConfirmation } from "@/services/system";
import {
  closeOutline,
  addOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  banOutline,
  searchOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "@/services/graphql";
import { useUser } from "@/controllers/usersController";
import { usePost } from "@/controllers/postController";
import { useSystem } from "@/controllers/systemController";

// components
import DateSelectorComponent from "@/components/posts/DateSelectorComponent.vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const emits = defineEmits(["showTitle"]);
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
const showTitle = ref(true);
const mainDiv = ref();
const scrollPosition = ref(0);

const filterPosts = computed(() => {
  const posts = usePost().getPosts()!;
  return posts.filter(
    (post) => post.createdAt!.split("T")[0] == usePost().getCurrentPage()
  );
});

// hooks
onMounted(() => {
  loadContent({ refetch: true });
});
watch(
  () => scrollPosition.value,
  (newValue) => {
    if (newValue == 0) emits("showTitle", false);
    else emits("showTitle", true);
  }
);

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
    await usePost().loadDates();
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

async function loadPosts(params: {
  currentPage: string;
  refetch?: boolean;
}): Promise<void> {
  try {
    await usePost().loadPosts({
      date: params.currentPage,
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

function setScrollPosition(): void {
  scrollPosition.value = mainDiv.value.scrollTop;
}

// export functions
defineExpose({ loadPosts });
</script>

<style scoped>
.element-post-selected {
  border: 1px solid var(--ion-color-primary);
}

.element-post-no-selected {
  border: 1px solid var(--ion-background-color);
}

.div-main-content {
  height: 82vh;
  overflow: auto;
}

ion-content {
  --overflow: hidden;
}

@media only screen and (min-width: 768px) {
  .card {
    max-height: 300px;
    height: 300px;
  }
}
</style>
