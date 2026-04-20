<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Stack</ion-title>

      <ion-buttons slot="end">
        <ion-button
          :disabled="homeEditorStore.saving.value"
          @click="homeEditorStore.save"
        >
          <ion-spinner v-if="homeEditorStore.saving.value" slot="start">
          </ion-spinner>

          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <StackEditor
            v-model="homeEditorStore.form.stack"
            @update:files="updateStackFiles"
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
import StackEditor from "../editors/StackEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import HomeEditorController from "@/controllers/homeEditorController";
import { saveOutline } from "ionicons/icons";

const homeEditorStore = useHomeEditorStore();
const homeEditorController = new HomeEditorController();

onMounted(async () => {
  homeEditorStore.setLoading(true);
  try {
    const data = await homeEditorController.loadData();
    homeEditorStore.setData(data);
  } finally {
    homeEditorStore.setLoading(false);
  }
});

function updateStackFiles(fileMap: Record<number, File>) {
  Object.assign(homeEditorStore.sectionFiles.stack, fileMap);
}
</script>
