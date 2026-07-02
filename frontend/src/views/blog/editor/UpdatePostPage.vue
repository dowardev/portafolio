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
      v-if="contentLoaded"
      ref="editorRef"
      :title="post.title"
      :description="post.description"
      :content="post.content"
      :cover="{ name: post.cover.name }"
      :disable-u-i="systemController.getLoader().status"
      :post-status="post.status"
      :show-delete="true"
      @upload-image="uploadImage($event)"
      @update-data="
        setData2({
          title: $event.title,
          description: $event.description,
          content: $event.content,
          cover: $event.cover,
          status: $event.status,
        })
      "
      @delete-post="deletePost({ id: post.id! })"
      @update-visible-editor-settings="isVisibleEditorSettings = $event"
    ></EditorComponent>
  </ion-content>
</template>

<script setup lang="ts">
// 1. Imports (ionic/vue/ionicons)
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, isPlatform } from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  chevronBackOutline,
  optionsOutline,
  saveOutline,
} from "ionicons/icons";

// 2. Controllers / Composables
import { usePostEditor } from "@/composables/usePostEditor";
const { postController, systemController, errorController, uploadCover, getImageURL } = usePostEditor();

// 3. Components
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";

// 4. Interface and types imports
import type { StatusPost } from "@/controllers/postController";
import { UpdatePost } from "@/utils/interfaces";

// 5. Main (props, emits)
// (none)

// 6. Vars and const
const router = useRouter();
const route = useRoute();
const editorRef = ref<InstanceType<typeof EditorComponent>>();
const contentLoaded = ref(false);
const pageTitle = "Editor";
const status = ref<StatusPost>("draft");
const isVisibleEditorSettings = ref(isPlatform("desktop") ? true : false);
const post = ref({
  id: parseInt(route.params.id as string) as number | undefined,
  title: "",
  description: "",
  content: "",
  cover: { id: 0, name: "" },
  status: "draft" as StatusPost,
  images: [] as string[],
  newImages: [] as string[],
});

// 7. Watch
// (none)

// 8. Computed
const isFormValid = computed(() => !!(post.value.title && post.value.content));

// 9. OnMounted
onMounted(() => {
  getPost();
});

// 10. Functions
async function getPost(): Promise<void> {
  openLoader({ color: "primary" });

  try {
    await postController.loadPostById({
      id: post.value.id!,
    });

    const postResponse = postController.getPostById({
      id: post.value.id!,
    })!;
    const title = postResponse.title ?? "";
    const description = postResponse.description ?? "";
    const content = postResponse.content ?? "";
    const coverId = postResponse.cover?.id ?? undefined;
    const coverName = postResponse.cover?.name ?? undefined;
    const postStatus = postResponse.status;

    setData({ title, description, content, coverId, coverName, status: postStatus });
    contentLoaded.value = true;
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
  } finally {
    closeLoader();
  }
}

function setData(data: {
  title: string;
  description?: string;
  content: string;
  coverId: number | undefined;
  coverName: string | undefined;
  status: StatusPost;
}): void {
  post.value.title = data.title;
  post.value.description = data.description ?? "";
  post.value.content = data.content;
  post.value.cover = {
    id: data.coverId ?? 0,
    name: data.coverName ?? "",
  };
  post.value.status = data.status;
  getPostImages(data.content);
}

async function save(): Promise<void> {
  if (!isFormValid.value) return;
  openLoader({ color: "primary" });

  const imagesRemoved = getRemovedImages(post.value.content);

  try {
    await postController.updatePost({
      post: {
        id: post.value.id!,
        title: post.value.title,
        description: post.value.description,
        content: post.value.content,
        coverId: post.value.cover.id,
        images: post.value.newImages,
        imagesRemoved,
        status: post.value.status,
      },
    });
    await systemController.presentToast({ message: "Post actualizado" });
    await router.go(-1);
  } catch (e) {
    errorController.openToastError({ error: e as Error });
  } finally {
    closeLoader();
  }
}

async function uploadImage(e: File): Promise<void> {
  openLoader({ color: "primary" });

  try {
    const response = await postController.uploadImage({
      image: e,
      type: "post",
    });
    const imageName = response.name;

    const imagUrl = await getImageURL({ name: imageName! });
    post.value.content =
      '<div class="center"><img src="' +
      imagUrl +
      '" style="width:80%"/></div>';

    if (imageName) {
      post.value.newImages.push(imageName);
    }
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
  } finally {
    closeLoader();
  }
}

function getPostImages(content: string): void {
  const imageUrls = content.match(/\bhttps?:\/\/[^\s"']+/gi);
  imageUrls?.forEach((url) => {
    const imageName = url.split("/").pop();
    if (imageName) {
      post.value.images.push(imageName);
    }
  });
}

function getRemovedImages(content: string): string[] {
  return post.value.images.filter((element) => !content.includes(element));
}

async function deletePost(params: { id: number }): Promise<void> {
  openLoader({ color: "danger" });

  try {
    await postController.deletePost({ id: params.id });
    await systemController.presentToast({ message: "Post eliminado" });
    await router.push({ name: "PostsPage" });
  } catch (error) {
    console.error(error);
  } finally {
    closeLoader();
  }
}

async function setData2(params: {
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
  post.value.title = titleData;
  post.value.description = descriptionData ?? "";
  post.value.content = contentData;
  if (coverData.size > 0) {
    try {
      const response = await uploadCover({ image: coverData });
      post.value.cover.id = Number(response.id);
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

function openEditorSettings(): void {
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
