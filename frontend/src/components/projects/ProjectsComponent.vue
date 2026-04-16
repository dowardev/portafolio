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
import { computed, ref, onMounted } from "vue";
import homeApi, { type ProjectItem } from "@/services/homeApi";
import ProjectCard from "./ProjectCard.vue";

withDefaults(
  defineProps<{
    filter?: "all" | "personal" | "professional";
  }>(),
  {
    filter: "all",
  },
);

const projects = ref<ProjectItem[]>([]);

const filteredProjects = computed(() => {
  return projects.value;
});

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    projects.value = data.projects || [];
  } catch (error) {
    console.error("Error loading projects data:", error);
  }
});
</script>

<style scoped>
</style>
