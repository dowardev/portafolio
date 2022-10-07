<template>
  <ion-header
    :translucent="true"
    collapse="fade"
    mode="ios"
    class="ion-no-border"
  >
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="closeModal()">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title>Contenido</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    {{ position }}
    <ion-row>
      <ion-col>
        <MarkdownItComponent
          id="preview2"
          style="height: calc(90vh - 50px); overflow: scroll"
          :source="content"
        />
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { closeOutline } from "ionicons/icons";
import MarkdownItComponent from "../../../components/markdownit/MarkdownItComponent.vue";

export default defineComponent({
  name: "PreviewModal",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    MarkdownItComponent,
  },

  props: {
    content: { default: "", type: String },
    position: { default: "", type: String },
  },

  setup() {
    return { closeOutline };
  },

  mounted() {
    setTimeout(() => {
      document.getElementById("preview2")!.scrollTop = parseInt(this.position);
      console.log(
        this.position,
        document.getElementById("preview2")!.scrollTop
      );
    }, 100);
  },

  methods: {
    closeModal() {
      this.position;
      return modalController.dismiss();
    },
  },
});
</script>
