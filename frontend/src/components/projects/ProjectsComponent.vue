<template>
  <ion-row>
    <ion-col
      v-for="(project, index) in filteredProjects"
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
            <ion-text
              :color="
                project.status === 'finished'
                  ? 'success'
                  : project.status === 'indeterminate'
                    ? 'warning'
                    : project.status === 'progress'
                      ? 'primary'
                      : ''
              "
            >
              {{
                project.status === "progress"
                  ? "En progreso"
                  : project.status === "indeterminate"
                    ? "Indeterminado"
                    : "Terminado"
              }}
            </ion-text>
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
                <img
                  v-if="tech.type === 'img'"
                  :src="tech.source"
                  :alt="tech.name"
                  :style="{ width: tech.size }"
                />
                <ion-icon
                  v-if="tech.type === 'icon'"
                  :style="{
                    fontSize: tech.size,
                    color: getIconColorByName(tech.name),
                  }"
                  :icon="getIconByName(tech.source)"
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
  IonText,
  IonIcon,
} from "@ionic/vue";
import { computed, ref, watch, onMounted } from "vue";
import * as ionicons from "ionicons/icons";
import homeApi, { type ProjectItem } from "@/services/homeApi";
import ProjectDetailModal from "./ProjectDetailModal.vue";

const props = withDefaults(
  defineProps<{
    filter?: "all" | "personal" | "professional";
  }>(),
  {
    filter: "all",
  },
);

const projects = ref<ProjectItem[]>([]);
const modalOpen = ref(false);
const selectedProject = ref<ProjectItem | null>(null);

const filteredProjects = computed(() => {
  return projects.value;
});

watch(
  () => props.filter,
  (newValue) => {
    // Future: implement filtering by category if needed
  },
);

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    projects.value = data.projects || [];
  } catch (error) {
    console.error("Error loading projects data:", error);
  }
});

function openProjectDetail(project: ProjectItem) {
  selectedProject.value = project;
  modalOpen.value = true;
}

function getIconByName(source: string) {
  if (!source) return ionicons.helpCircleOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
}

function getIconColorByName(name: string) {
  const colors: { [key: string]: string } = {
    Ionic: "#3356c7",
    Vue: "#41b883",
    Laravel: "#ff2819",
    Firebase: "#ffca28",
    Capacitorjs: "#119eff",
    Electronjs: "#47848f",
    Web: "#3356c7",
    Linux: "#000000",
    PWA: "#5905c8",
    Android: "#44ac5a",
    Windows: "#0078d4",
  };
  return colors[name] || "";
}
</script>

<style scoped>
</style>
