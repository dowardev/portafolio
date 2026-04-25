<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Categorías</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isDev"
            v-tooltip="{
              content: 'Datos de prueba',
              delay: [500, 0],
              touch: 'hold',
            }"
            color="tertiary"
            @click="generateTestCategories"
          >
            <ion-icon
              slot="start"
              :icon="bugOutline"
              color="warning"
            ></ion-icon>
          </ion-button>

          <ion-button color="primary" @click="createNewCategory">
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

              <ion-breadcrumb>Categorías</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
        </ion-row>
      </ion-grid>

      <template v-if="skillCategories.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-card class="shadow1">
                  <ion-item
                    v-for="(category, index) in skillCategories"
                    :key="index"
                    button
                    lines="full"
                    @click="editCategory(index)"
                  >
                    <ion-thumbnail slot="start" class="placeholder-thumb">
                      <ion-icon :icon="codeSlashOutline" />
                    </ion-thumbnail>

                    <ion-label>
                      <h2>{{ category.name || "Sin título" }}</h2>

                      <p
                        style="font-size: 12px; color: var(--ion-color-medium)"
                      >
                        {{ category.technologies?.length || 0 }} tecnologías
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
        <ion-icon :icon="codeSlashOutline" size="large" />

        <p>No hay categorías aún</p>

        <ion-button @click="createNewCategory">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primera categoría
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
  IonCard,
  alertController,
} from "@ionic/vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  addOutline,
  codeSlashOutline,
  trashOutline,
  bugOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import CategoriesController from "@/controllers/categoriesController";

const router = useRouter();
const categoriesController = new CategoriesController();

const isDev = import.meta.env.DEV;

const skillCategories = computed(() => categoriesController.getSkillCategories());

onMounted(async () => {
  await categoriesController.loadCategories();
});

function editCategory(index: number) {
  router.push(`/admin-panel/categories/edit/${index}`);
}

function createNewCategory() {
  router.push("/admin-panel/categories/new");
}

async function confirmDelete(index: number) {
  const category = skillCategories.value[index];
  if (!category?.id) return;

  const alert = await alertController.create({
    header: "Eliminar categoría",
    message: `¿Estás seguro de eliminar "${category.name || "esta categoría"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteCategory(category.id);
        },
      },
    ],
  });
  await alert.present();
}

async function deleteCategory(id: string) {
  await categoriesController.deleteCategory(id);
}

async function generateTestCategories() {
  const techs = ["React", "Vue", "Node", "Python", "TypeScript", "Go", "Rust"];

  const testCategories = Array.from({ length: 3 }, () => {
    const techNames = faker.helpers.arrayElements(techs, { min: 2, max: 5 });
    return {
      id: crypto.randomUUID(),
      name: faker.word.noun(),
      technologies: techNames.map((name) => ({
        name,
        image: "",
        iconName: name.toLowerCase(),
        size: "32px",
        type: "icon" as const,
      })),
    };
  });

  for (const category of testCategories) {
    await categoriesController.addCategory(category);
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
