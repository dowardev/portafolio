<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        :title="title"
        :content="content"
        :cover="cover"
        :spinner-save-post="spinners.savePost"
        :spinner-save-image="spinners.saveImage"
        @upload-image="uploadImage($event)"
        @save="save($event)"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  openToast,
  uploadImage as uploadImageService,
  getBaseURL,
  presentLoading,
} from "../../../services/system";
import EditorComponent from "./EditorPage.vue";
import {
  POSTS_UPDATE_DETAILS,
  POST_DETAILS,
  UPLOAD_IMAGE,
} from "../../../services/graphql";
import { useRoute, useRouter } from "vue-router";
import { UpdatePost } from "@/services/interfaces";

// controllers
import PostController from "../../../composables/usePost";
import SystemController from "../../../composables/useSystem";
const postController = new PostController();
const systemController = new SystemController();

const router = useRouter();
const route = useRoute();

const openToastError = systemController.openToastError;

const idPost = route.params.id as string;
const title = ref("");
const content = ref("");
const cover = ref({ id: "", name: "", source: "" });
const newImages = ref(Array<string>());
const images = ref(Array<string>());
const spinners = { savePost: false, saveImage: false };
const editorRef = ref(null);

// mounted
onMounted(() => {
  getPost();
});

// functions
async function getPost(): Promise<void> {
  const loading = await presentLoading({
    message: "Obteniendo publicación",
  });
  loading.present();

  try {
    await postController.loadPost({
      id: idPost,
    });

    const post = postController.getPost({
      id: idPost,
    })!;
    const title = post.title ?? "";
    const content = post.content ?? "";
    const coverName = post.cover.name ?? "";
    const coverId = post.cover.id ?? "";
    const coverSource = post.cover.source ?? "";

    if (post) {
      setData({ title, content, coverId, coverName, coverSource });
    }

    loading.dismiss();
  } catch (e: any) {
    console.error(e);
    loading.dismiss();
    openToastError(e);
  }
}

function setData(data: {
  title: string;
  content: string;
  coverId: string;
  coverName: string;
  coverSource: string;
}): void {
  title.value = data.title;
  content.value = data.content;
  cover.value = {
    id: data.coverId,
    name: data.coverName,
    source: data.coverSource,
  };
  getPostImages(data.content);
}

async function save(data: {
  title: string;
  content: string;
  coverSource: string;
  newCoverStatus: boolean;
}): Promise<void> {
  spinners.savePost = true;

  const id = idPost as string;
  const title = data.title;
  const content = data.content;
  const coverData = {
    source: data.coverSource,
    newCoverId: "",
    oldCoverId: cover.value.id,
  };
  const newCoverStatus = data.newCoverStatus;
  const images = newImages.value;
  const imagesRemoved = getRemovedImages(data.content);

  if (newCoverStatus) {
    try {
      const response = await uploadCover({ image: coverData.source });
      coverData.newCoverId = response!.id;
    } catch (e: any) {
      console.error(e);
      spinners.savePost = false;
      openToastError(e);
      return;
    }
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
      },
    });
    await refreshPostsCotent();
    spinners.savePost = false;
    router.go(-1);
    openToast({ message: "Post actualizado" });
  } catch (e: any) {
    console.error(e);
    spinners.savePost = false;
    openToastError(e);
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
  spinners.saveImage = true;
  const image = e;

  try {
    const response = await uploadImageService({
      image,
      type: "post",
    });
    const imageName = response.name;
    spinners.saveImage = false;

    const api = (await getImageURL({ name: imageName! })).url;
    content.value =
      '<div class="center"><img src="' + api + '" style="width:80%"/></div>';

    if (response.id) images.value.push(response.id);
  } catch (e: any) {
    console.error(e);
    spinners.saveImage = false;
    openToastError(e);
  }
}

async function uploadCover(params: {
  image: string;
}): Promise<{ id: string } | undefined> {
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
  const imageId = content.match(/\bhttp?:\/\/\S+/gi);
  imageId?.forEach((element) => {
    images.value.push(element);
  });
}

function getRemovedImages(content: string) {
  const imagesRemoved = Array<string>();
  images.value.forEach((element: string) => {
    if (content.includes(element) == false) {
      imagesRemoved.push(element.split("=")[1]);
    }
  });
  return imagesRemoved;
}

async function refreshPostsCotent() {
  try {
    await postController.loadPost({
      id: idPost,
    });
  } catch (e: any) {
    console.error(e);
  }
}

async function getImageURL(params: {
  name: string;
}): Promise<{ id: string; name: string; url: string }> {
  const { name } = params;

  return await systemController.getImageURL({ name });
}
</script>
