<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Comentarios</ion-title>

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

          <ion-button color="primary" @click="createNewComment">
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

              <ion-breadcrumb>Comentarios</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="comments.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(item, index) in comments"
                    :key="index"
                    button
                    lines="full"
                    @click="editComment(index)"
                  >
                    <ion-thumbnail slot="start" class="placeholder-thumb">
                      <ion-icon :icon="chatbubblesOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ item.title || "Sin título" }}</h2>
                      <p v-if="item.rating" style="font-size: 12px">
                        {{ '★'.repeat(item.rating) }}
                      </p>
                      <p
                        v-if="item.text"
                        style="font-size: 12px; color: var(--ion-color-medium)"
                      >
                        {{ item.text.substring(0, 50) }}{{ item.text.length > 50 ? '...' : '' }}
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

      <template v-else>
        <div class="empty-state">
          <ion-icon :icon="chatbubblesOutline" class="empty-icon" />
          <p>No hay comentarios aún</p>
          <ion-button color="primary" @click="createNewComment">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Crear primer comentario
          </ion-button>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
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
  chatbubblesOutline,
  trashOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import FreelanceCommentController from "@/controllers/freelanceCommentController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import type { FreelanceComment } from "@/services/types";

const { guard } = usePermissionGuard();
const router = useRouter();
const freelanceCommentController = new FreelanceCommentController();

const isDev = import.meta.env.DEV;
const comments = ref<FreelanceComment[]>([]);

async function loadData() {
  const data = await freelanceCommentController.loadFreelanceComments();
  comments.value = data;
}

onMounted(loadData);

function editComment(index: number) {
  router.push(`/admin-panel/freelance-comments/edit/${index}`);
}

function createNewComment() {
  guard({ permission: 'freelance-comments.create' }).then(allowed => {
    if (allowed) router.push("/admin-panel/freelance-comments/new");
  });
}

async function confirmDelete(index: number) {
  if (!(await guard({ permission: 'freelance-comments.delete' }))) {
    return;
  }

  const comment = comments.value[index];
  if (!comment?.id) return;

  const alert = await alertController.create({
    header: "Eliminar comentario",
    message: `¿Estás seguro de eliminar "${comment.title || "este comentario"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteComment(comment.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteComment(id: string) {
  await freelanceCommentController.deleteFreelanceComment(Number(id));
  await loadData();
}

async function generateTestFreelance() {
  const testComments: FreelanceComment[] = Array.from({ length: 5 }, () => ({
    id: crypto.randomUUID(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    text: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }),
  }));

  for (const comment of testComments) {
    await freelanceCommentController.addFreelanceComment(comment);
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