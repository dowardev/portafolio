<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title
          v-if="usePost().getPost({ id: postId as string })! != undefined"
        >
          {{ usePost().getPost({ id: postId })!.title }}
        </ion-title>

        <ion-buttons
          v-if="useUser().user.value.isAdmin"
          slot="end"
          :collapse="true"
        >
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button
            v-if="hideIndexContentComponentvalue == false"
            @click="openModalIndexContent()"
          >
            <ion-icon :icon="menuOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content
      v-if="usePost().getPost({ id: postId }) != undefined"
      :fullscreen="true"
    >
      <section class="section-options">
        <ion-row>
          <ion-col size="12">
            <div style="float: right">
              <ion-button fill="clear" @click="updatePost()">
                <ion-icon :icon="createOutline"></ion-icon>
              </ion-button>

              <ion-button fill="clear" @click="deletePost()">
                <ion-icon :icon="trashOutline" color="danger"></ion-icon>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </section>

      <!-- content -->
      <ion-row>
        <ion-col size="9" ref="el">
          <ion-card class="main-content">
            <MdPreview
              style="
                --md-bk-color: var(--ion-background-color-rgb);
                --md-color: var(--ion-text-color);
              "
              :model-value="usePost().getPost({ id: postId })!.content"
              theme="dark"
            />
          </ion-card>
        </ion-col>

        <ion-col size="3" v-if="hideIndexContentComponentvalue">
          <!-- index content -->
          <indexContentComponent
            :index-content="indexContent"
            :auto-hide-content="hideContentIndexValue"
            @element-id="goToSection({ id: $event })"
          />
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonRow,
  IonCol,
  isPlatform,
  modalController,
} from "@ionic/vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { deletePost } from "../../../services/post";
import {
  alertCircleOutline,
  chevronBackOutline,
  createOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import {
  presentLoading,
  presentAlertConfirmation,
  getTheme,
} from "../../../services/system";
import eventBus from "../../../EventBus";
import { POST_DETAILS } from "../../../services/graphql";
import { usePost } from "../../../composables/usePost";
import { useUser } from "../../../composables/useUser";
import { format, formatISO } from "date-fns";
import { useSystem } from "../../../composables/useSystem";
import { es } from "date-fns/locale";
import indexContentComponent from "./indexContentComponent.vue";
import modalIndexContent from "./modalIndexContent.vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useRoute, useRouter } from "vue-router";
import { onIonViewWillLeave } from "@ionic/vue";

const route = useRoute();
const router = useRouter();

const hideContentIndexValue = isPlatform("desktop") == true ? true : false;
const hideIndexContentComponentvalue =
  isPlatform("desktop") == true ? true : false;
const postId = route.params.id as string;
const post = reactive({
  title: "",
  content: "",
  cover: "",
  created: "",
  updated: "",
});
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const indexContent = ref(
  [] as Array<{ name: string; id: string; type: string }>
);
const el = ref(null);
let headings = null;

// mounted
onMounted(() => {
  start();
});

onIonViewWillLeave(() => {
  clearHeadings();
});

// functions
async function start() {
  await getPost();
  await setThemeCodePreview();
  generarIndexContent();
}

async function getPost() {
  const loading = await presentLoading({
    message: "Obteniendo publicación",
  });
  loading.present();

  try {
    await usePost().loadPost({
      id: postId,
      graphql: {
        name: POST_DETAILS,
        fragment: "PostDetails",
        refetch: false,
      },
    });
  } catch (e: any) {
    console.error(e);
  } finally {
    loading.dismiss();
  }
}

function setData(data: {
  title: string;
  content: string;
  coverSource: string;
  created: string;
  updated: string;
}) {
  post.title = data.title;
  post.content = data.content;
  post.cover = "data:image/png;base64," + data.coverSource;
  post.created = data.created;
  post.updated = data.updated;
}

async function updatePost() {
  spinners.value.buttonUpdate = true;
  await router.push("/blog/editor/update/" + postId);
  spinners.value.buttonUpdate = false;
}

async function deletePost() {
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
    eventBus().emitter.emit("new-post");
  } catch (e: any) {
    spinners.value.buttonDelete = false;
    useSystem().openToastError(e);
  }
}

async function setThemeCodePreview() {
  const theme = await getTheme();
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

function generarIndexContent() {
  headings = (el.value as any).$el.querySelectorAll("h1, h2, h3, h4, h5, h6");

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

function goToSection(params: { id: string }) {
  const id = params.id;
  const element = document.getElementById(id);
  if (element)
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
}

async function openModalIndexContent() {
  const modal = await modalController.create({
    component: modalIndexContent,
    componentProps: {
      indexContent: indexContent,
    },
  });
  modal.present();

  const { data } = await modal.onWillDismiss();
  if (data != null) {
    const elementId = data.elementId;
    goToSection({ id: elementId });
  }
}

function clearHeadings() {
  headings = null;
}
</script>

<style scoped>
.post-date {
  font-size: 12px !important;
}

.content-container {
  width: 100%;
}

.content-container > div {
  display: flex;
  justify-content: center;
}

.content-container > div > div {
  width: 100%;
}

.main-content {
  max-height: 82vh;
  overflow: auto;
}

@media only screen and (min-width: 768px) {
  .content-container {
    width: 100%;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 70%;
  }
}

@media only screen and (min-width: 992px) {
  .content-container {
    width: 70%;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 60%;
  }
}

@media only screen and (min-width: 1200px) {
  .content-container {
    width: 70vw;
  }

  .content-container > div {
    display: flex;
    justify-content: center;
  }

  .content-container > div > div {
    width: 60%;
  }

  .indexContent {
    display: block;
  }
}
</style>
