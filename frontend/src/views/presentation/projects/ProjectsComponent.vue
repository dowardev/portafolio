<template>
  <ion-row style="overflow: auto; max-height: calc(100% - 8dvh)">
    <ion-col
      v-for="(project, index) in projects"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card
        class="shadow-1"
        style="cursor: pointer"
        @click="openProjectDetail(project)"
      >
        <ion-card-header>
          <div style="display: flex; justify-content: space-between">
            <img :src="project.img" alt="" style="height: 45px" />
          </div>

          <ion-card-title>{{ project.title }}</ion-card-title>
          <ion-card-subtitle>
            {{
              project.status === "progress"
                ? "En progreso"
                : project.status === "indeterminate"
                  ? "Indeterminado"
                  : "Terminado"
            }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-row>
            <ion-col size="10" style="display: flex">
              <div
                v-for="(tech, techIndex) in project.technologies"
                :key="techIndex"
                style="display: flex; align-items: center; margin-right: 10px"
              >
                <ion-icon
                  :style="{
                    fontSize: '24px',
                    color: getIconColor(tech.iconName),
                  }"
                  :icon="getIconByName(tech.iconName)"
                ></ion-icon>
              </div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>

  <ProjectDetailModal
    :is-open="modalOpen"
    :project="selectedProject"
    @close="modalOpen = false"
  />
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import * as ionicons from "ionicons/icons";
import type { ProjectItem } from "@/services/types";
import ProjectsController from "@/controllers/projectsController";
import ProjectDetailModal from "@/components/projects/ProjectDetailModal.vue";
import { useIconColors } from "@/composables/useIconColors";

const { getIconColor } = useIconColors();
const projectsController = new ProjectsController();

const projects = ref<ProjectItem[]>([]);
const modalOpen = ref(false);
const selectedProject = ref<ProjectItem | null>(null);

onMounted(async () => {
  try {
    await projectsController.loadPublicProjects();
    projects.value = projectsController.getProjects();
  } catch (error) {
    console.error("Error loading projects data:", error);
  }
});

function openProjectDetail(project: ProjectItem) {
  selectedProject.value = project;
  modalOpen.value = true;
}

function getIconByName(source: string) {
  if (!source) return ionicons.linkOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.linkOutline;
}
</script>
