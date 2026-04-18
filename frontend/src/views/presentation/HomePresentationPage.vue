<template>
  <!-- Elegir uno de los dos: -->

  <!-- Template 1: Scroll vertical -->
  <!-- <HomeTemplate1 v-bind="templateData" /> -->

  <!-- Template 2: Grid (descomentar para usar) -->
  <HomeTemplate2 v-bind="templateData" />
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import HomeTemplate1 from "@/templates/HomeTemplate1.vue";
import HomeTemplate2 from "@/templates/HomeTemplate2.vue";

import homeApi from "@/services/homeApi";
import ProjectsController from "@/controllers/projectsController";
import ExperienceController from "@/controllers/experienceController";
import type { HomePageData } from "@/services/homeApi";

const templateData = reactive<Partial<HomePageData>>({});
const projectsController = new ProjectsController();
const experienceController = new ExperienceController();

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    await projectsController.loadProjects();
    await experienceController.loadExperiences();
    data.projects = projectsController.getProjects();
    data.experience = experienceController.getExperiences();
    Object.assign(templateData, data);
  } catch (error) {
    console.error("Error loading template data:", error);
  }
});
</script>
