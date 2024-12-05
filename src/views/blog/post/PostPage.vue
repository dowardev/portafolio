<template>
  <ion-page class="page-container">
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
        <ion-buttons
          slot="end"
          v-if="isPlatform('android') || isPlatform('ios')"
        >
          <ion-button
            @click="popoverMainOptions = { open: true, event: $event }"
          >
            <ion-icon :icon="ellipsisVerticalOutline" slot="start"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- desktop options -->
        <ion-buttons slot="end" v-if="isPlatform('desktop')">
          <section v-if="userController.getUser()?.isAdmin">
            <ion-button fill="clear" @click="updatePost()">
              <ion-icon :icon="createOutline"></ion-icon>
            </ion-button>

            <ion-button fill="clear" @click="deletePost()">
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

    <ion-row id="pr" style="height: 100dvh; overflow: hidden">
      <ion-col size="9">
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
          <div ref="indexRef" @scroll="setScrollPosition()">
            <article>
              <MdPreview
                style="
                  --md-bk-color: var(--ion-background-color-rgb);
                  --md-color: var(--ion-text-color);
                "
                :model-value="postController.getPost({ id: postId })!.content"
                :theme="
                  useSytemComposable.getTheme().selected == 'light'
                    ? 'light'
                    : 'dark'
                "
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

      <ion-col size="3">
        <indexContentComponent
          :index-content="indexContent"
          :auto-hide-content="isPlatform('ios') || isPlatform('android')"
          @element-id="goToSection({ id: $event })"
        />
      </ion-col>
    </ion-row>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  IonContent,
} from "@ionic/vue";
import {
  chevronBackOutline,
  createOutline,
  ellipsisVerticalOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import indexContentComponent from "./indexContentComponent.vue";
import { MdPreview } from "md-editor-v3";
import { isPlatform, modalController } from "@ionic/vue";
import modalIndexContent from "./modalIndexContent.vue";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
import PostController from "@/controllers/postController";
const systemController = new SystemController();
const userController = new UserController();
const postController = new PostController();

// vars
const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const indexContent = ref(
  [] as Array<{ name: string; id: string; type: string }>
);
let headings: NodeListOf<HTMLElement> | [] = [];
const indexRef = ref<HTMLElement | null>(null);
const useSytemComposable = systemController;
const popoverMainOptions = ref({ open: false, event: Event });
const scrollPosition = ref(0);
const showTitle = ref(false);

// mounted
onMounted(() => {
  start();
});

watch(
  () => scrollPosition.value,
  (newValue) => {
    if (newValue == 0) showTitle.value = false;
    else showTitle.value = true;
  }
);

// functions
async function start(): Promise<void> {
  await getPost();
  await setThemeCodePreview();
  generarIndexContent();
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

async function setThemeCodePreview(): Promise<void> {
  const theme = (await systemController.getTheme()) ?? "light";
  let file = "" as any;

  // if (theme == "nord")
  //   file = await import(
  //     "../../../../node_modules/highlight.js/styles/atom-one-dark.css"
  //   );
  // if (theme == "gruvbox")
  //   file = await import(
  //     "../../../../node_modules/highlight.js/styles/dark.css"
  //   );
  // if (theme == "light")
  //   file = await import(
  //     "../../../../node_modules/highlight.js/styles/atom-one-light.css"
  //   );

  const cssNode = document.createElement("style");
  cssNode.innerHTML = file.default;
  document.head.appendChild(cssNode);
}

function generarIndexContent(): void {
  if (indexRef.value != null) {
    headings = indexRef.value.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    ) as NodeListOf<HTMLElement>;
  } else {
    headings = [];
  }

  let count = 0;
  (headings as NodeListOf<HTMLElement>).forEach((heading) => {
    heading.id = count.toString();

    indexContent.value.push({
      name: heading.textContent ?? "",
      id: count.toString(),
      type: heading.tagName.toLowerCase(),
    });

    count++;
  });
}

async function updatePost(): Promise<void> {
  spinners.value.buttonUpdate = true;
  await router.push("/blog/editor/update/" + postId);
  spinners.value.buttonUpdate = false;
}

async function deletePost(): Promise<void> {
  spinners.value.buttonDelete = true;

  const alertResponse = await systemController.presentAlertConfirmation({
    message: "¿Desea eliminar el post?",
  });

  if (alertResponse == false) {
    spinners.value.buttonDelete = false;
    return;
  }

  try {
    await deletePost();
    spinners.value.buttonDelete = false;
    router.go(-1);
    // eventBus().emitter.emit("new-post");
  } catch (e: any) {
    spinners.value.buttonDelete = false;
    systemController.openToastError(e);
  }
}

function goToSection(params: { id: string }): void {
  const { id } = params;

  const element = document.getElementById(id);
  console.log(id);
  if (element)
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
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
  if (data != null) {
    const elementId = data.elementId;
    goToSection({ id: elementId });
  }
}

function setScrollPosition(): void {
  scrollPosition.value = (indexRef.value! as HTMLElement).scrollTop;
}
</script>
