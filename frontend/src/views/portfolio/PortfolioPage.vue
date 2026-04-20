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
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-xs="12" size-sm="8" size-lg="6">
            <ion-row>
              <ion-col
                v-for="(project, index) in projects"
                :key="index"
                size="4"
              >
                <ProjectCard :project="project" />
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-grid>
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
import type { ProjectItem } from "@/services/types";

const projectsController = new ProjectsController();
const projects = ref<ProjectItem[]>([]);

onMounted(async () => {
  await projectsController.loadProjects();
  projects.value = projectsController.getProjects();
});

const pageTitle = "Proyectos";
</script>

<style scoped>
.container {
  width: 60%;
}
</style>
