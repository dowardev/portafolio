<template>
  <ion-page class="page-container">
    <!-- loader -->
    <ion-progress-bar
      v-if="progressBar"
      class="primary-progress-bar"
      type="indeterminate"
    ></ion-progress-bar>

    <ion-content>
      <EditorComponent
        ref="editorRef"
        :content="content"
        :disableUI="progressBar"
        @upload-image="uploadImage($event)"
        @save="
          save({
            title: $event.title,
            content: $event.content,
            cover: $event.cover,
            status: $event.status,
          })
        "
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";
import { CreatePost } from "../../../services/interfaces";
import { useRouter } from "vue-router";
import { StatusPost } from "@/services/types";

// controllers
import PostController from "../../../controllers/postController";
import SystemController from "../../../controllers/systemController";

const postController = new PostController();
const systemController = new SystemController();

// vars
const router = useRouter();
const openToastError = systemController.openToastError;
const content = ref("");
const images = Array<string>();
const editorRef = ref(null);
const progressBar = ref<true | false>(false);

// functions
async function save(params: {
  title: string;
  content: string;
  cover: File;
  status: StatusPost;
}): Promise<void> {
  const { title, content, cover, status } = params;
  let coverId = "";
  progressBar.value = true;

  if (cover.size > 0) {
    try {
      const response = await uploadCover({ image: cover });
      coverId = response.id;
    } catch (e: any) {
      console.error(e);
      openToastError(e);
      return;
    } finally {
      progressBar.value = false;
    }
  }

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
  } catch (e: any) {
    console.error(e);
    progressBar.value = false;
    openToastError(e);
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
  } catch (e: any) {
    throw new Error(e);
  }
}

async function uploadImage(e: File): Promise<void> {
  const image = e;
  progressBar.value = true;

  try {
    const response = await postController.uploadImage({
      image,
      type: "post",
    });

    const imageName = response.name;

    const api = await getImageURL({ name: imageName! });
    content.value =
      '<div class="center"><img src="' + api + '" style="width:80%"/></div>';

    if (response.id) images.push(response.id);
  } catch (e: any) {
    console.error(e);
    openToastError(e);
  } finally {
    progressBar.value = false;
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

// function clearInputs() {
//   (editorRef.value as any).clearInputs();
// }

async function getImageURL(params: { name: string }): Promise<string> {
  const { name } = params;
  return (await systemController.getImageURL({ name })).url;
}
</script>
