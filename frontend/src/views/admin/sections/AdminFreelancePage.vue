<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Freelance</ion-title>

      <ion-buttons slot="end">
        <ion-button
          expand="block"
          :disabled="saving"
          class="ion-margin-top"
          @click="handleSave"
        >
          <ion-spinner
            v-if="saving"
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
          <FreelanceEditor
            v-model="freelanceData"
            @update:files="updateFreelanceFiles"
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
import FreelanceEditor from "../editors/FreelanceEditor.vue";
import FreelanceController from "@/controllers/freelanceController";
import { useFreelanceStore } from "@/store/freelanceStore";
import { saveOutline } from "ionicons/icons";

const freelanceController = new FreelanceController();
const freelanceStore = useFreelanceStore();
const router = useRouter();

const freelanceData = computed(() => freelanceStore.allFreelance);
const saving = computed(() => freelanceStore.saving);
const freelanceFiles = ref<Record<string, File>>({});

onMounted(async () => {
  try {
    await freelanceController.loadFreelance();
  } catch (error) {
    console.error("Error loading freelance:", error);
  }
});

function updateFreelanceFiles(fileMap: Record<string, File>) {
  Object.assign(freelanceFiles.value, fileMap);
}

async function handleSave() {
  freelanceStore.setSaving(true);
  try {
    const platforms = freelanceData.value.map((item: any) => ({
      name: item.name,
      image: item.image,
      url: item.url,
    }));
    const comments = freelanceData.value
      .filter((item: any) => item.comment)
      .map((item: any) => ({
        platformName: item.name,
        title: item.comment.title,
        text: item.comment.text,
        rating: item.comment.rating,
      }));
    await freelanceController.saveFreelance(platforms, comments, freelanceFiles.value);
    router.push("/admin-panel/freelance");
  } catch (error) {
    console.error("Error saving freelance:", error);
  } finally {
    freelanceStore.setSaving(false);
  }
}
</script>
