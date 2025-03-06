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
          @click="
            save({
              id: post.id!,
              title: post.title,
              content: post.content,
              coverId: post.cover.id,
              status: post.status,
              newImages: post.newImages,
            })
          "
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
      :content="post.content"
      :cover="{ name: post.cover.name }"
      :disable-u-i="systemController.getLoader().status"
      :post-status="post.status"
      @upload-image="uploadImage($event)"
      @update-data="
        setData2({
          title: $event.title,
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
import { IonPage, isPlatform, loadingController } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UpdatePost } from "@/services/interfaces";
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

// components
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";
import { StatusPost } from "@/services/types";

// vars
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
  content: "",
  cover: { id: 0, name: "" },
  status: "draft" as StatusPost,
  images: [] as string[],
  newImages: [] as string[],
});

// mounted
onMounted(() => {
  getPost();
});

// functions
async function getPost(): Promise<void> {
  openLoader({ color: "primary" });

  try {
    await postController.loadPost({
      id: post.value.id!,
    });

    const postResponse = postController.getPost({
      id: post.value.id!,
    })!;
    const title = postResponse.title ?? "";
    const content = postResponse.content ?? "";
    const coverId = postResponse.cover?.id ?? undefined;
    const coverName = postResponse.cover?.name ?? undefined;
    const status = postResponse.status;

    if (post.value) {
      setData({ title, content, coverId: coverId!, coverName, status });
      contentLoaded.value = true;
    }
  } catch (e: any) {
    console.error(e);
    errorController.openToastError(e);
  } finally {
    closeLoader();
  }
}

function setData(data: {
  title: string;
  content: string;
  coverId: number | undefined;
  coverName: string | undefined;
  status: StatusPost;
}): void {
  post.value.title = data.title;
  post.value.content = data.content;
  post.value.cover = {
    id: data.coverId!,
    name: data.coverName!,
  };
  post.value.status = data.status;
  getPostImages(data.content);
}

async function save(data: {
  id: number;
  title: string;
  content: string;
  coverId: number;
  status: StatusPost;
  newImages: string[];
}): Promise<void> {
  const { id, title, content, coverId, status, newImages } = data;
  openLoader({ color: "primary" });

  const imagesRemoved = getRemovedImages(data.content);

  try {
    await updatePost({
      post: {
        id,
        title,
        content,
        coverId,
        images: newImages,
        imagesRemoved,
        status,
      },
    });
    await systemController.presentToast({ message: "Post actualizado" });
    await router.go(-1);
  } catch (e: any) {
    errorController.openToastError(e);
  } finally {
    closeLoader();
  }
}

async function updatePost(params: { post: UpdatePost }): Promise<void> {
  try {
    await postController.updatePost({ post: params.post });
  } catch (e: any) {
    throw new Error(e);
  }
}

async function uploadImage(e: any) {
  const image = e;
  openLoader({ color: "primary" });

  try {
    const response = await postController.uploadImage({
      image,
      type: "post",
    });
    const imageName = response.name;

    const imagUrl = await getImageURL({ name: imageName! });
    post.value.content =
      '<div class="center"><img src="' +
      imagUrl +
      '" style="width:80%"/></div>';
  } catch (e: any) {
    console.error(e);
    errorController.openToastError(e);
  } finally {
    closeLoader();
  }
}

async function uploadCover(params: { image: File }): Promise<{ id: string }> {
  const { image } = params;
  try {
    const { id } = await postController.updateCover({ image });
    return { id };
  } catch (e: any) {
    errorController.openToastError(e);
    throw new Error(e);
  }
}

function getPostImages(content: string) {
  const imageUrls = content.match(/\bhttp?:\/\/[^\s"']+/gi);
  imageUrls?.forEach((url) => {
    console.log(url);
    const imageName = url.split("/").pop();
    if (imageName) {
      post.value.images?.push(imageName);
    }
  });
}

function getRemovedImages(content: string) {
  const imagesRemoved: string[] = [];
  post.value.images.forEach((element: string) => {
    if (content.includes(element) == false) {
      imagesRemoved.push(element);
    }
  });
  return imagesRemoved;
}

async function getImageURL(params: { name: string }): Promise<string> {
  const { name } = params;
  return (await systemController.getImageURL({ name })).url;
}

async function deletePost(params: { id: number }) {
  const id = params.id;
  openLoader({ color: "danger" });

  try {
    await postController.deletePost({ id });
    await systemController.presentToast({ message: "Post eliminado" });
    await router.push({ name: "PostsPage" });
  } catch (error) {
    console.error(error);
  } finally {
    closeLoader();
  }
}

function openLoader(params: { color: string }) {
  const { color = "primary" } = params;
  systemController.enableLoader({ color });
}

function closeLoader() {
  systemController.disableLoader();
}

async function setData2(params: {
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
  post.value.title = titleData;
  post.value.content = contentData;
  if (coverData.size > 0) {
    try {
      const response = await uploadCover({ image: coverData });
      post.value.cover.id = parseInt(response.id);
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
  if (!post.value.title || !post.value.content) {
    return false;
  }
  return true;
}
</script>
