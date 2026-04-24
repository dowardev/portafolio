<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start" :mode="designMode">
          <ion-button @click="$router.back()">
            <ion-icon :icon="chevronBackOutline"> </ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-xs="12" size-lg="8">
            <ion-grid>
              <ion-row>
                <ion-col
                  v-for="experience in sortedExperiences"
                  :key="experience.title"
                  size-xs="12"
                  size-sm="6"
                  size-md="6"
                  size-lg="6"
                  size-xl="6"
                >
                  <ExperienceCard :experience="experience" />
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonRow, IonCol, IonGrid } from "@ionic/vue";
import { computed, ref, onMounted } from "vue";

import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";
import type { ExperienceItem } from "@/services/types";
import ExperienceController from "@/controllers/experienceController";
import ExperienceCard from "@/components/experience/ExperienceCard.vue";
import { chevronBackOutline } from "ionicons/icons";

const systemController = new SystemController();
const experienceController = new ExperienceController();

const designMode = ref<DesignMode>(systemController.getdesignMode());
const pageTitle = "Experiencia";
const experiences = ref<ExperienceItem[]>([]);

const sortedExperiences = computed(() => {
  return [...experiences.value];
});

onMounted(async () => {
  try {
    await experienceController.loadPublicExperiences();
    experiences.value = experienceController.getExperiences();
  } catch (error) {
    console.error("Error loading experience data:", error);
  }
});
</script>

<style scoped></style>
