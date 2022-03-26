<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @uploadImage="uploadImage($event)"
        @save="save($event)"
        :title="title"
        :content="content"
        :cover="cover"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, toastController } from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";
import EditorComponent from "./EditorPage.vue";
import eventBus from "../../../EventBus";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonPage,
    EditorComponent,
  },
  data() {
    return {
      idPost: this.$route.params.id,
      segment: "editor",
      title: "",
      content: "",
      cover: { id: "", name: "", source: "" },
      newImages: Array<string>(),
      images: Array<string>(),
    };
  },
  beforeRouteEnter(to, from, next) {
    userService()
      .getUserPermissions()
      .then((response) => {
        if (response.admin) {
          next();
        } else {
          next("/blog");
        }
      })
      .catch((e) => {
        next("/blog");
      });
  },
  mounted() {
    this.getPost();
  },
  methods: {
    async getPost() {
      const loading = await systemService().presentLoading(
        "Obteniendo publicación"
      );
      loading.present();

      postService()
        .getPost(this.idPost as string)
        .then(async (response) => {
          const title = response.data.post.title;
          const content = response.data.post.content;
          const coverName = response.data.post.cover.name;
          const coverId = response.data.post.cover.id;
          const coverSource = (
            await postService().getImage({ name: coverName })
          ).data.getImage.image[0].source;

          this.setData({ title, content, coverId, coverName, coverSource });
          loading.dismiss();
        })
        .catch((e) => {
          loading.dismiss();
        });
    },

    setData(data: {
      title: string;
      content: string;
      coverId: string;
      coverName: string;
      coverSource: string;
    }) {
      this.title = data.title;
      this.content = data.content;
      this.cover = {
        id: data.coverId,
        name: data.coverName,
        source: data.coverSource,
      };
      this.getPostImages(data.content);
    },

    async save(data: {
      title: string;
      content: string;
      cover: object;
      newCoverStatus: boolean;
    }) {
      const loading = await systemService().presentLoading("Actualizando post");
      loading.present();

      const id = this.idPost as string;
      const title = data.title;
      const content = data.content;
      const cover = data.cover;
      const coverId = this.cover.id;
      let newCoverId = "";
      const newCoverStatus = data.newCoverStatus;
      const images = this.newImages;
      const imagesRemoved = this.getRemovedImages(data.content);

      let uploadCover = true;
      if (newCoverStatus) {
        uploadCover = await this.uploadCover(cover)
          .then((response) => {
            newCoverId = response;
            return true;
          })
          .catch((e) => {
            console.log(e);
            systemService().openToast("Ocurrió un problema", "danger");
            return false;
          });
      }

      if (uploadCover == false) {
        loading.dismiss();
        return;
      }

      this.updatePost({
        id,
        title,
        content,
        coverId,
        newCoverId,
        images,
        imagesRemoved,
      })
        .then(() => {
          loading.dismiss();
          eventBus().emitter.emit("refresh-content", { event: "new-post" });
          systemService().openToast("Actualizado correctamente", "success");
          this.clearInputs();
          this.$router.go(-1);
        })
        .catch((e) => {
          console.log(e);
          loading.dismiss();
          systemService().openToast("Ocurrió un problema", "danger");
        });
    },

    async updatePost(data: {
      id: string;
      title: string;
      content: string;
      coverId: string;
      newCoverId: string;
      images: Array<string>;
      imagesRemoved: Array<string>;
    }) {
      return new Promise((resolve, reject) => {
        postService()
          .updatePost({
            id: data.id,
            title: data.title,
            content: data.content,
            coverId: data.coverId,
            newCoverId: data.newCoverId,
            images: data.images,
            imagesRemoved: data.imagesRemoved,
          })
          .then((response) => {
            resolve(true);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    async uploadImage(e: any) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = e.image;

      postService()
        .uploadImage(image)
        .then((response) => {
          loading.dismiss();

          this.content =
            "![Markdown Logo](http://localhost:8000/api/get-image?name=" +
            response.data.data.uploadImage.image[0].name +
            " 'Markdown Tutorial')";

          this.newImages.push(response.data.data.uploadImage.image[0].id);
        })
        .catch((e) => {
          loading.dismiss();
          systemService().openToast(
            "Ocurrió un error al subir la imagen",
            "danger"
          );
        });
    },
    async uploadCover(image: object): Promise<string> {
      return new Promise((resolve, reject) => {
        postService()
          .uploadImage(image)
          .then((response) => {
            resolve(response.data.data.uploadImage.image[0].id);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    clearInputs() {
      this.title = "";
      this.content = "";
      this.cover.id = "";
      this.newImages.length = 0;
      (this.$refs.editorRef as any).clearInputs();
    },
    getPostImages(content: string) {
      const imageId = content.match(/\bhttp?:\/\/\S+/gi);
      imageId?.forEach((element) => {
        this.images.push(element);
      });
    },
    getRemovedImages(content: string) {
      const imagesRemoved = Array<string>();
      this.images.forEach((element: string) => {
        if (content.includes(element) == false) {
          imagesRemoved.push(element.split("=")[1]);
        }
      });
      return imagesRemoved;
    },
  },
});
</script>
