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

import HomeEditorController from "@/controllers/homeEditorController";
import ProjectsController from "@/controllers/projectsController";
import ExperienceController from "@/controllers/experienceController";
import FreelanceController from "@/controllers/freelanceController";
import type { HomePageData, FreelanceItem } from "@/services/types";

const templateData = reactive<Partial<HomePageData>>({});
const homeEditorController = new HomeEditorController();
const projectsController = new ProjectsController();
const experienceController = new ExperienceController();
const freelanceController = new FreelanceController();

function convertToPlatforms(freelance: FreelanceItem[]) {
  return freelance.map(item => ({
    name: item.name,
    image: item.image,
    url: item.url,
  }));
}

function convertToComments(freelance: FreelanceItem[]) {
  const comments: any[] = [];
  for (const item of freelance) {
    if (item.comment) {
      comments.push({
        platformName: item.name,
        title: item.comment.title,
        text: item.comment.text,
        rating: item.comment.rating,
      });
    }
  }
  return comments;
}

onMounted(async () => {
  try {
    const data = await homeEditorController.loadPublicData();
    const freelanceData = await freelanceController.loadFreelance();
    console.log("Freelance data from controller:", freelanceData);
    await projectsController.loadPublicProjects();
    await experienceController.loadPublicExperiences();
    data.projects = projectsController.getProjects();
    data.experience = experienceController.getExperiences();

    templateData.freelancePlatforms = freelanceData.freelancePlatforms || [];
    templateData.freelanceComments = freelanceData.freelanceComments || [];
    console.log("Converted platforms:", templateData.freelancePlatforms);
    console.log("Converted comments:", templateData.freelanceComments);

    Object.assign(templateData, data);
  } catch (error) {
    console.error("Error loading template data:", error);
  }
});
</script>