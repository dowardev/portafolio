<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @createPost="updatePost"
        @uploadCover="uploadCover($event)"
        @uploadImage="uploadImage($event)"
        @setTitle="form.title = $event.title"
        @setContent="setContent($event.content)"
        :cover="coverSource"
        :title="form.title"
        :content="form.content"
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
      form: {
        title: "",
        content: "",
        coverId: "",
        newCoverId: "",
        newImages: Array<string>(),
        imagesRemoved: Array<string>(),
      },
      coverSource: "",
      content: "",
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
          const cover = await postService().getImage({ name: coverName });

          this.showPost(
            title,
            content,
            coverId,
            cover.data.getImage.image[0].source
          );
          this.getPostImages();
          loading.dismiss();
        })
        .catch((e) => {
          loading.dismiss();
        });
    },
    showPost(title: string, content: string, coverId: string, cover: string) {
      this.form.title = title;
      this.form.content = content;
      this.form.coverId = coverId;
      this.coverSource = "data:image/png;base64," + cover;
    },
    async updatePost() {
      const loading = await systemService().presentLoading("Actualizando post");
      loading.present();
      const title = this.form.title;
      const content = this.form.content;
      const coverId = this.form.coverId;
      const newCoverId = this.form.newCoverId;
      const images = this.form.newImages;
      const imagesRemoved = this.form.imagesRemoved;

      postService()
        .updatePost({
          id: this.idPost as string,
          title,
          content,
          coverId,
          newCoverId,
          images,
          imagesRemoved,
        })
        .then((response) => {
          loading.dismiss();
          eventBus().emitter.emit("refresh-content", { event: "new-post" });
          this.openToast("Publicado correctamente", "success");
          this.clearInputs();
          this.$router.push("/blog");
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un error al publicar", "danger");
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

          this.form.content +=
            "![Markdown Logo](http://localhost:8000/api/get-image?name=" +
            response.data.data.uploadImage.image[0].name +
            " 'Markdown Tutorial')";

          this.form.newImages.push(response.data.data.uploadImage.image[0].id);
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un error al subir la imagen", "danger");
        });
    },
    async uploadCover(e) {
      const loading = await systemService().presentLoading("Subiendo imagen");
      loading.present();
      const image = e.image;

      postService()
        .uploadImage(image)
        .then((response) => {
          loading.dismiss();

          this.coverSource =
            "data:image/png;base64," +
            response.data.data.uploadImage.image[0].source;

          this.form.newCoverId = response.data.data.uploadImage.image[0].id;
        })
        .catch((e) => {
          loading.dismiss();
          this.openToast("Ocurrió un al subir la portada", "danger");
        });
    },
    async openToast(message: string, color: string) {
      const toast = await toastController.create({
        message,
        duration: 2000,
        color,
      });
      return toast.present();
    },
    clearInputs() {
      this.form.title = "";
      this.form.content = "";
      this.form.coverId = "";
      this.form.newImages.length = 0;
    },
    setContent(e) {
      this.form.content = e;
      this.getRemovedImages();
    },
    getPostImages() {
      const imageId = this.form.content.match(/\bhttp?:\/\/\S+/gi);
      imageId?.forEach((element) => {
        this.images.push(element);
      });
    },
    getRemovedImages() {
      this.images.forEach((element: string) => {
        if (this.form.content.includes(element) == false) {
          this.form.imagesRemoved.push(element.split("=")[1]);
        }
      });
    },
  },
});
</script>
