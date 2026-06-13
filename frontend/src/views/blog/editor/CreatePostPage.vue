<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          fill="clear"
          :disabled="systemController.getLoader().status"
          @click="router.go(-1)"
        >
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <!-- save -->
        <ion-button
          fill="clear"
          color="primary"
          :disabled="!validateData() || systemController.getLoader().status"
          @click="save({ title, content, coverId, status })"
        >
          <ion-icon slot="start" :icon="saveOutline"></ion-icon>
        </ion-button>

        <!-- settings -->
        <ion-button
          v-if="!isVisibleEditorSettings"
          @click="openEditorSettings()"
        >
          <ion-icon :icon="optionsOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content style="height: 89dvh">
    <EditorComponent
      ref="editorRef"
      :content="content"
      :disable-u-i="systemController.getLoader().status"
      @upload-image="uploadImage($event)"
      @update-data="
        setData({
          title: $event.title,
          content: $event.content,
          cover: $event.cover,
          status: $event.status,
        })
      "
      @update-visible-editor-settings="isVisibleEditorSettings = $event"
    ></EditorComponent>
  </ion-content>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";
import { CreatePost } from "../../../utils/interfaces";
import { useRouter } from "vue-router";
import type { StatusPost } from "@/controllers/postController";
import {
  chevronBackOutline,
  optionsOutline,
  saveOutline,
} from "ionicons/icons";

// controllers
import PostController from "../../../controllers/postController";
import SystemController from "../../../controllers/systemController";
import ErrorController from "@/controllers/errorController";
const postController = new PostController();
const systemController = new SystemController();
const errorController = new ErrorController();

// vars
const router = useRouter();
const content = ref("");
const images = Array<string>();
const editorRef = ref<InstanceType<typeof EditorComponent>>();
const pageTitle = "Editor";
const coverId = ref<number | undefined>(undefined);
const status = ref<StatusPost>("draft");
const title = ref("");
const isVisibleEditorSettings = ref(true);

// functions
async function save(params: {
  title: string;
  content: string;
  coverId: number | undefined;
  status: StatusPost;
}): Promise<void> {
  const { title, content, coverId, status } = params;
  openLoader({ color: "primary" });

  try {
    await createPost({
      title,
      content,
      coverId,
      images,
      status,
    });
    await systemController.presentToast({ message: "Post agregado" });
    router.go(-1);
  } catch (e) {
    console.error(e);
    closeLoader();
    errorController.openToastError({ error: e as Error });
  }
}

async function createPost({
  title,
  content,
  coverId,
  images,
  status,
}: CreatePost): Promise<void> {
  try {
    await postController.createPost({
      title,
      content,
      coverId,
      images,
      status,
    });
  } catch (e) {
    errorController.openToastError({ error: e as Error });
  }
}

async function uploadImage(e: File): Promise<void> {
  const image = e;
  openLoader({ color: "primary" });

  try {
    const { id: idImage, url: urlImage } = await postController.uploadImage({
      image,
      type: "post",
    });

    // const api = await getImageURL({ name: imageName! });
    content.value =
      '<div class="center"><img src="' +
      urlImage +
      '" style="width:80%"/></div>';

    if (idImage) images.push(idImage);
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
  } finally {
    closeLoader();
  }
}

async function uploadCover(params: { image: File }): Promise<{ id: string }> {
  const { image } = params;
  try {
    const { id } = await postController.updateCover({ image });
    return { id };
  } catch (e) {
    errorController.openToastError({ error: e as Error });
    throw e;
  }
}

// function clearInputs() {
//   (editorRef.value as any).clearInputs();
// }

async function getImageURL(params: { name: string }): Promise<string> {
  const { name } = params;
  return (await systemController.getImageURL({ name })).url;
}

async function openLoader(params: { color: string }): Promise<void> {
  const { color } = params;
  systemController.enableLoader({ color });
}

function closeLoader(): void {
  systemController.disableLoader();
}

async function setData(params: {
  title: string;
  content: string;
  cover: File;
  status: StatusPost;
}): Promise<void> {
  const {
    title: titleData,
    content: contentData,
    cover: coverData,
    status: statusData,
  } = params;
  title.value = titleData;
  content.value = contentData;
  if (coverData.size > 0) {
    try {
      const response = await uploadCover({ image: coverData });
      coverId.value = Number(response.id);
    } catch (e) {
      console.error(e);
      errorController.openToastError({ error: e as Error });
      return;
    } finally {
      closeLoader();
    }
  }
  status.value = statusData;
}

function openEditorSettings() {
  editorRef.value?.openSettings();
  isVisibleEditorSettings.value = true;
}

function validateData() {
  if (!title.value || !content.value) {
    return false;
  }
  return true;
}
</script>
