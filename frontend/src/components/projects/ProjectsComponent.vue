<template>
  <ion-row>
    <ion-col
      v-for="(project, index) in filteredProjects"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ProjectCard :project="project" />
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonRow, IonCol } from "@ionic/vue";
import { computed } from "vue";
import ProjectsController from "@/controllers/projectsController";
import ProjectCard from "./ProjectCard.vue";

withDefaults(
  defineProps<{
    filter?: "all" | "personal" | "professional";
  }>(),
  {
    filter: "all",
  },
);

const projectsController = new ProjectsController();
projectsController.loadProjects();

const filteredProjects = computed(() => {
  return projectsController.getProjects();
});
</script>

<style scoped>
</style>
