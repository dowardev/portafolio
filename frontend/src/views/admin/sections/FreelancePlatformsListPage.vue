<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Plataformas</ion-title>

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

          <ion-button color="primary" @click="createNewPlatform">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <AdminBreadcrumbs
        :items="[
          { label: 'Panel', to: { name: 'PanelAdminPage' } },
          { label: 'Plataformas' },
        ]"
      />

      <template v-if="platforms.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(item, index) in platforms"
                    :key="index"
                    button
                    lines="full"
                    @click="editPlatform(index)"
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
                      <h2>{{ item.name || "Sin título" }}</h2>
                      <p style="font-size: 12px">{{ item.url || "Sin URL" }}</p>
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

      <template v-else>
        <div class="empty-state">
          <ion-icon :icon="briefcaseOutline" class="empty-icon" />
          <p>No hay plataformas aún</p>
          <ion-button color="primary" @click="createNewPlatform">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Crear primera plataforma
          </ion-button>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  addOutline,
  bugOutline,
  briefcaseOutline,
  trashOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import FreelancePlatformController from "@/controllers/freelancePlatformController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs.vue";
import type { FreelancePlatform } from "@/services/types";

const { guard } = usePermissionGuard();
const router = useRouter();
const freelancePlatformController = new FreelancePlatformController();

const isDev = import.meta.env.DEV;
const platforms = ref<FreelancePlatform[]>([]);

async function loadData() {
  const data = await freelancePlatformController.loadFreelancePlatforms();
  platforms.value = data;
}

onMounted(loadData);

function editPlatform(index: number) {
  router.push(`/admin-panel/freelance-platform/edit/${index}`);
}

function createNewPlatform() {
  guard({ permission: 'freelance.create' }).then(allowed => {
    if (allowed) router.push("/admin-panel/freelance-platform/new");
  });
}

async function confirmDelete(index: number) {
  if (!(await guard({ permission: 'freelance.delete' }))) {
    return;
  }

  const platform = platforms.value[index];
  if (!platform?.id) return;

  const alert = await alertController.create({
    header: "Eliminar plataforma",
    message: `¿Estás seguro de eliminar "${platform.name || "esta plataforma"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deletePlatform(platform.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deletePlatform(id: string) {
  await freelancePlatformController.deleteFreelancePlatform(Number(id));
  await loadData();
}

async function generateTestFreelance() {
  const testPlatforms: FreelancePlatform[] = Array.from({ length: 5 }, () => ({
    id: crypto.randomUUID(),
    name: faker.company.name(),
    image: faker.image.url({ width: 100, height: 100 }),
    url: faker.internet.url(),
  }));

  for (const platform of testPlatforms) {
    await freelancePlatformController.addFreelancePlatform(platform);
  }

  await loadData();
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.placeholder-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
  min-width: 40px;
  min-height: 40px;
}

.placeholder-thumb ion-icon {
  font-size: 20px;
  color: var(--ion-color-medium);
}
</style>