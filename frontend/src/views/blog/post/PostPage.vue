<template>
  <ion-header :translucent="true" class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-button @click="$router.go(-1)">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- title -->
      <ion-title class="fade-in-title">
        {{ postController.getPost({ id: postId })?.title }}
      </ion-title>

      <!-- mobile options -->
      <ion-buttons v-if="isPlatform('android') || isPlatform('ios')" slot="end">
        <ion-button @click="popoverMainOptions = { open: true, event: $event }">
          <ion-icon slot="start" :icon="ellipsisVerticalOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- desktop options -->
      <ion-buttons v-if="isPlatform('desktop')" slot="end">
        <section v-if="userController.hasRole({ slug: 'admin' })">
          <ion-button fill="clear" @click="updatePost()">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="isOpenAlertDeletePost = true">
            <ion-icon :icon="trashOutline" color="danger"></ion-icon>
          </ion-button>
        </section>

        <ion-button
          v-if="isPlatform('android') || isPlatform('ios')"
          fill="clear"
          @click="openModalIndexContent()"
        >
          <ion-icon :icon="menuOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content
    v-if="postController.getPost({ id: postId }) != undefined"
    :fullscreen="true"
  >
    <ion-row class="ion-justify-content-center" style="display: flex">
      <ion-col size-md="8" size-xl="6">
        <ion-row>
          <ion-col style="display: flex" class="ion-justify-content-center">
            <img
              style="width: 500px"
              :src="postController.getPost({ id: postId })?.cover?.url"
              alt=""
            />
          </ion-col>
        </ion-row>

        <ion-header collapse="condense" mode="ios">
          <ion-toolbar>
            <ion-title size="large">
              <div style="text-wrap: auto">
                {{ postController.getPost({ id: postId })?.title }}
              </div></ion-title
            >
          </ion-toolbar>
        </ion-header>

        <!-- content -->
        <ion-row>
          <ion-col>
            <article id="content-container" ref="indexRef">
              <MarkdownViewer
                :content="postController.getPost({ id: postId })!.content ?? ''"
              />
            </article>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>

    <!-- Floating index -->
    <indexContentComponent
      v-if="isPlatform('desktop')"
      id="pr2"
      class="floating-index"
      :index-content="indexContent"
      :auto-hide-content="isPlatform('ios') || isPlatform('android')"
      @element-id="goToSection({ id: $event })"
    />
  </ion-content>

  <!-- alerts -->
  <!-- alert delete post -->
  <ion-alert
    header="Continuar?"
    message="Eliminar Post"
    :buttons="alertButtonsDeletePost"
    :is-open="isOpenAlertDeletePost"
  ></ion-alert>

  <!-- popoovers -->
  <ion-popover
    :is-open="popoverMainOptions.open"
    :event="popoverMainOptions.event"
    @did-dismiss="popoverMainOptions.open = false"
    @click="popoverMainOptions.open = false"
  >
    <ion-content>
      <!-- index -->
      <ion-item lines="full" button @click="openModalIndexContent()">
        <ion-icon slot="start" :icon="menuOutline"></ion-icon>
        <ion-label>Indice</ion-label>
      </ion-item>

      <!-- update -->
      <ion-item
        v-if="userController.hasRole({ slug: 'admin' })"
        lines="full"
        button
        @click="updatePost()"
      >
        <ion-icon slot="start" :icon="createOutline"></ion-icon>
        <ion-label>Actualizar post</ion-label>
      </ion-item>
      <!-- delete -->
      <ion-item
        v-if="userController.hasRole({ slug: 'admin' })"
        lines="full"
        button
        @click="deletePost()"
      >
        <ion-icon slot="start" :icon="trashOutline" color="danger"></ion-icon>
        <ion-label>Indice</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import {
  chevronBackOutline,
  createOutline,
  ellipsisVerticalOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import { h, onMounted, ref, watch } from "vue";
import indexContentComponent from "./indexContentComponent.vue";
import { isPlatform, modalController } from "@ionic/vue";

// components
import modalIndexContent from "./modalIndexContent.vue";
import MarkdownViewer from "@/components/markdown-viewer/MarkdownViewer.vue";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
import PostController from "@/controllers/postController";
import ErrorController from "@/controllers/errorController";
const systemController = new SystemController();
const userController = new UserController();
const postController = new PostController();
const errorController = new ErrorController();

// const
const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const indexContent = ref<Array<{ name: string; id: string; type: string }>>([]);
let headings: NodeListOf<HTMLElement> | [] = [];
const indexRef = ref<HTMLElement | null>(null);
const popoverMainOptions = ref({ open: false, event: null as Event | null });
const scrollPosition = ref(0);
const showTitle = ref(false);
const alertButtonsDeletePost = [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Confirmar",
    cssClass: "alert-button-confirm",
    handler: () => {
      deletePost();
    },
  },
];
const isOpenAlertDeletePost = ref(false);

onMounted(async () => {
  await start();
});

watch(
  () => scrollPosition.value,
  (newValue) => {
    showTitle.value = newValue > 0;
  },
);

// functions
async function start(): Promise<void> {
  enableLoader({ color: "primary" });
  await getPost();
  generarIndexContent();
  disableLoader();
}

async function getPost(): Promise<void> {
  const loading = await systemController.presentLoading({
    message: "Obteniendo publicación",
  });
  loading.present();

  try {
    await postController.loadPost({
      id: postId,
      fields: ["id", "title", "cover", "created_at", "content"],
    });
  } catch (e: any) {
    console.error(e);
  } finally {
    loading.dismiss();
  }
}

function generarIndexContent(): void {
  if (indexRef.value) {
    headings = indexRef.value.querySelectorAll(
      "h1:not(ion-card *), h2:not(ion-card *), h3:not(ion-card *), h4:not(ion-card *), h5:not(ion-card *), h6:not(ion-card *)",
    );
  } else {
    headings = [];
  }

  indexContent.value = [];
  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    indexContent.value.push({
      name: heading.textContent || "",
      id,
      type: heading.tagName.toLowerCase(),
    });
  });
}

async function updatePost(): Promise<void> {
  enableLoader({ color: "primary" });
  await router.push({ name: "UpdatePostPage", params: { id: postId } });
  disableLoader();
}

async function deletePost(): Promise<void> {
  enableLoader({ color: "danger" });

  try {
    await postController.deletePost({ id: postId });
    spinners.value.buttonDelete = false;
    router.go(-1);
  } catch (e) {
    errorController.openToastError({ error: e as Error });
  } finally {
    disableLoader();
  }
}

function goToSection(params: { id: string }): void {
  const { id } = params;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

async function openModalIndexContent(): Promise<void> {
  const modal = await modalController.create({
    component: modalIndexContent,
    componentProps: {
      indexContent: indexContent.value,
    },
  });
  modal.present();

  const { data } = await modal.onWillDismiss();
  if (data?.elementId) {
    goToSection({ id: data.elementId });
  }
}

function enableLoader(params: { color: string }) {
  const { color } = params;
  systemController.enableLoader({ color });
}

function disableLoader() {
  systemController.disableLoader();
}
</script>

<style>
.alert-button-confirm {
  color: red !important;
}

.content-layout {
  /* position: relative; */
  display: flex;
  justify-content: center;
  width: 90%;
  /* margin: 0 auto; */
}

.floating-index {
  position: fixed;
  right: 22px;
  top: 16%;
  width: 230px;
  overflow-y: auto;
  z-index: 100;
}

/* #pr { */
/* width: 66%; */
/* max-width: 900px; */
/* margin: 0 auto; */
/* padding: 0 20px; */
/* } */

/* Hide floating index on mobile */
@media (max-width: 768px) {
  .main-content {
    margin-right: 0;
  }

  .floating-index {
    display: none;
  }
}
</style>
