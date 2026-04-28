<template>
  <!-- Elegir uno de los dos: -->

  <!-- Template 1: Scroll vertical -->
  <!-- <HomeTemplate1 v-bind="templateData" /> -->

  <!-- Template 2: Grid (descomentar para usar) -->
  <HomeTemplate2 v-bind="templateData" />
</template>

<script setup lang="ts">
import { reactive, onMounted, onActivated } from "vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HomeTemplate1 from "@/templates/HomeTemplate1.vue";
import HomeTemplate2 from "@/templates/HomeTemplate2.vue";

import IntroController from "@/controllers/introController";
import ProjectsController from "@/controllers/projectsController";
import ExperienceController from "@/controllers/experienceController";
import FreelanceController from "@/controllers/freelanceController";
import SkillsCategoriesController from "@/controllers/skillsCategoriesController";
import type { HomePageData } from "@/services/types";

const templateData = reactive<Partial<HomePageData>>({});
const introController = new IntroController();
const projectsController = new ProjectsController();
const experienceController = new ExperienceController();
const freelanceController = new FreelanceController();
const skillsCategoriesController = new SkillsCategoriesController();
const skillCategories = skillsCategoriesController.skillsCategories;

async function loadData() {
  try {
    const [introData, freelancePlatforms] = await Promise.all([
      introController.loadIntro(),
      freelanceController.loadFreelance(),
    ]);

    const freelanceComments = freelanceController.getComments();

    await skillsCategoriesController.loadSkillsCategories();

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
      freelance: freelancePlatforms,
      freelancePlatforms: freelancePlatforms,
      freelanceComments: freelanceComments,
      skillCategories: skillCategories.value,
    });
  } catch (error) {
    console.error("Error loading template data:", error);
  }
}

onMounted(loadData);
onActivated(() => skillsCategoriesController.reloadSkillsCategories());
</script>