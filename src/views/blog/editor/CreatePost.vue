<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <EditorComponent
        ref="editorRef"
        @uploadImage="uploadImage($event)"
        @save="save($event)"
        :content="content"
        :spinnerSavePost="spinners.savePost"
        :spinnerSaveCover="spinners.saveCover"
      ></EditorComponent>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";
import EditorComponent from "./EditorPage.vue";
import eventBus from "../../../EventBus";
import { CreatePost } from "@/services/interfaces.vue";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonPage,
    EditorComponent,
  },
  data() {
    return {
      segment: "editor",
      content: "",
      images: Array<string>(),
      spinners: { savePost: false, saveCover: false },
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
      .catch(() => {
        next("/blog");
      });
  },

  methods: {
    async save(data: { title: string; content: string; cover: object }) {
      this.spinners.savePost = true;

      const title = data.title;
      const content = data.content;
      const cover = data.cover;
      let coverId = "";
      const images = this.images;

      try {
        const response = await this.uploadCover(cover);
        coverId = response;
      } catch (e: any) {
        console.error(e);
        this.spinners.savePost = false;
        systemService().openToastErrror(e);
        return;
      }

      try {
        await this.createPost({
          title,
          content,
          coverId,
          images,
        });
        this.spinners.savePost = false;
        eventBus().emitter.emit("refresh-content", { event: "new-post" });
        this.clearInputs();
        this.$router.go(-1);
        systemService().openToast({
          message: "Publicado correctamente",
          color: "success",
        });
      } catch (e: any) {
        console.error(e);
        this.spinners.savePost = false;
        systemService().openToastErrror(e);
      }
    },

    async createPost({
      title,
      content,
      coverId,
      images,
    }: CreatePost): Promise<void> {
      try {
        await postService().createPost({
          title,
          content,
          coverId,
          images,
        });
        return;
      } catch (e: any) {
        throw new Error(e);
      }
    },

    async uploadImage(e: any) {
      this.spinners.saveCover = true;
      const image = e.image;
      const query = `
            image {
              id
              name
            }
              `;

      try {
        const response = await postService().uploadImage({ query, image });
        this.spinners.saveCover = false;
        const imageName = response.name;

        this.content =
          "![" +
          imageName +
          "](http://localhost:8000/api/get-image?name=" +
          imageName +
          " '" +
          imageName +
          "')";

        if (response.id) this.images.push(response.id);
      } catch (e: any) {
        console.error(e);
        this.spinners.saveCover = false;
        systemService().openToastErrror(e);
      }
    },

    async uploadCover(image: object): Promise<string> {
      const query = `
            image {
              id
            }
              `;
      try {
        const response = await postService().uploadImage({ image, query });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response.id!;
      } catch (e: any) {
        throw new Error(e);
      }
    },

    clearInputs() {
      (this.$refs.editorRef as any).clearInputs();
    },
  },
});
</script>
