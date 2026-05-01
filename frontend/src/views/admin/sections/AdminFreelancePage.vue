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
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import FreelanceEditor from "../editors/FreelanceEditor.vue";
import FreelancePlatformController from "@/controllers/freelancePlatformController";
import FreelanceCommentController from "@/controllers/freelanceCommentController";
import type { FreelancePlatform, FreelanceComment } from "@/services/types";
import { saveOutline } from "ionicons/icons";

const freelancePlatformController = new FreelancePlatformController();
const freelanceCommentController = new FreelanceCommentController();
const router = useRouter();

const freelanceData = ref<FreelancePlatform[]>([]);
const comments = ref<FreelanceComment[]>([]);
const saving = ref(false);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const [platforms, commentsData] = await Promise.all([
      freelancePlatformController.loadFreelancePlatforms(),
      freelanceCommentController.loadFreelanceComments(),
    ]);
    freelanceData.value = platforms;
    comments.value = commentsData;
  } catch (error) {
    console.error("Error loading freelance:", error);
  } finally {
    loading.value = false;
  }
});

async function handleSave() {
  saving.value = true;
  try {
    for (const platform of freelanceData.value) {
      if (platform.id) {
        await freelancePlatformController.updateFreelancePlatform(Number(platform.id), platform);
      } else {
        await freelancePlatformController.addFreelancePlatform(platform);
      }
    }
    for (const comment of comments.value) {
      if (comment.id) {
        await freelanceCommentController.updateFreelanceComment(Number(comment.id), comment);
      } else {
        await freelanceCommentController.addFreelanceComment(comment);
      }
    }
    router.push("/admin-panel/freelance");
  } catch (error) {
    console.error("Error saving freelance:", error);
  } finally {
    saving.value = false;
  }
}
</script>
