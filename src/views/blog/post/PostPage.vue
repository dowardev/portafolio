<template>
  <ion-header class="ion-no-border">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-button @click="$router.go(-1)">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title v-if="usePost().getPost({ id: postId })">{{
        usePost().getPost({ id: postId })!.title
      }}</ion-title>

      <ion-buttons slot="end">
        <section v-if="useUser().user.value.isAdmin">
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

  <ion-content class="container-page">
    <div v-if="usePost().getPost({ id: postId }) != undefined">
      <!-- content -->
      <ion-row>
        <ion-col size-xs="11" size-md="9">
          <div ref="indexRef" style="overflow: auto; height: 85vh">
            <MdPreview
              style="
                --md-bk-color: var(--ion-background-color-rgb);
                --md-color: var(--ion-text-color);
              "
              :model-value="usePost().getPost({ id: postId })!.content"
              :theme="
                useSytemComposable.getTheme().selected == 'light'
                  ? 'light'
                  : 'dark'
              "
            />
          </div>
        </ion-col>

        <ion-col v-if="isPlatform('desktop')" size="3" class="ion-padding-top">
          <!-- index content -->
          <indexContentComponent
            :index-content="indexContent"
            :auto-hide-content="isPlatform('ios') || isPlatform('android')"
            @element-id="goToSection({ id: $event })"
          />
        </ion-col>
      </ion-row>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import {
  chevronBackOutline,
  createOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import { useUser } from "@/composables/useUser";
import { usePost } from "@/composables/usePost";
import { useRoute, useRouter } from "vue-router";
import { useMq } from "vue3-mq";
import { onMounted, ref } from "vue";
import {
  getTheme,
  presentAlertConfirmation,
  presentLoading,
} from "@/services/system";
import { useSystem } from "@/composables/useSystem";
import indexContentComponent from "./indexContentComponent.vue";
import { MdPreview } from "md-editor-v3";
import { isPlatform, modalController } from "@ionic/vue";
import modalIndexContent from "./modalIndexContent.vue";

// vars
const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;
const mq = useMq();
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const indexContent = ref(
  [] as Array<{ name: string; id: string; type: string }>,
);
let headings = null;
const indexRef = ref(null);
const useSytemComposable = useSystem();

// mounted
onMounted(() => {
  start();
});

// functions
async function start(): Promise<void> {
  await getPost();
  await setThemeCodePreview();
  generarIndexContent();
}

async function getPost(): Promise<void> {
  const loading = await presentLoading({
    message: "Obteniendo publicación",
  });
  loading.present();

  try {
    await usePost().loadPost({
      id: postId,
    });
  } catch (e: any) {
    console.error(e);
  } finally {
    loading.dismiss();
  }
}

async function setThemeCodePreview(): Promise<void> {
  const theme = (await getTheme()) ?? "light";
  let file = "" as any;

  if (theme == "nord")
    file = await import(
      "../../../../node_modules/highlight.js/styles/atom-one-dark.css"
    );
  if (theme == "gruvbox")
    file = await import(
      "../../../../node_modules/highlight.js/styles/dark.css"
    );
  if (theme == "light")
    file = await import(
      "../../../../node_modules/highlight.js/styles/atom-one-light.css"
    );

  const cssNode = document.createElement("style");
  cssNode.innerHTML = file.default;
  document.head.appendChild(cssNode);
}

function generarIndexContent(): void {
  headings = indexRef.value.querySelectorAll("h1, h2, h3, h4, h5, h6");

  let count = 0;
  headings.forEach(
    (heading: { id: string; textContent: string; tagName: string }) => {
      heading.id = count.toString();

      indexContent.value.push({
        name: heading.textContent as string,
        id: count.toString(),
        type: heading.tagName.toLowerCase(),
      });

      count++;
    },
  );
}

async function updatePost(): Promise<void> {
  spinners.value.buttonUpdate = true;
  await router.push("/blog/editor/update/" + postId);
  spinners.value.buttonUpdate = false;
}

async function deletePost(): Promise<void> {
  spinners.value.buttonDelete = true;

  const alertResponse = await presentAlertConfirmation({
    message: "¿Desea eliminar el post?",
  });

  if (alertResponse == false) {
    spinners.value.buttonDelete = false;
    return;
  }

  try {
    await deletePost({ id: postId as string });
    spinners.value.buttonDelete = false;
    router.go(-1);
    // eventBus().emitter.emit("new-post");
  } catch (e: any) {
    spinners.value.buttonDelete = false;
    useSystem().openToastError(e);
  }
}

function goToSection(params: { id: string }): void {
  const id = params.id;
  const element = document.getElementById(id);
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
</script>
