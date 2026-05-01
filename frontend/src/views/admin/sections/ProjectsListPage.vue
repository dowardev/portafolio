<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Proyectos</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isDev"
            v-tooltip="{
              content: 'Datos de prueba',
              delay: [500, 0],
              touch: 'hold',
            }"
            color="tertiary"
            @click="generateTestProjects"
          >
            <ion-icon
              slot="start"
              :icon="bugOutline"
              color="warning"
            ></ion-icon>
          </ion-button>

          <ion-button color="primary" @click="createNewProject">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="4">
            <ion-breadcrumbs>
              <ion-breadcrumb>
                <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
              </ion-breadcrumb>

              <ion-breadcrumb>Proyectos</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="projects.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(project, index) in projects"
                    :key="index"
                    button
                    lines="full"
                    @click="editProject(index)"
                  >
                    <ion-thumbnail v-if="project.img" slot="start">
                      <ion-img :src="project.img" />
                    </ion-thumbnail>

                    <ion-thumbnail
                      v-else
                      slot="start"
                      class="placeholder-thumb"
                    >
                      <ion-icon :icon="folderOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ project.title || "Sin título" }}</h2>

                      <p
                        style="font-size: 12px"
                        class="status-chip"
                        :class="getProjectStatus(project)"
                      >
                        {{ getProjectStatusLabel(project) }}
                      </p>
                    </ion-label>

                    <ion-buttons slot="end">
                      <ion-button
                        color="danger"
                        fill="clear"
                        @click.stop="confirmDelete(index)"
                      >
                        <ion-icon :icon="trashOutline" />
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-card>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>

      <div v-else class="empty-state">
        <ion-icon :icon="folderOutline" size="large" />

        <p>No hay proyectos aún</p>

        <ion-button @click="createNewProject">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primer proyecto
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  addOutline,
  bugOutline,
  folderOutline,
  trashOutline,
  warningOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import ProjectsController from "@/controllers/projectsController";
import { storeToRefs } from "pinia";
import type { ProjectItem } from "@/services/types";

const router = useRouter();
const projectsController = new ProjectsController();
const { projects, loading: projectsLoading } = storeToRefs(projectsController.projectsStore);

const isDev = import.meta.env.DEV;

onMounted(async () => {
  await projectsController.loadPublicProjects();
});

function getProjectStatus(project: ProjectItem): string {
  return project.endDate ? "finished" : "progress";
}

function getProjectStatusLabel(project: ProjectItem): string {
  return project.endDate ? "Terminado" : "En progreso";
}

function editProject(index: number) {
  router.push(`/admin-panel/projects/edit/${index}`);
}

function createNewProject() {
  router.push("/admin-panel/projects/new");
}

async function confirmDelete(index: number) {
  const project = projects[index];
  if (!project?.id) return;

  const alert = await alertController.create({
    header: "Eliminar proyecto",
    message: `¿Estás seguro de eliminar "${project.title || "este proyecto"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteProject(project.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteProject(id: string) {
  await projectsController.deleteProject(id);
}

async function generateTestProjects() {
  const statuses = ["progress", "indeterminate", "finished"] as const;
  const techs = ["React", "Vue", "Node", "Python", "TypeScript", "Go", "Rust"];

  const testProjects = Array.from({ length: 5 }, () => {
    const techNames = faker.helpers.arrayElements(techs, { min: 1, max: 3 });
    return {
      id: crypto.randomUUID(),
      img: faker.image.url({ width: 300, height: 200 }),
      title: faker.word.noun(),
      date: faker.date.past().toISOString(),
      status: faker.helpers.arrayElement(statuses),
      technologies: techNames.map((name) => ({
        iconName: name.toLowerCase(),
      })),
      source: {
        img: faker.image.url({ width: 50, height: 50 }),
        name: "GitHub",
        url: faker.internet.url(),
      },
      details: {
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
      },
    };
  });

  for (const project of testProjects) {
    await projectsController.addProject(project);
  }
}
</script>

<style scoped>
.placeholder-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
}

.status-chip.progress {
  color: var(--ion-color-warning-shade);
}

.status-chip.indeterminate {
  color: var(--ion-color-medium-shade);
}

.status-chip.finished {
  color: var(--ion-color-success-shade);
}

.techs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--ion-color-medium);
}
</style>
