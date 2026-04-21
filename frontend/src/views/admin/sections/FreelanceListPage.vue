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

          <ion-button color="primary" @click="createNewFreelance">
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

              <ion-breadcrumb>Freelance</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="freelanceItems.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(item, index) in freelanceItems"
                    :key="index"
                    button
                    lines="full"
                    @click="editFreelance(index)"
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

                      <p
                        v-if="item.comment"
                        style="font-size: 12px"
                        class="comment-indicator"
                      >
                        <ion-icon :icon="chatbubblesOutline" size="small" />
                        {{ item.comment.title || "Sin comentario" }}
                      </p>
                      <p
                        v-else
                        style="font-size: 12px; color: var(--ion-color-medium)"
                      >
                        Sin comentario
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

        <p>No hay plataformas freelance aún</p>

        <ion-button @click="createNewFreelance">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primera plataforma
        </ion-button>
      </div>
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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
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
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import { useFreelanceStore } from "@/store/freelanceStore";
import FreelanceController from "@/controllers/freelanceController";

const router = useRouter();
const freelanceStore = useFreelanceStore();
const freelanceController = new FreelanceController();

const isDev = import.meta.env.DEV;

const freelanceItems = computed(() => freelanceStore.freelance);

onMounted(async () => {
  freelanceStore.setLoading(true);
  try {
    const data = await freelanceController.loadFreelance();
    freelanceStore.setFreelance(data);
  } finally {
    freelanceStore.setLoading(false);
  }
});

function editFreelance(index: number) {
  router.push(`/admin-panel/freelance/edit/${index}`);
}

function createNewFreelance() {
  router.push("/admin-panel/freelance/new");
}

async function confirmDelete(index: number) {
  const alert = await alertController.create({
    header: "Eliminar plataforma",
    message: `¿Estás seguro de eliminar "${freelanceItems.value[index].name || "esta plataforma"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteFreelance(index);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteFreelance(index: number) {
  freelanceStore.deleteFreelanceItem(index);
  await freelanceController.saveFreelance(freelanceStore.freelance);
}

async function generateTestFreelance() {
  const platforms = ["Upwork", "Fiverr", "Toptal", "Freelancer.com"];

  const testItems = Array.from({ length: 3 }, () => {
    const platformName = faker.helpers.arrayElement(platforms);
    return {
      name: platformName,
      image: faker.image.url({ width: 100, height: 100 }),
      url: faker.internet.url(),
      comment: {
        title: faker.person.fullName(),
        text: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 3, max: 5 }),
      },
    };
  });

  for (const item of testItems) {
    freelanceStore.addFreelanceItem(item);
  }

  await freelanceController.saveFreelance(freelanceStore.freelance);
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

.comment-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ion-color-primary);
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