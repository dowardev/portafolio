<template>
  <ion-header class="ion-no-border">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <!-- <DateSelectorComponent></DateSelectorComponent> -->
        <!-- screen xs -->
        <div v-if="mq.xs || mq.md">
          <ion-button id="button-more-options">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
        </div>

        <!-- screen lg -->
        <div v-if="mq.lgPlus">
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
          <ion-button fill="clear" @click="isOpenSearchModal = true">
            <ion-icon :icon="searchOutline"></ion-icon>
          </ion-button>

          <ion-button @click="previousDate()">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>

          <ion-button @click="nextDate()">
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>

          <!-- button refresh content -->
          <ion-button fill="clear" @click="refreshContent()">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </div>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="container-page">
    <!-- posts -->
    <ion-row v-if="usePost().getPosts()!.length > 0">
      <ion-col
        v-for="(post, indexPost) in filterPosts"
        :key="post.id"
        size-xs="12"
        size-md="6"
        size-lg="3"
      >
        <ion-card style="cursor: pointer">
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
  <ion-popover trigger="button-more-options" trigger-action="click"
    ><ion-content>
      <!-- search -->
      <ion-item lines="full" button @click="isOpenSearchModal = true"
        ><ion-icon slot="start" :icon="searchOutline"></ion-icon
        ><ion-label>Buscar</ion-label></ion-item
      >
      <!-- refresh -->
      <ion-item lines="full" button @click="refreshContent()"
        ><ion-icon slot="start" :icon="refreshOutline"></ion-icon
        ><ion-label>Refrescar</ion-label></ion-item
      >
    </ion-content></ion-popover
  >
</template>

<script setup lang="ts">
import { IonItem, loadingController } from "@ionic/vue";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import { usePost } from "@/composables/usePost";
import { useSystem } from "@/composables/useSystem";
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
import { useMq } from "vue3-mq";
import { openToast, presentAlertConfirmation } from "@/services/system";

// components
import DateSelectorComponent from "@/components/posts/DateSelectorComponent.vue";
import { onMounted } from "vue";

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
const mq = useMq();
const searchResult = ref(Array<{ id: string; title: string }>());
const currentDate = ref("");
let dates = reactive([] as Array<string>);
const index = ref();
const currentDateIndex = ref(0);

const filterPosts = computed(() => {
  const posts = usePost().getPosts()!;
  return posts.filter(
    (post) => post.createdAt!.split("T")[0] == usePost().getCurrentPage(),
  );
});

onMounted(() => {
  loadContent({ refetch: true });
});

watch(
  () => usePost().getDates(),
  (newValue) => {
    dates = newValue as any;
  },
);
watch(
  () => usePost().getCurrentPage(),
  (newValue) => {
    currentDate.value = newValue as string;
  },
);
watch(
  () => dates,
  (newValue) => {
    index.value = newValue.indexOf(currentDate.value);
    currentDateIndex.value = index.value;
  },
);

// functions
async function addPost(): Promise<void> {
  spinners.value.buttonAddPost = true;
  await router.push("/blog/editor/create");
  spinners.value.buttonAddPost = false;
}

async function refreshContent(): Promise<void> {
  loadContent({ refetch: true });
}

async function loadContent(params: { refetch: boolean }): Promise<void> {
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

async function loadPosts(params: {
  currentPage: string;
  refetch?: boolean;
}): Promise<void> {
  const refetch = params.refetch ? params.refetch : false;
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

async function searchPosts(params: { search: string }): Promise<void> {
  const search = params.search;

  const searchResultResponse = await usePost().searchPosts({
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

function closeModalSearchPosts() {
  (modalSearchPosts as any).$el.dismiss(null, "cancel");
}

async function nextDate(): Promise<void> {
  const newDateIndex = +currentDateIndex.value + 1;

  if (newDateIndex >= dates.length) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex.value = newDateIndex;

  updateCurrentDate();
  // emits("currentDateChange");
  await loadPosts({ currentPage: currentDate.value });
}

async function previousDate(): Promise<void> {
  const newDateIndex = +currentDateIndex.value - 1;

  if (newDateIndex < 0) return;

  currentDate.value = dates[newDateIndex];
  currentDateIndex.value = newDateIndex;

  updateCurrentDate();
  // emits("currentDateChange");
  await loadPosts({ currentPage: currentDate.value });
}

async function selectDate(params: { date: string }): Promise<void> {
  const date = params.date;
  currentDateIndex.value = dates.indexOf(date);
  updateCurrentDate();
  await loadPosts({ currentPage: currentDate.value });
}

function updateCurrentDate(): void {
  usePost().updateCurrentPage({ currentPage: currentDate.value });
}
</script>
