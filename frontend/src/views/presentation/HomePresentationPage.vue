<template>
  <HomeTemplate :template="currentTemplate" :data="templateData" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import HomeTemplate from "@/components/templates/home/HomeTemplate.vue";
import { getTemplate } from "@/components/templates/home/templates";
import { type HomeTemplateData } from "@/utils/types/homeTemplate";

import homeApi from "@/services/homeApi";

const currentTemplate = ref(getTemplate("default"));

const templateData = ref<HomeTemplateData>({});

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    templateData.value = {
      stack: data.stack || [],
      skillCategories: data.skillCategories || [],
      experience: data.experience || [],
      projects: data.projects || [],
      certificates: data.certificates || [],
      freelance: data.freelance || [],
      showContactForm: data.showContactForm || {
        socials: false,
        freelance: false,
      },
    };
  } catch (error) {
    console.error("Error loading template data:", error);
  }
});
</script>

