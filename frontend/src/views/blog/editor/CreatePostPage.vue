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
          :disabled="!isFormValid || systemController.getLoader().status"
          @click="save()"
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
      :show-delete="false"
      @upload-image="uploadImage($event)"
      @update-data="
        setData({
          title: $event.title,
          description: $event.description,
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
// 1. Imports (ionic/vue/ionicons)
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  chevronBackOutline,
  optionsOutline,
  saveOutline,
} from "ionicons/icons";

// 2. Controllers / Composables
import { usePostEditor } from "@/composables/usePostEditor";
const { postController, systemController, errorController, uploadCover } = usePostEditor();

// 3. Components
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";

// 4. Interface and types imports
import type { StatusPost } from "@/controllers/postController";
import type { CreatePost } from "../../../utils/interfaces";

// 5. Main (props, emits)
// (none)

// 6. Vars and const
const router = useRouter();
const content = ref("");
const images = ref<string[]>([]);
const editorRef = ref<InstanceType<typeof EditorComponent>>();
const pageTitle = "Editor";
const coverId = ref<number | undefined>(undefined);
const status = ref<StatusPost>("draft");
const title = ref("");
const description = ref("");
const isVisibleEditorSettings = ref(true);

// 7. Watch
// (none)

// 8. Computed
const isFormValid = computed(() => !!(title.value && content.value));

// 9. OnMounted
// (none)

// 10. Functions
async function save(): Promise<void> {
  if (!isFormValid.value) return;
  openLoader({ color: "primary" });

  try {
    await createPost({
      title: title.value,
      description: description.value,
      content: content.value,
      coverId: coverId.value,
      images: images.value,
      status: status.value,
    });
    await systemController.presentToast({ message: "Post agregado" });
    router.go(-1);
  } catch (e) {
    console.error(e);
    closeLoader();
    errorController.openToastError({ error: e as Error });
  }
}

async function createPost(params: CreatePost): Promise<void> {
  try {
    await postController.createPost(params);
  } catch (e) {
    errorController.openToastError({ error: e as Error });
  }
}

async function uploadImage(e: File): Promise<void> {
  openLoader({ color: "primary" });

  try {
    const { id: idImage, url: urlImage } = await postController.uploadImage({
      image: e,
      type: "post",
    });

    content.value =
      '<div class="center"><img src="' +
      urlImage +
      '" style="width:80%"/></div>';

    if (idImage) images.value.push(idImage);
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
  } finally {
    closeLoader();
  }
}

async function getImageURL(params: { name: string }): Promise<string> {
  return (await systemController.getImageURL(params)).url;
}

async function setData(params: {
  title: string;
  description?: string;
  content: string;
  cover: File;
  status: StatusPost;
}): Promise<void> {
  const {
    title: titleData,
    description: descriptionData,
    content: contentData,
    cover: coverData,
    status: statusData,
  } = params;
  title.value = titleData;
  description.value = descriptionData ?? "";
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

function openLoader(params: { color: string }): void {
  systemController.enableLoader({ color: params.color });
}

function closeLoader(): void {
  systemController.disableLoader();
}
</script>
