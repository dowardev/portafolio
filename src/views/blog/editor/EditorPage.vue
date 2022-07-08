<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end" :collapse="true">
          <ion-button
            @click="save()"
            :disabled="(v$ as any).$invalid || spinnerSavePost"
          >
            <ion-icon
              :icon="saveOutline"
              v-if="spinnerSavePost == false"
            ></ion-icon>
            <ion-spinner
              name="crescent"
              v-if="spinnerSavePost"
              color="primary"
            ></ion-spinner>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
          <ion-buttons slot="end" :collapse="true">
            <ion-button
              @click="save()"
              :disabled="v$.$invalid || spinnerSavePost"
            >
              <ion-icon
                :icon="saveOutline"
                v-if="spinnerSavePost == false"
              ></ion-icon>
              <ion-spinner
                name="crescent"
                v-if="spinnerSavePost"
                color="primary"
              ></ion-spinner>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-item-divider sticky>
        <ion-segment v-model="segment" scrollable>
          <ion-segment-button value="editor">
            <ion-label>Editor</ion-label>
          </ion-segment-button>
          <ion-segment-button value="result">
            <ion-label>Resultado</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <section v-if="segment == 'editor'">
        <!-- input image -->
        <div style="display: inline-block; width: 100%">
          <div style="float: right">
            <ion-item lines="none">
              <ion-button
                slot="end"
                fill="clear"
                @click="($refs as any).inputImage.click()"
                :disabled="spinnerSaveImage"
              >
                <ion-icon
                  :icon="imagesOutline"
                  v-if="spinnerSaveImage == false"
                ></ion-icon>
                <ion-spinner
                  name="crescent"
                  v-if="spinnerSaveImage"
                  color="primary"
                ></ion-spinner>
              </ion-button>
            </ion-item>
          </div>
          <input
            accept="image/*"
            type="file"
            @change="uploadImage($event)"
            style="display: none"
            ref="inputImage"
          />
        </div>

        <ion-item>
          <ion-label position="floating">Titulo</ion-label>
          <ion-input
            v-model="(v$ as any).postTitle.$model"
            :spellcheck="true"
            autocorrect="on"
            pattern="text"
          >
          </ion-input>
        </ion-item>
        <div
          v-for="(error, index) of (v$ as any).postTitle.$errors"
          :key="index"
        >
          <div class="error">{{ error.$message }}</div>
        </div>

        <!-- input cover -->
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
        <div
          v-for="(error, index) of (v$ as any).coverSource.$errors"
          :key="index"
        >
          <div class="error">{{ error.$message }}</div>
        </div>

        <ion-item>
          <ion-label position="floating">Editor</ion-label>
          <ion-textarea
            :auto-grow="true"
            placeholder="Contenido"
            v-model="(v$ as any).postContent.$model"
            :spellcheck="true"
            autocorrect="on"
            pattern="text"
          ></ion-textarea>
        </ion-item>
        <div
          v-for="(error, index) of (v$ as any).postContent.$errors"
          :key="index"
        >
          <div class="error">{{ error.$message }}</div>
        </div>
      </section>

      <!-- view -->
      <section v-if="segment == 'result'">
        <ion-row>
          <ion-col size="12">
            <img :src="coverSource" />
          </ion-col>
        </ion-row>
        <ion-row class="ion-padding">
          <h1>{{ postTitle }}</h1>
          <ion-col size="12">
            <Markdown
              :source="postContent"
              :html="true"
              :linkify="true"
              :highlightjs="true"
            />
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
  isPlatform,
  IonItemDivider,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import {
  saveOutline,
  imageOutline,
  chevronBackOutline,
  imagesOutline,
} from "ionicons/icons";
import { getUser } from "../../../services/user";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { USER_PERMISSIONS } from "../../../services/graphql";

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
    IonItemDivider,
  },

  props: {
    title: String,
    content: String,
    cover: {},
    spinnerSavePost: Boolean,
    spinnerSaveImage: Boolean,
  },

  setup() {
    const modeDesingElements = isPlatform("ios") ? "ios" : "md";
    return {
      saveOutline,
      imageOutline,
      chevronBackOutline,
      imagesOutline,
      v$: useVuelidate(),
      modeDesingElements,
      pageTitle: "Editor",
    };
  },

  data() {
    return {
      segment: "editor",
      postTitle: "",
      postContent: "",
      coverName: "",
      coverSource: "",
      newCoverStatus: false,
    };
  },

  watch: {
    title: function (newVal) {
      this.postTitle = newVal;
    },
    content: function (newVal) {
      this.postContent += newVal;
    },
    cover: function (newVal) {
      this.coverName = newVal.name;
      this.coverSource = "data:image/png;base64," + newVal.source;
    },
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
    getUser({
      graphql: { name: USER_PERMISSIONS, fragment: "UserPermissions" },
    })
      .then((response) => {
        if (response.is_admin) {
          next();
        } else {
          next("/");
        }
      })
      .catch(() => {
        next("/");
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

    async getImageBase64(e: any): Promise<{ file: string; name: string }> {
      return new Promise((resolve) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const fileData = e.target.result;
          resolve({ file: fileData, name: file.name });
        };
        reader.readAsDataURL(file);
      });
    },

    async uploadImage(e: any) {
      const image = await this.getImageBase64(e);
      this.$emit("uploadImage", { image });
    },

    async uploadCover(e: any) {
      const image = await this.getImageBase64(e);
      this.coverSource = image.file;
      this.coverName = image.name;
      this.newCoverStatus = true;
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
/* @import "highlight.js/styles/androidstudio.css"; */
@import "highlight.js/styles/monokai.css";
</style>
