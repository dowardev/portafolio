<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Experiencia</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isDev"
            v-tooltip="{
              content: 'Datos de prueba',
              delay: [500, 0],
              touch: 'hold',
            }"
            color="tertiary"
            @click="generateTestExperiences"
          >
            <ion-icon
              slot="start"
              :icon="bugOutline"
              color="warning"
            ></ion-icon>
          </ion-button>

          <ion-button color="primary" @click="createNewExperience">
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

              <ion-breadcrumb>Experiencia</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="experiences.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(experience, index) in experiences"
                    :key="index"
                    button
                    lines="full"
                    @click="editExperience(index)"
                  >
                    <ion-thumbnail v-if="experience.img" slot="start">
                      <ion-img :src="experience.img" />
                    </ion-thumbnail>

                    <ion-thumbnail
                      v-else
                      slot="start"
                      class="placeholder-thumb"
                    >
                      <ion-icon :icon="briefcaseOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ experience.title || "Sin título" }}</h2>
                      <p
                        style="font-size: 12px; color: var(--ion-color-medium)"
                      >
                        {{
                          formatExperienceDate(
                            experience.startDate,
                            experience.endDate,
                          )
                        }}
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
        <ion-icon :icon="briefcaseOutline" size="large" />

        <p>No hay experiencias aún</p>

        <ion-button @click="createNewExperience">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primera experiencia
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
  briefcaseOutline,
  trashOutline,
  bugOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ExperienceController from "@/controllers/experienceController";
import { storeToRefs } from "pinia";

const router = useRouter();
const experienceController = new ExperienceController();
const { experiences } = storeToRefs(experienceController.experienceStore);

const isDev = import.meta.env.DEV;

onMounted(async () => {
  await experienceController.loadPublicExperiences();
});

function editExperience(index: number) {
  router.push(`/admin-panel/experience/edit/${index}`);
}

function createNewExperience() {
  router.push("/admin-panel/experience/new");
}

async function confirmDelete(index: number) {
  const exp = experiences[index];
  if (!exp?.id) return;

  const alert = await alertController.create({
    header: "Eliminar experiencia",
    message: `¿Estás seguro de eliminar "${exp.title || "esta experiencia"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteExperience(exp.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteExperience(id: string) {
  await experienceController.deleteExperience(id);
}

function formatExperienceDate(start: string, end: string | undefined): string {
  if (!start) return "Sin fecha";
  try {
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) return start;
    const startFormatted = format(startDate, "dd/MM/yyyy", { locale: es });
    if (!end) return `${startFormatted} - Actual`;
    const endDate = new Date(end);
    if (isNaN(endDate.getTime())) return end;
    const endFormatted = format(endDate, "dd/MM/yyyy", { locale: es });
    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return start;
  }
}

async function generateTestExperiences() {
  const techs = ["React", "Vue", "Node", "Python", "TypeScript", "Go", "Rust"];

  const testExperiences = Array.from({ length: 3 }, () => {
    const techNames = faker.helpers.arrayElements(techs, { min: 2, max: 4 });
    return {
      id: crypto.randomUUID(),
      img: faker.image.url({ width: 100, height: 100 }),
      title: faker.company.name(),
      startDate: faker.date.past({ years: 2 }).toISOString(),
      endDate: faker.date.recent({ days: 100 }).toISOString(),
      technologies: techNames.map((name) => ({
        iconName: name.toLowerCase(),
      })),
      details: {
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
      },
    };
  });

  for (const exp of testExperiences) {
    await experienceController.addExperience(exp);
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

