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
import type { FreelancePlatform, FreelanceComment } from "@/services/types";
import { saveOutline } from "ionicons/icons";

const freelanceController = new FreelanceController();
const router = useRouter();

const freelanceData = ref<FreelancePlatform[]>([]);
const comments = ref<FreelanceComment[]>([]);
const saving = ref(false);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await freelanceController.loadFreelance();
    freelanceData.value = data.freelancePlatforms;
    comments.value = data.freelanceComments;
  } catch (error) {
    console.error("Error loading freelance:", error);
  } finally {
    loading.value = false;
  }
});

async function handleSave() {
  saving.value = true;
  try {
    await freelanceController.saveFreelance(freelanceData.value, comments.value);
    router.push("/admin-panel/freelance");
  } catch (error) {
    console.error("Error saving freelance:", error);
  } finally {
    saving.value = false;
  }
}
</script>
