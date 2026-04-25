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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import StackEditor from "../editors/StackEditor.vue";
import IntroController from "@/controllers/introController";
import { useIntroStore } from "@/store/introStore";
import { saveOutline } from "ionicons/icons";

const introController = new IntroController();
const introStore = useIntroStore();
const router = useRouter();

const stackData = computed({
  get: () => introStore.form.stack,
  set: (value) => { introStore.form.stack = value; }
});
const saving = computed(() => introStore.saving);
const loading = computed(() => introStore.loading);

onMounted(async () => {
  try {
    await introController.loadIntro();
  } catch (error) {
    console.error("Error loading stack:", error);
  }
});

function updateStackFiles(fileMap: Record<number, File>) {
  Object.assign(introStore.sectionFiles.stack, fileMap);
}

async function handleSave() {
  try {
    const files: Record<string, File> = {};
    Object.entries(introStore.sectionFiles.stack).forEach(([k, v]) => {
      files[`stack_image_${k}`] = v;
    });
    await introController.saveIntro({
      name: introStore.form.name,
      tags: introStore.form.tags,
      description: introStore.form.description,
      socials: introStore.form.socials,
      logoUrl: introStore.form.logoUrl,
      photoUrl: introStore.form.photoUrl,
      stack: introStore.form.stack,
      showContactForm: introStore.form.showContactForm,
    }, files);
    router.push("/admin-panel");
  } catch (error) {
    console.error("Error saving stack:", error);
  }
}
</script>
