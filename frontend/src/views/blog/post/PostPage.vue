<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-button @click="$router.go(-1)">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- title -->
      <ion-title class="fade-in-title">
        {{ post?.title }}
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

  <ion-content :fullscreen="true" class="ion-padding">
    <!-- loading skeleton -->
    <div v-if="post == undefined" class="skeleton-container">
      <ion-skeleton-text animated style="width: 100%; max-width: 500px; height: 280px; border-radius: 8px; margin: 0 auto"></ion-skeleton-text>
      <ion-skeleton-text animated style="width: 60%; height: 32px; margin: 16px auto 0"></ion-skeleton-text>
      <ion-skeleton-text animated v-for="n in 6" :key="n" style="width: 80%; height: 16px; margin: 8px auto 0"></ion-skeleton-text>
    </div>

    <!-- post content -->
    <div v-if="post != undefined" class="post-wrapper">
      <div v-if="post?.cover?.url" class="post-cover">
        <img
          :src="post?.cover?.url"
          alt=""
        />
      </div>

      <!-- content -->
      <article id="content-container" ref="indexRef" class="post-content" @click="openImagePreview">
        <MarkdownViewer
          :content="post?.content ?? ''"
        />
      </article>
    </div>

    <!-- Floating index -->
    <indexContentComponent
      v-if="isPlatform('desktop') && post != undefined"
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
  </ion-page>
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
  IonPage,
  IonPopover,
  IonRow,
  IonSkeletonText,
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
import { computed, onMounted, ref } from "vue";
import indexContentComponent from "./indexContentComponent.vue";
import { isPlatform, modalController } from "@ionic/vue";

// components
import modalIndexContent from "./modalIndexContent.vue";
import ImageModal from "@/components/image-modal/ImageModal.vue";
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
const postId = Number(route.params.id);
const post = computed(() => postController.getPost({ id: postId }));
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const indexContent = ref<Array<{ name: string; id: string; type: string }>>([]);
const indexRef = ref<HTMLElement | null>(null);
const popoverMainOptions = ref({ open: false, event: null as Event | null });
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
  if (!indexRef.value) return;

  const headings = indexRef.value.querySelectorAll(
    "h1:not(ion-card *), h2:not(ion-card *), h3:not(ion-card *), h4:not(ion-card *), h5:not(ion-card *), h6:not(ion-card *)",
  );

  indexContent.value = [];
  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    indexContent.value.push({
      name: heading.textContent ?? "",
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

async function openImagePreview(event: MouseEvent): Promise<void> {
  const target = event.target as HTMLElement;
  const img = target.closest("img");
  if (!img || !img.src) return;

  if (img.closest(".post-cover")) return;

  const modal = await modalController.create({
    component: ImageModal,
    componentProps: { src: img.src },
    cssClass: "image-modal",
  });
  await modal.present();
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

.skeleton-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
}

.post-wrapper {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.post-cover img {
  max-width: 100%;
  height: auto;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
}

.post-content {
  width: 100%;
}

.floating-index {
  position: fixed;
  right: 22px;
  top: 120px;
  width: 230px;
  overflow-y: auto;
  z-index: 100;
}

@media (max-width: 768px) {
  .floating-index {
    display: none;
  }

  .post-wrapper {
    padding: 0 16px;
  }
}
</style>
