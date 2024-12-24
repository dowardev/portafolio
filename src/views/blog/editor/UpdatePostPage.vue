<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          fill="clear"
          @click="router.go(-1)"
          :disabled="systemController.getLoader().status"
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
          @click="openEditorSettings()"
          v-if="!isVisibleEditorSettings"
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
      :title="title"
      :content="content"
      :cover="{ name: cover.name }"
      :disableUI="systemController.getLoader().status"
      :postStatus="postStatus"
      @upload-image="uploadImage($event)"
      @update-data="
        setData2({
          title: $event.title,
          content: $event.content,
          cover: $event.cover,
          status: $event.status,
        })
      "
      @delete-post="deletePost({ id: idPost })"
      @update-visible-editor-settings="isVisibleEditorSettings = $event"
    ></EditorComponent>
  </ion-content>
</template>

<script setup lang="ts">
import { IonPage, loadingController } from "@ionic/vue";
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
const postController = new PostController();
const systemController = new SystemController();

// components
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";
import { StatusPost } from "@/services/types";

// vars
const router = useRouter();
const route = useRoute();
const openToastError = systemController.openToastError;
const idPost = route.params.id as string;
const title = ref("");
const content = ref("");
const cover = ref<{ id: string | undefined; name: string | undefined }>({
  id: "",
  name: "",
});
const newImages = ref(Array<string>());
const images = ref<string[]>([]);
const editorRef = ref<InstanceType<typeof EditorComponent>>();
const contentLoaded = ref(false);
const postStatus = ref<StatusPost>();
const pageTitle = "Editor";
const coverId = ref("");
const status = ref<StatusPost>("draft");
const isVisibleEditorSettings = ref(true);

// mounted
onMounted(() => {
  getPost();
});

// functions
async function getPost(): Promise<void> {
  openLoader({ color: "primary" });

  try {
    await postController.loadPost({
      id: idPost,
    });

    const post = postController.getPost({
      id: idPost,
    })!;
    const title = post.title ?? "";
    const content = post.content ?? "";
    const coverId = post.cover?.id ?? undefined;
    const coverName = post.cover?.name ?? undefined;
    const status = post.status;

    if (post) {
      setData({ title, content, coverId, coverName, status });
      contentLoaded.value = true;
    }
  } catch (e: any) {
    console.error(e);
    openToastError(e);
  } finally {
    closeLoader();
  }
}

function setData(data: {
  title: string;
  content: string;
  coverId: string | undefined;
  coverName: string | undefined;
  status: StatusPost;
}): void {
  title.value = data.title;
  content.value = data.content;
  cover.value = {
    id: data.coverId,
    name: data.coverName,
  };
  postStatus.value = data.status;
  getPostImages(data.content);
}

async function save(data: {
  title: string;
  content: string;
  cover: File;
  status: StatusPost;
}): Promise<void> {
  const { title, content, cover: newCover, status } = data;
  openLoader({ color: "primary" });

  const id = idPost as string;
  const coverData = {
    newCoverId: "",
    oldCoverId: cover.value.id,
  };
  const images = newImages.value;
  const imagesRemoved = getRemovedImages(data.content);

  if (newCover instanceof File && newCover.size > 0) {
    try {
      const response = await uploadCover({ image: newCover });
      coverData.newCoverId = response.id;
    } catch (e: any) {
      console.error(e);
      openToastError(e);
      return;
    } finally {
      closeLoader();
    }
  }

  if (newCover instanceof File && newCover.size == 0) {
    coverData.newCoverId = "-1";
  }

  try {
    await updatePost({
      post: {
        id,
        title,
        content,
        cover: coverData,
        images,
        imagesRemoved,
        status,
      },
    });
    await systemController.presentToast({ message: "Post actualizado" });
    router.go(-1);
  } catch (e: any) {
    openToastError(e);
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
    content.value =
      '<div class="center"><img src="' +
      imagUrl +
      '" style="width:80%"/></div>';
  } catch (e: any) {
    console.error(e);
    openToastError(e);
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
    openToastError(e);
    throw new Error(e);
  }
}

function getPostImages(content: string) {
  const imageUrls = content.match(/\bhttp?:\/\/[^\s"']+/gi);
  imageUrls?.forEach((url) => {
    console.log(url);
    const imageName = url.split("/").pop();
    if (imageName) {
      images.value?.push(imageName);
    }
  });
}

function getRemovedImages(content: string) {
  const imagesRemoved: string[] = [];
  images.value.forEach((element: string) => {
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

async function deletePost(params: { id: string }) {
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
  console.log(params);
  title.value = titleData;
  content.value = contentData;
  if (coverData.size > 0) {
    try {
      const response = await uploadCover({ image: coverData });
      coverId.value = response.id;
    } catch (e: any) {
      console.error(e);
      openToastError(e);
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
