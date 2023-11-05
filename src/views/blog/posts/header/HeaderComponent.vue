<template>
  <div>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title
        v-if="showTitle || isPlatform('desktop')"
        class="fade-in-title"
        >{{ props.pageTitle }}</ion-title
      >

      <ion-buttons
        slot="end"
        :class="{ adaptiveSegment: showTitle && !isPlatform('desktop') }"
      >
        <div lines="none">
          <!-- date selector -->
          <DateSelectorComponent
            @current-date-change="emits('currentDateChange')"
          ></DateSelectorComponent>
          <!-- end dae selector -->
        </div>

        <ion-item lines="none">
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

          <section
            v-if="
              showTitle == false ||
              isPlatform('desktop') ||
              isPlatform('tablet')
            "
          >
            <!-- button search post -->
            <ion-button fill="clear" @click="isOpenSearchModal = true">
              <ion-icon :icon="searchOutline"></ion-icon>
            </ion-button>

            <!-- button refresh content -->
            <ion-button fill="clear" @click="refreshContent()">
              <ion-icon :icon="refreshOutline"></ion-icon>
            </ion-button>
          </section>

          <ion-button
            v-show="
              showTitle && !isPlatform('desktop') && !isPlatform('tablet')
            "
            id="button-more-options"
          >
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-buttons>
    </ion-toolbar>
  </div>

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
import {
  IonSpinner,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  isPlatform,
  IonRow,
  IonCol,
  IonPopover,
  getPlatforms,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  addOutline,
  closeOutline,
  ellipsisVerticalOutline,
  refreshOutline,
  searchOutline,
} from "ionicons/icons";
import { ALL_POSTS_DETAILS, POST_DATES } from "@/services/graphql";
import { useUser } from "@/composables/useUser";
import { usePost } from "@/composables/usePost";
import { useSystem } from "@/composables/useSystem";

// components
import DateSelectorComponent from "@/components/posts/DateSelectorComponent.vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  showTitle: { type: Boolean, required: true, default: false },
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const emits = defineEmits(["currentDateChange"]);
const route = useRoute();
const router = useRouter();
const spinners = ref({
  buttonAddPost: false,
  buttonAddNewPost: false,
  buttonEditPost: "",
});
const loadFinished = ref(false);
const searchResult = ref(Array<{ id: string; title: string }>());
const modalSearchPosts = ref();
const isOpenSearchModal = ref(false);

onMounted(() => {
  console.log(getPlatforms());
});

// functions
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

async function loadPosts(params: {
  currentPage: string;
  refetch?: boolean;
}): Promise<void> {
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

async function addPost(): Promise<void> {
  spinners.value.buttonAddPost = true;
  await router.push("/blog/editor/create");
  spinners.value.buttonAddPost = false;
}

async function refreshContent(): Promise<void> {
  loadContent({ refetch: true });
}

async function searchPosts(params: {
  search: string;
  refetch: boolean;
}): Promise<void> {
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

async function openPostSearch(params: { id: string }): Promise<void> {
  const id = params.id;
  await router.push({ name: "PostPage", params: { id } });
  closeModalSearchPosts();
}
</script>

<style scoped>
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

@media only screen and (min-width: 768px) {
  .card {
    max-height: 300px;
    height: 300px;
  }
}
</style>
