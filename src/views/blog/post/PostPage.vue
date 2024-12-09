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
      <ion-buttons slot="end" v-if="isPlatform('android') || isPlatform('ios')">
        <ion-button @click="popoverMainOptions = { open: true, event: $event }">
          <ion-icon :icon="ellipsisVerticalOutline" slot="start"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- desktop options -->
      <ion-buttons slot="end" v-if="isPlatform('desktop')">
        <section v-if="userController.getUser()?.isAdmin">
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

  <ion-row style="height: 100dvh; overflow: hidden">
    <ion-col :size="isPlatform('desktop') ? '9' : '12'">
      <!-- ion content -->
      <ion-content
        :fullscreen="true"
        v-if="postController.getPost({ id: postId }) != undefined"
      >
        <ion-header collapse="condense" mode="ios">
          <ion-toolbar>
            <ion-title size="large"
              ><div style="text-wrap: auto">
                {{ postController.getPost({ id: postId })?.title }}
              </div></ion-title
            >
          </ion-toolbar>
        </ion-header>

        <!-- content -->
        <div
          ref="indexRef"
          @scroll="setScrollPosition()"
          class="ion-padding"
          id="pr"
        >
          <article id="pr">
            <MarkdownViewer
              :content="postController.getPost({ id: postId })!.content ?? ''"
            />
          </article>
        </div>

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
              <ion-icon :icon="menuOutline" slot="start"></ion-icon>
              <ion-label>Indice</ion-label>
            </ion-item>

            <!-- update -->
            <ion-item
              lines="full"
              v-if="userController.getUser()?.isAdmin"
              button
              @click="updatePost()"
            >
              <ion-icon :icon="createOutline" slot="start"></ion-icon>
              <ion-label>Actualizar post</ion-label>
            </ion-item>
            <!-- delete -->
            <ion-item
              lines="full"
              v-if="userController.getUser()?.isAdmin"
              button
              @click="deletePost()"
            >
              <ion-icon
                :icon="trashOutline"
                color="danger"
                slot="start"
              ></ion-icon>
              <ion-label>Indice</ion-label>
            </ion-item>
          </ion-content>
        </ion-popover>
      </ion-content>
    </ion-col>

    <ion-col size="3" v-if="isPlatform('desktop')">
      <indexContentComponent
        :index-content="indexContent"
        :auto-hide-content="isPlatform('ios') || isPlatform('android')"
        @element-id="goToSection({ id: $event })"
      />
    </ion-col>
  </ion-row>

  <!-- alerts -->
  <!-- alert delete post -->
  <ion-alert
    header="Continuar?"
    message="Eliminar Post"
    :buttons="alertButtonsDeletePost"
    :is-open="isOpenAlertDeletePost"
  ></ion-alert>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonCol,
  IonRow,
  IonProgressBar,
} from "@ionic/vue";
import {
  chevronBackOutline,
  createOutline,
  ellipsisVerticalOutline,
  menuOutline,
  toggle,
  trashOutline,
  informationOutline,
} from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import { h, onMounted, ref, render, watch } from "vue";
import indexContentComponent from "./indexContentComponent.vue";
import { isPlatform, modalController } from "@ionic/vue";

// components
import modalIndexContent from "./modalIndexContent.vue";
import MarkdownViewer from "@/components/markdown-viewer/MarkdownViewer.vue";
import CardsAlert from "@/components/cards/CardAlert.vue";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
import PostController from "@/controllers/postController";
const systemController = new SystemController();
const userController = new UserController();
const postController = new PostController();

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
  setTimeout(() => {
    const article = document.getElementById("pr");
    if (article) {
      const blockquotes = article.querySelectorAll("blockquote");
      blockquotes.forEach((blockquote) => {
        // Get first paragraph
        const firstP = blockquote.querySelector("p");
        if (!firstP) return;

        // Split content at first <br>
        const html = firstP.innerHTML;
        const [title, ...rest] = html.split("<br>");

        // Remove <code> tags from content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rest.join("<br>");
        const codes = tempDiv.querySelectorAll("code");
        codes.forEach((code) => {
          code.replaceWith(code.textContent);
        });
        const content = tempDiv.innerHTML;

        // Create CardsAlert with additional props
        const container = document.createElement("div");
        const vnode = h(CardsAlert, {
          cardTitle: title,
          cardContent: content,
          color: "success",
          border: false,
          icon: informationOutline,
        });

        render(vnode, container);
        blockquote.replaceWith(container.firstElementChild);
      });
    }
  }, 100);
});

watch(
  () => scrollPosition.value,
  (newValue) => {
    showTitle.value = newValue > 0;
  }
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
    headings = indexRef.value.querySelectorAll("h1, h2, h3, h4, h5, h6");
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
  } catch (e: any) {
    systemController.openToastError(e);
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

function setScrollPosition(): void {
  if (indexRef.value) {
    scrollPosition.value = indexRef.value.scrollTop;
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
</style>
