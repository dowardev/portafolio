<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Freelance</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isDev"
            v-tooltip="{
              content: 'Datos de prueba',
              delay: [500, 0],
              touch: 'hold',
            }"
            color="tertiary"
            @click="generateTestFreelance"
          >
            <ion-icon
              slot="start"
              :icon="bugOutline"
              color="warning"
            ></ion-icon>
          </ion-button>

          <ion-button id="add-freelance-popover" color="primary">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
          </ion-button>

          <ion-popover
            trigger="add-freelance-popover"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-list>
                <ion-item
                  button
                  @click="createNewFreelance('platform')"
                >
                  <ion-icon slot="start" :icon="briefcaseOutline" />
                  <ion-label>Nueva Plataforma</ion-label>
                </ion-item>

                <ion-item
                  button
                  @click="createNewFreelance('comment')"
                >
                  <ion-icon slot="start" :icon="chatbubblesOutline" />
                  <ion-label>Nuevo Comentario</ion-label>
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>
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

              <ion-breadcrumb>Freelance</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-grid>
        <ion-row>
          <ion-col size-md="6">
            <div class="section-header">
              <h3>Plataformas</h3>
            </div>

            <template v-if="platforms.length > 0">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(item, index) in platforms"
                    :key="index"
                    button
                    lines="full"
                    @click="editFreelance('platform', index)"
                  >
                    <ion-thumbnail v-if="item.image" slot="start">
                      <ion-img :src="item.image" />
                    </ion-thumbnail>

                    <ion-thumbnail
                      v-else
                      slot="start"
                      class="placeholder-thumb"
                    >
                      <ion-icon :icon="briefcaseOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ item.name || "Sin nombre" }}</h2>
                    </ion-label>

                    <ion-buttons slot="end">
                      <ion-button
                        color="danger"
                        fill="clear"
                        @click.stop="confirmDelete('platform', index)"
                      >
                        <ion-icon :icon="trashOutline" />
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-card>
              </ion-list>
            </template>

            <div v-else class="empty-state">
              <ion-icon :icon="briefcaseOutline" size="large" />
              <p>No hay plataformas aún</p>
              <ion-button @click="createNewFreelance('platform')">
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Crear plataforma
              </ion-button>
            </div>
          </ion-col>

          <ion-col size-md="6">
            <div class="section-header">
              <h3>Comentarios</h3>
            </div>

            <template v-if="comments.length > 0">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(item, index) in comments"
                    :key="index"
                    button
                    lines="full"
                    @click="editFreelance('comment', index)"
                  >
                    <ion-thumbnail slot="start">
                      <ion-icon :icon="chatbubblesOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ item.title || "Sin título" }}</h2>
                      <p style="font-size: 12px; color: var(--ion-color-medium)">
                        {{ item.platformName || "Sin plataforma" }}
                      </p>
                      <div v-if="item.rating" class="rating-stars">
                        <ion-icon
                          v-for="n in item.rating"
                          :key="n"
                          :icon="starOutline"
                          style="color: gold; font-size: 14px"
                        />
                      </div>
                    </ion-label>

                    <ion-buttons slot="end">
                      <ion-button
                        color="danger"
                        fill="clear"
                        @click.stop="confirmDelete('comment', index)"
                      >
                        <ion-icon :icon="trashOutline" />
                      </ion-button>
                    </ion-buttons>
                  </ion-item>
                </ion-card>
              </ion-list>
            </template>

            <div v-else class="empty-state">
              <ion-icon :icon="chatbubblesOutline" size="large" />
              <p>No hay comentarios aún</p>
              <ion-button @click="createNewFreelance('comment')">
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Crear comentario
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonPopover,
  IonCard,
  alertController,
} from "@ionic/vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  addOutline,
  bugOutline,
  briefcaseOutline,
  trashOutline,
  chatbubblesOutline,
  starOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import { useFreelanceStore } from "@/store/freelanceStore";
import FreelanceController from "@/controllers/freelanceController";

const router = useRouter();
const freelanceStore = useFreelanceStore();
const freelanceController = new FreelanceController();

const isDev = import.meta.env.DEV;

const platforms = computed(() => freelanceStore.platforms);
const comments = computed(() => freelanceStore.comments);

onMounted(async () => {
  freelanceStore.setLoading(true);
  try {
    const data = await freelanceController.loadFreelance();
    freelanceStore.setPlatforms(data.freelancePlatforms);
    freelanceStore.setComments(data.freelanceComments);
  } finally {
    freelanceStore.setLoading(false);
  }
});

function editFreelance(type: "platform" | "comment", index: number) {
  router.push(`/admin-panel/freelance/${type}/edit/${index}`);
}

function createNewFreelance(type: "platform" | "comment") {
  router.push(`/admin-panel/freelance/${type}/new`);
}

async function confirmDelete(type: "platform" | "comment", index: number) {
  const itemType = type === "platform" ? "plataforma" : "comentario";
  const item = type === "platform"
    ? platforms.value[index]
    : comments.value[index];
  const itemName = type === "platform"
    ? (item as any).name || "esta plataforma"
    : (item as any).title || "este comentario";

  const alert = await alertController.create({
    header: `Eliminar ${itemType}`,
    message: `¿Estás seguro de eliminar "${itemName}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteFreelance(type, index);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteFreelance(type: "platform" | "comment", index: number) {
  if (type === "platform") {
    freelanceStore.deletePlatform(index);
  } else {
    freelanceStore.deleteComment(index);
  }
  await freelanceController.saveFreelance(
    freelanceStore.platforms,
    freelanceStore.comments,
  );
}

async function generateTestFreelance() {
  const platformNames = ["Upwork", "Fiverr", "Toptal", "Freelancer.com"];

  const testPlatforms = Array.from({ length: 3 }, () => {
    const platformName = faker.helpers.arrayElement(platformNames);
    return {
      name: platformName,
      image: faker.image.url({ width: 100, height: 100 }),
      url: faker.internet.url(),
    };
  });

  for (const platform of testPlatforms) {
    freelanceStore.addPlatform(platform);
  }

  const testComments = Array.from({ length: 3 }, () => {
    const platformName = faker.helpers.arrayElement(platformNames);
    return {
      platformName,
      title: faker.person.fullName(),
      text: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 3, max: 5 }),
    };
  });

  for (const comment of testComments) {
    freelanceStore.addComment(comment);
  }

  await freelanceController.saveFreelance(
    freelanceStore.platforms,
    freelanceStore.comments,
  );
}
</script>

<style scoped>
.section-header {
  padding: 16px 0;
  text-align: center;
}

.section-header h3 {
  margin: 0;
  color: var(--ion-color-primary);
}

.placeholder-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
}

.rating-stars {
  display: flex;
  gap: 2px;
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