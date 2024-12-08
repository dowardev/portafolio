<template>
  <ion-page class="page-container">
    <!-- loader -->
    <ion-progress-bar
      v-if="progressBar.status"
      :class="{
        'primary-progress-bar': progressBar.color == 'primary' || '',
        'danger-progress-bar': progressBar.color == 'danger',
      }"
      type="indeterminate"
    ></ion-progress-bar>

    <ion-content :fullscreen="true">
      <EditorComponent
        v-if="contentLoaded"
        ref="editorRef"
        :title="title"
        :content="content"
        :cover="{ name: cover.name }"
        :disableUI="progressBar.status"
        :postStatus="postStatus"
        @upload-image="uploadImage($event)"
        @save="
          save({
            title: $event.title,
            content: $event.content,
            cover: $event.cover,
            status: $event.status,
          })
        "
        @delete-post="deletePost({ id: idPost })"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, loadingController } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UpdatePost } from "@/services/interfaces";

// controllers
import PostController from "../../../controllers/postController";
import SystemController from "../../../controllers/systemController";
const postController = new PostController();
const systemController = new SystemController();

// components
import EditorComponent from "@/views/blog/editor/EditorComponent.vue";
import { StatusPost } from "@/services/types";

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
const editorRef = ref(null);
const progressBar = ref<{ status: boolean; color: string }>({
  status: false,
  color: "primary",
});
const contentLoaded = ref(false);
const postStatus = ref<StatusPost>();

// mounted
onMounted(() => {
  getPost();
});

// functions
async function getPost(): Promise<void> {
  toggleLoader({ status: true });

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
    toggleLoader({ status: false });
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
  toggleLoader({ status: true });

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
      toggleLoader({ status: false });
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
    toggleLoader({ status: false });
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
  toggleLoader({ status: true });

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
    toggleLoader({ status: false });
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
  toggleLoader({ status: true, color: "danger" });

  try {
    await postController.deletePost({ id });
    await systemController.presentToast({ message: "Post eliminado" });
    await router.push({ name: "PostsPage" });
  } catch (error) {
    console.error(error);
  } finally {
    toggleLoader({ status: false });
  }
}

function toggleLoader(params: { status: boolean; color?: string }) {
  const { status, color = "primary" } = params;
  progressBar.value = {
    status: status,
    color: color,
  };
}
</script>
