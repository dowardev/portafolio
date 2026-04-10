<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Experiencia</ion-title>

      <ion-buttons slot="end">
        <ion-button
          :disabled="homeEditorStore.saving.value"
          @click="homeEditorStore.save"
        >
          <ion-spinner
            v-if="homeEditorStore.saving.value"
            slot="start"
          ></ion-spinner>

          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ExperienceEditor
            v-model="homeEditorStore.form.experience"
            @update:files="updateExpFiles"
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { onMounted } from "vue";
import ExperienceEditor from "../editors/ExperienceEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import { saveOutline } from "ionicons/icons";

const homeEditorStore = useHomeEditorStore();

onMounted(() => {
  homeEditorStore.loadData();
});

function updateExpFiles(fileMap: Record<string, File>) {
  Object.assign(homeEditorStore.sectionFiles.experience, fileMap);
}
</script>
