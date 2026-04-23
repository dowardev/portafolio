<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <ion-title>Stack</ion-title>

      <ion-buttons slot="end">
        <ion-button
          :disabled="saving"
          @click="handleSave"
        >
          <ion-spinner v-if="saving" slot="start">
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
          <ion-breadcrumbs>
            <ion-breadcrumb>
              <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
            </ion-breadcrumb>

            <ion-breadcrumb>Stack editor</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <StackEditor
            v-model="stackData"
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
import { ref, onMounted } from "vue";
import StackEditor from "../editors/StackEditor.vue";
import IntroController from "@/controllers/introController";
import { saveOutline } from "ionicons/icons";

const introController = new IntroController();
const stackData = ref<Array<{ name: string; image: string }>>([]);
const saving = ref(false);
const stackFiles = ref<Record<number, File>>({});

onMounted(async () => {
  try {
    const data = await introController.loadIntro();
    stackData.value = data.stack || [];
  } catch (error) {
    console.error("Error loading stack:", error);
  }
});

function updateStackFiles(fileMap: Record<number, File>) {
  Object.assign(stackFiles.value, fileMap);
}

async function handleSave() {
  saving.value = true;
  try {
    const introData = {
      name: null,
      tags: [],
      description: null,
      socials: [],
      logoUrl: null,
      photoUrl: null,
      stack: stackData.value,
      showContactForm: { socials: false, freelance: false },
    };
    const files: Record<string, File> = {};
    Object.entries(stackFiles.value).forEach(([k, v]) => {
      files[`stack_image_${k}`] = v;
    });
    await introController.saveIntro(introData, files);
  } catch (error) {
    console.error("Error saving stack:", error);
  } finally {
    saving.value = false;
  }
}
</script>
