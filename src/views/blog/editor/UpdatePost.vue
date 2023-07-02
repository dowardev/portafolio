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
import { usePost } from "../../../composables/usePost";
import { useSystem } from "../../../composables/useSystem";
import { useRoute, useRouter } from "vue-router";
import { UpdatePost } from "@/services/interfaces";

const router = useRouter();
const route = useRoute();

const openToastError = useSystem().openToastError;

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
async function getPost() {
  const loading = await presentLoading({
    message: "Obteniendo publicación",
  });
  loading.present();

  try {
    await usePost().loadPost({
      id: idPost,
      graphql: {
        name: POSTS_UPDATE_DETAILS,
        fragment: "PostUpdateDetails",
        refetch: true,
      },
    });

    const post = usePost().getPost({
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
}) {
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
  cover: string;
  newCoverStatus: boolean;
}) {
  spinners.savePost = true;

  const id = idPost as string;
  const title = data.title;
  const content = data.content;
  const coverData = {
    id: cover.value.id,
    name: cover.value.name,
    source: cover.value.source,
    newCoverId: "",
  };
  const newCoverStatus = data.newCoverStatus;
  const images = newImages.value;
  const imagesRemoved = getRemovedImages(data.content);

  if (newCoverStatus) {
    try {
      const response = await uploadCover({ image: cover.value.source });
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
    await usePost().updatePost({ post: params.post });
  } catch (e: any) {
    throw new Error(e);
  }
}

async function uploadImage(e: any) {
  spinners.saveImage = true;
  const image = e.image.file;

  try {
    const response = await uploadImageService({
      graphql: { name: UPLOAD_IMAGE, fragment: "UploadImage" },
      image,
    });
    const imageName = response.name;
    spinners.saveImage = false;

    const api = getBaseURL() + "api/get-image-posts?name=" + imageName;
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
    const { id } = await usePost().updateCover({ image });
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
    await usePost().loadPost({
      id: idPost,
      graphql: {
        name: POST_DETAILS,
        fragment: "PostDetails",
        refetch: true,
      },
    });
  } catch (e: any) {
    console.error(e);
  }
}
</script>
