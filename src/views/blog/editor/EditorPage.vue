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
          <ion-button @click="createPost()" :disabled="v$.form.$invalid">
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
          <ion-input
            @ionChange="setTitle($event.detail.value)"
            v-model="v$.form['title'].$model"
          ></ion-input>
        </ion-item>
        <div v-for="(error, index) of v$.form['title'].$errors" :key="index">
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
        <div v-for="(error, index) of v$.form['cover'].$errors" :key="index">
          <div class="error">{{ error.$message }}</div>
        </div>

        <ion-item>
          <ion-label position="floating">Editor</ion-label>
          <ion-textarea
            auto-grow="true"
            placeholder="Contenido"
            @ionChange="setContent($event.detail.value)"
            v-model="v$.form['content'].$model"
          ></ion-textarea>
        </ion-item>
        <div v-for="(error, index) of v$.form['content'].$errors" :key="index">
          <div class="error">{{ error.$message }}</div>
        </div>
      </section>

      <section v-if="segment == 'result'">
        <ion-row>
          <ion-col size="12">
            <img :src="form.cover" style="max-width: 32%" />
          </ion-col>
        </ion-row>
        <ion-row>
          <h1 class="ion-padding">{{ form.title }}</h1>
          <ion-col size="12">
            <Markdown :source="form.content" />
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
      form: { title: "", content: "", cover: "" },
      coverName: "",
    };
  },
  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        title: {
          required: helpers.withMessage(messageRequired, required),
        },
        content: {
          required: helpers.withMessage(messageRequired, required),
        },
        cover: {
          required: helpers.withMessage(messageRequired, required),
        },
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
  mounted() {
    eventBus().emitter.on("set-data-post-update", (response: any) => {
      this.form.title = response.title;
      this.form.content = response.content;
      this.form.cover = response.cover;
    });
  },
  methods: {
    createPost() {
      this.$emit("createPost");
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
      this.form.cover = image;
      this.coverName = image.name;
      this.$emit("uploadCover", { image });
    },
    setTitle(e: string) {
      this.$emit("setTitle", { title: e });
    },
    setContent(e: string) {
      this.$emit("setContent", { content: e });
    },
    clearInputs() {
      this.form.title = "";
      this.form.content = "";
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
