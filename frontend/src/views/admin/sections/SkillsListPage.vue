<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Skills</ion-title>

        <ion-buttons slot="end">
          <ion-button color="primary" @click="createNewStack">
            <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="6">
            <ion-breadcrumbs>
              <ion-breadcrumb>
                <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
              </ion-breadcrumb>
              <ion-breadcrumb>Skills</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else-if="stacks.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="8" size-lg="6">
              <ion-list>
                <ion-card v-for="(stack, index) in stacks" :key="stack.id || index" class="shadow1">
                  <ion-item
                    button
                    lines="full"
                    @click="editStack(stack)"
                  >
                    <template v-if="stack.iconName">
                      <div slot="start" class="stack-icon-wrapper">
                        <template v-if="isLineIconName(stack.iconName)">
                          <Lineicons
                            :icon="getIconComponent(stack.iconName)"
                            :color="getIconColor(stack.iconName)"
                            :size="28"
                          />
                        </template>
                        <ion-icon
                          v-else
                            :icon="getIconSvg(stack.iconName)"
                          :style="{ color: getIconColor(stack.iconName), fontSize: '28px' }"
                        />
                      </div>
                    </template>

                    <div slot="start" v-else class="stack-icon-placeholder">
                      <ion-icon :icon="codeSlashOutline" />
                    </div>

                    <ion-label>
                      <h2>{{ stack.name || "Sin nombre" }}</h2>
                      <p style="font-size: 12px; color: var(--ion-color-medium)">
                        {{ (stack.techs || []).length }} tecnologías
                      </p>
                    </ion-label>

                    <ion-buttons slot="end">
                      <ion-button
                        color="danger"
                        fill="clear"
                        @click.stop="confirmDelete(stack)"
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
        <ion-icon :icon="codeSlashOutline" size="large" />
        <p>No hay stacks aún</p>
        <ion-button @click="createNewStack">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primer stack
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import {
  addOutline,
  codeSlashOutline,
  trashOutline,
} from "ionicons/icons";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import {
  getIconByName,
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/composables/iconsIndex";
import StackController from "@/controllers/stackController";
import type { StackItem } from "@/services/types";

const stackController = new StackController();
const router = useRouter();

const loading = ref(true);
const stacks = ref<StackItem[]>([]);

onMounted(async () => {
  try {
    const data = await stackController.loadStack();
    stacks.value = data || [];
  } catch (error) {
    console.error("Error loading stacks:", error);
  } finally {
    loading.value = false;
  }
});

function createNewStack() {
  router.push("/admin-panel/skills/new");
}

function editStack(stack: StackItem) {
  router.push(`/admin-panel/skills/edit/${stack.id}`);
}

async function confirmDelete(stack: StackItem) {
  const alert = await alertController.create({
    header: "Eliminar stack",
    message: `¿Estás seguro de eliminar "${stack.name}"? Las tecnologías asociadas también se eliminarán.`,
    buttons: [
      { text: "Cancelar", role: "cancel" },
      {
        text: "Eliminar",
        role: "destructive",
        handler: async () => {
          try {
            await stackController.deleteStack(stack.id!);
            stacks.value = stacks.value.filter((s) => s.id !== stack.id);
          } catch (error) {
            console.error("Error deleting stack:", error);
          }
        },
      },
    ],
  });
  await alert.present();
}

function isLineIconName(name: string): boolean {
  return isLineIcon(name);
}

function getIconSvg(name: string): string | undefined {
  return getIonIconSvg(name);
}

function getIconComponent(name: string): object | undefined {
  return getLineIconComponent(name);
}

function getIconColor(name: string): string {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--ion-color-medium);
  gap: 16px;
}

.stack-icon-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stack-icon-placeholder {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ion-color-medium);
  font-size: 28px;
}
</style>
