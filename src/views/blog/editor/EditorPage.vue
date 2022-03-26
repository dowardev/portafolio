<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Editor</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="save()" :disabled="v$.$invalid">
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="segment-container">
        <ion-segment v-model="segment" class="segment-editor">
          <ion-segment-button value="editor">
            <ion-label>Editor</ion-label>
          </ion-segment-button>
          <ion-segment-button value="result">
            <ion-label>Resultado</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <section v-if="segment == 'editor'">
        <ion-item lines="none">
          <ion-button
            slot="end"
            fill="clear"
            @click="($refs as any).inputImage.click()"
          >
            <ion-icon :icon="imagesOutline"></ion-icon>
          </ion-button>
          <input
            accept="image/*"
            type="file"
            @change="uploadImage($event)"
            style="display: none"
            ref="inputImage"
          />
        </ion-item>
        <ion-item>
          <ion-label position="floating">Titulo</ion-label>
          <ion-input v-model="v$.postTitle.$model"> </ion-input>
        </ion-item>
        <div v-for="(error, index) of v$.postTitle.$errors" :key="index">
          <div class="error">{{ error.$message }}</div>
        </div>

        <ion-item
          button
          @click="($refs as any).inputCover.click()"
          lines="full"
        >
          <ion-label slot="start">Portada</ion-label>
          <input
            accept="image/*"
            type="file"
            @change="uploadCover($event)"
            style="display: none"
            ref="inputCover"
          />
          <ion-label slot="end">{{ coverName }}</ion-label>
        </ion-item>
        <div v-for="(error, index) of v$.coverSource.$errors" :key="index">
          <div class="error">{{ error.$message }}</div>
        </div>

        <ion-item>
          <ion-label position="floating">Editor</ion-label>
          <ion-textarea
            auto-grow="true"
            placeholder="Contenido"
            v-model="v$.postContent.$model"
          ></ion-textarea>
        </ion-item>
        <div v-for="(error, index) of v$.postContent.$errors" :key="index">
          <div class="error">{{ error.$message }}</div>
        </div>
      </section>

      <!-- view -->
      <section v-if="segment == 'result'">
        <ion-row>
          <ion-col size="12">
            <img :src="coverImage" style="max-width: 32%" />
          </ion-col>
        </ion-row>
        <ion-row>
          <h1 class="ion-padding">{{ title }}</h1>
          <ion-col size="12">
            <Markdown :source="content" />
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonInput,
  IonButtons,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import {
  saveOutline,
  imageOutline,
  chevronBackOutline,
  imagesOutline,
} from "ionicons/icons";
import userService from "../../../services/user.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import eventBus from "../../../EventBus";

export default defineComponent({
  name: "EditorPage",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    Markdown,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonInput,
    IonButtons,
    IonItem,
    IonButton,
    IonIcon,
    IonLabel,
    IonRow,
    IonCol,
    IonPage,
  },
  props: {
    title: String,
    content: String,
    cover: {},
  },
  watch: {
    title: function (newVal, oldVal) {
      (this.v$ as any).postTitle.$model = newVal;
    },
    content: function (newVal, oldVal) {
      (this.v$ as any).postContent.$model += newVal;
    },
    cover: function (newVal, oldVal) {
      this.coverName = newVal.name;
      this.coverSource = "data:image/png;base64," + newVal.source;
    },
  },
  setup() {
    return {
      saveOutline,
      imageOutline,
      chevronBackOutline,
      imagesOutline,
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      segment: "editor",
      postTitle: "",
      postContent: "",
      coverName: "",
      coverImage: "",
      coverSource: "",
      newCoverStatus: false,
    };
  },
  validations() {
    const messageRequired = "Campo requerido";
    return {
      postTitle: {
        required: helpers.withMessage(messageRequired, required),
      },
      postContent: {
        required: helpers.withMessage(messageRequired, required),
      },
      coverSource: {
        required: helpers.withMessage(messageRequired, required),
      },
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
  methods: {
    save() {
      const title = this.postTitle;
      const content = this.postContent;
      const cover = this.coverSource;
      const newCoverStatus = this.newCoverStatus;
      this.$emit("save", { title, content, cover, newCoverStatus });
    },
    getImage(e: any) {
      const file = e.target.files[0];
      return file;
      // const reader = new FileReader();
      // reader.onload = (e: any) => {
      // const fileData = e.target.result;
      // };
      // reader.readAsDataURL(file);
    },
    async uploadImage(e: any) {
      const image = this.getImage(e);
      this.$emit("uploadImage", { image });
    },
    async uploadCover(e: any) {
      const image = this.getImage(e);
      this.coverImage = URL.createObjectURL(image);
      this.coverSource = image;
      this.coverName = image.name;
      this.newCover = true;
    },
    clearInputs() {
      this.postTitle = "";
      this.postContent = "";
      this.coverName = "";
      this.v$.$reset();
    },
  },
});
</script>

<style scoped>
@media only screen and (min-width: 992px) {
  .segment-container {
    display: flex;
    justify-content: center;
  }
  .segment-editor {
    max-width: 25vw;
  }
}
</style>
