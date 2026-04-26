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
            :model-value="stackData"
            @update:model-value="stackData = $event"
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
  IonContent,
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonBreadcrumbs,
  IonBreadcrumb,
} from "@ionic/vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import StackEditor from "../editors/StackEditor.vue";
import IntroController from "@/controllers/introController";
import { saveOutline } from "ionicons/icons";
import type { StackItem } from "@/services/types";

const introController = new IntroController();
const router = useRouter();
const saving = ref(false);

const stackData = ref<StackItem[]>([]);
const pendingFiles = reactive<Record<number, File>>({});

onMounted(async () => {
  try {
    const data = await introController.loadIntro();
    stackData.value = data.stack || [];
  } catch (error) {
    console.error("Error loading stack:", error);
  }
});

function updateStackFiles(fileMap: Record<number, File>) {
  Object.keys(fileMap).forEach(key => {
    pendingFiles[Number(key)] = fileMap[Number(key)];
  });
}

async function handleSave() {
  saving.value = true;
  try {
    const files: Record<string, File> = {};
    Object.entries(pendingFiles).forEach(([k, v]) => {
      files[`stack_image_${k}`] = v;
    });
    await introController.saveIntro({
      name: "",
      tags: [],
      description: "",
      socials: [],
      logoUrl: null,
      photoUrl: null,
      stack: stackData.value,
      showContactForm: { socials: false, freelance: false },
    }, files);
    router.push("/admin-panel");
  } catch (error) {
    console.error("Error saving stack:", error);
  } finally {
    saving.value = false;
  }
}
</script>