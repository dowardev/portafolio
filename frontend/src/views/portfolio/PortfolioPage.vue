<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar class="container-page">
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-row
        class="ion-justify-content-center"
        style="display: flex; overflow: auto; max-height: calc(100% - 8dvh)"
      >
        <ion-col size-xs="12" size-sm="8" size-lg="6">
          <ProjectCard v-if="project" :project="project" />
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonCol,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ref, onMounted } from "vue";

import ProjectCard from "@/components/projects/ProjectCard.vue";
import ProjectsController from "@/controllers/projectsController";
import type { ProjectItem } from "@/services/homeApi";

const projectsController = new ProjectsController();
const project = ref<ProjectItem | null>(null);

onMounted(async () => {
  await projectsController.loadProjects();
  project.value = projectsController.getProject(0) ?? null;
});

const pageTitle = "Proyectos";
</script>

<style scoped>
.container {
  width: 60%;
}
</style>
