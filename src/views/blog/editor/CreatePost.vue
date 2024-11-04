<template>
  <ion-page>
    <ion-content class="container-page">
      <EditorComponent
        ref="editorRef"
        :spinner-save-post="spinners.savePost"
        :content="content"
        :spinner-save-image="spinners.saveImage"
        @upload-image="uploadImage($event)"
        @save="save($event)"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { createPost as createPostService } from "../../../services/post";
import {
  openToast,
  uploadImage as uploadImageService,
  getBaseURL,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import { CreatePost } from "../../../services/interfaces";
import { usePost } from "../../../composables/usePost";
import { useSystem } from "../../../composables/useSystem";
import { useRouter } from "vue-router";

const router = useRouter();

const openToastError = useSystem().openToastError;

const content = ref("");
const images = Array<string>();
const spinners = { savePost: false, saveImage: false };

const editorRef = ref(null);

// functions
async function save(data: {
  title: string;
  content: string;
  cover: File;
}): Promise<void> {
  spinners.savePost = true;

  const title = data.title;
  const content = data.content;
  const cover = data.coverSource;
  let coverId = "";

  try {
    const response = await uploadCover({ image: cover });
    coverId = response.id;
  } catch (e: any) {
    console.error(e);
    spinners.savePost = false;
    openToastError(e);
    return;
  }

  try {
    await createPost({
      title,
      content,
      coverId,
      images,
    });
    // await refreshPostsCotent();
    // clearInputs();
    spinners.savePost = false;
    router.go(-1);
    openToast({ message: "Post agregado" });
  } catch (e: any) {
    console.error(e);
    spinners.savePost = false;
    openToastError(e);
  }
}

async function createPost({
  title,
  content,
  coverId,
  images,
}: CreatePost): Promise<void> {
  try {
    await createPostService({
      title,
      content,
      coverId,
      images,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}

async function uploadImage(e: any): Promise<void> {
  spinners.saveImage = true;
  const image = e.image.file;

  try {
    const response = await uploadImageService({
      image,
    });

    const imageName = response.name;
    spinners.saveImage = false;

    const api = getBaseURL() + "api/get-image-posts?name=" + imageName;
    content.value =
      '<div class="center"><img src="' + api + '" style="width:80%"/></div>';

    if (response.id) images.push(response.id);
  } catch (e: any) {
    console.error(e);
    spinners.saveImage = false;
    openToastError(e);
  }
}

async function uploadCover(params: { image: File }): Promise<{ id: string }> {
  const { image } = params;
  try {
    const { id } = await usePost().updateCover({ image });
    return { id };
  } catch (e: any) {
    openToastError(e);
    throw new Error(e);
  }
}

// function clearInputs() {
//   (editorRef.value as any).clearInputs();
// }

async function refreshPostsCotent() {
  let currentPage = usePost().getCurrentPage()!;
  if (currentPage == undefined) currentPage = "";

  try {
    await usePost().loadDates({
      graphql: { name: POST_DATES, fragment: "PostDates", refetch: true },
    });
  } catch (e: any) {
    console.error(e);
    openToastError(e);
    throw e;
  }

  try {
    await usePost().loadPosts({
      date: currentPage,
      graphql: {
        name: ALL_POSTS_DETAILS,
        fragment: "PostsDetails",
        refetch: true,
      },
    });
  } catch (e: any) {
    console.error(e);
    openToastError(e);
    throw e;
  }
}
</script>
