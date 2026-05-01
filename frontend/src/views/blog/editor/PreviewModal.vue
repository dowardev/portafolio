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
    <ion-row>
      <ion-col>
        <MdPreview :model-value="props.content" />
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

const props = defineProps({
  content: { default: "", type: String },
});

// functions
function closeModal() {
  return modalController.dismiss();
}
</script>
