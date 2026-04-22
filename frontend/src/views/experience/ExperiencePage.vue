<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar class="container-page">
        <ion-buttons slot="start" :mode="designMode">
          <ion-menu-button menu="mainMenu" :mode="designMode"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-row class="ion-justify-content-center">
        <ion-col size="12">
          <ion-row>
            <ion-col
              v-for="experience in sortedExperiences"
              :key="experience.title"
              size="12"
              size-lg="4"
            >
              <ExperienceCard :experience="experience" />
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";
import { computed, ref, onMounted } from "vue";

import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";
import type { ExperienceItem } from "@/services/types";
import ExperienceController from "@/controllers/experienceController";
import ExperienceCard from "@/components/experience/ExperienceCard.vue";

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
