<template>
  <div v-if="usePost().getPost({ id: postId }) != undefined">
    <ion-row>
      <ion-col>
        <ion-header
          v-if="scrollPosition == 0 && !isPlatform('desktop')"
          class="fade-in-title ion-no-border"
        >
          <ion-toolbar style="--background: transparent">
            <ion-title size="large">
              <div class="ion-text-wrap">
                {{ usePost().getPost({ id: postId })!.title }}
              </div>
            </ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-col>
    </ion-row>

    <!-- content -->
    <ion-row>
      <ion-col size-xs="11" size-md="9">
        <div
          ref="indexRef"
          style="overflow: auto; height: 85vh"
          @scroll="setScrollPosition()"
        >
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

      <ion-col
        v-if="hideIndexContentComponentvalue"
        size="3"
        class="ion-padding-top"
      >
        <!-- index content -->
        <indexContentComponent
          :index-content="indexContent"
          :auto-hide-content="hideContentIndexValue"
          @element-id="goToSection({ id: $event })"
        />
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonRow,
  IonCol,
  isPlatform,
  modalController,
} from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import { createOutline, menuOutline, trashOutline } from "ionicons/icons";
import {
  presentLoading,
  presentAlertConfirmation,
  getTheme,
} from "@/services/system";
import eventBus from "@/EventBus";
import { POST_DETAILS } from "@/services/graphql";
import { usePost } from "@/composables/usePost";
import { useUser } from "@/composables/useUser";
import { useSystem } from "@/composables/useSystem";
import indexContentComponent from "../indexContentComponent.vue";
import modalIndexContent from "../modalIndexContent.vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useRoute, useRouter } from "vue-router";
import { onIonViewWillLeave } from "@ionic/vue";

const route = useRoute();
const emits = defineEmits(["showTitle"]);
const props = defineProps({
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const hideContentIndexValue = isPlatform("desktop") == true ? true : false;
const hideIndexContentComponentvalue =
  isPlatform("desktop") == true ? true : false;
const postId = route.params.id as string;
const indexContent = ref(
  [] as Array<{ name: string; id: string; type: string }>
);
const indexRef = ref();
let headings = null;
const useSytemComposable = useSystem();
const scrollPosition = ref(0);

// mounted
onMounted(() => {
  start();
});

onIonViewWillLeave(() => {
  clearHeadings();
});

watch(
  () => scrollPosition.value,
  (newValue) => {
    if (newValue == 0) emits("showTitle", false);
    else emits("showTitle", true);
  }
);

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
  const theme = await getTheme();
  let file = "" as any;

  if (theme == "nord")
    file = await import(
      "../../../../../node_modules/highlight.js/styles/atom-one-dark.css"
    );
  if (theme == "gruvbox")
    file = await import(
      "../../../../../node_modules/highlight.js/styles/dark.css"
    );
  if (theme == "light")
    file = await import(
      "../../../../../node_modules/highlight.js/styles/atom-one-light.css"
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
    }
  );
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

function clearHeadings(): void {
  headings = null;
}

function setScrollPosition(): void {
  scrollPosition.value = indexRef.value.scrollTop;
}

// export functions
defineExpose({ openModalIndexContent });
</script>

<style scoped>
.post-date {
  font-size: 12px !important;
}

.card-main-content {
  height: 82vh;
  overflow: hidden;
}

.section-content {
  max-height: 82vh;
  overflow: auto;
}

ion-content {
  --overflow: hidden;
}

.section-content::-webkit-scrollbar {
  display: none;
}

@media only screen and (min-width: 1200px) {
  .indexContent {
    display: block;
  }
}
</style>
<style>
.default-theme code {
  --md-theme-code-inline-color: white !important;
  background-color: var(--ion-color-primary);
}
</style>
