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

import IntroController from "@/controllers/introController";
import ProjectsController from "@/controllers/projectsController";
import ExperienceController from "@/controllers/experienceController";
import FreelanceController from "@/controllers/freelanceController";
import type { HomePageData } from "@/services/types";

const templateData = reactive<Partial<HomePageData>>({});
const introController = new IntroController();
const projectsController = new ProjectsController();
const experienceController = new ExperienceController();
const freelanceController = new FreelanceController();

onMounted(async () => {
  try {
    const [introData, freelanceData] = await Promise.all([
      introController.loadIntro(),
      freelanceController.loadFreelance(),
    ]);

    const [projects, experiences] = await Promise.all([
      projectsController.loadPublicProjects(),
      experienceController.loadPublicExperiences(),
    ]);

    Object.assign(templateData, {
      name: introData.name,
      tags: introData.tags,
      description: introData.description,
      socials: introData.socials,
      logoUrl: introData.logoUrl,
      photoUrl: introData.photoUrl,
      stack: introData.stack,
      showContactForm: introData.showContactForm,
      projects,
      experience: experiences,
      freelance: freelanceData.freelance,
      freelancePlatforms: freelanceData.freelancePlatforms,
      freelanceComments: freelanceData.freelanceComments,
    });
  } catch (error) {
    console.error("Error loading template data:", error);
  }
});
</script>