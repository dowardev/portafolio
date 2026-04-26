<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/categories"
          ></ion-back-button>
        </ion-buttons>

        <ion-title>{{ isEditing ? "Editar" : "Nueva" }} Skill</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="isEditing && categoryIndex !== undefined"
            color="danger"
            fill="clear"
            @click="confirmDelete"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="saving" color="primary" @click="saveCategory">
            <ion-spinner v-if="saving" slot="start"></ion-spinner>
            <ion-icon v-else slot="start" :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-card class="shadow1">
                <ion-item lines="none">
                  <ion-input
                    v-model="categoryName"
                    label="Nombre de categoría"
                    label-placement="floating"
                    placeholder="Ej: Frameworks"
                    :error-text="nameError"
                    :class="{
                      'ion-invalid': nameTouched && !!nameError,
                      'ion-touched': nameTouched,
                    }"
                    @ion-blur="nameTouched = true"
                  ></ion-input>
                </ion-item>
              </ion-card>

              <TechSkillsEditor
                ref="techSkillsRef"
                :model-value="technologies"
              />
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
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
  IonBackButton,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonInput,
  IonItem,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  alertController,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { saveOutline, trashOutline } from "ionicons/icons";
import CategoriesController from "@/controllers/categoriesController";
import TechSkillsEditor from "./TechSkillsEditor.vue";
import type { SkillCategory } from "@/services/types";

const route = useRoute();
const router = useRouter();
const categoriesController = new CategoriesController();
const techSkillsRef = ref<InstanceType<typeof TechSkillsEditor> | null>(null);

const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);
const skillCategories = ref<SkillCategory[]>([]);

const categoryName = ref("");
const technologies = ref<TechItem[]>([]);
const nameTouched = ref(false);
const nameError = ref("");

const isEditing = computed(() => route.path.includes("/edit/"));
const categoryIndex = computed(() => parseInt(route.params.index as string));
const categoryId = ref("");

onMounted(async () => {
  loading.value = true;
  try {
    skillCategories.value = await categoriesController.loadCategories();

    if (isEditing.value && categoryIndex.value !== undefined) {
      const category = skillCategories.value[categoryIndex.value];
      if (category) {
        categoryName.value = category.name;
        categoryId.value = category.id;
        technologies.value.splice(
          0,
          technologies.value.length,
          ...category.technologies,
        );
      }
    }
  } catch (error) {
    console.error("Error loading category:", error);
  } finally {
    loading.value = false;
    loaded.value = true;
  }
});

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Eliminar categoría",
    message: `¿Estás seguro de eliminar "${categoryName.value || "esta categoría"}"?`,
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => {
          deleteCategory();
        },
      },
    ],
  });
  await alert.present();
}

async function deleteCategory() {
  if (categoryId.value) {
    saving.value = true;
    const success = await categoriesController.deleteCategory(categoryId.value);
    saving.value = false;
    if (success) {
      router.push("/admin-panel/categories");
    }
  }
}

async function saveCategory() {
  nameTouched.value = true;

  if (!categoryName.value.trim()) return;

  const techData = techSkillsRef.value?.modelValue || technologies.value;
  saving.value = true;
  let success: boolean;
  if (isEditing.value && categoryId.value) {
    const category = {
      id: categoryId.value,
      name: categoryName.value.trim(),
      technologies: techData.filter((t) => t.iconName?.trim()),
    };
    success = await categoriesController.updateCategory(categoryId.value, category);
  } else {
    const category = {
      id: crypto.randomUUID(),
      name: categoryName.value.trim(),
      technologies: techData.filter((t) => t.iconName?.trim()),
    };
    success = await categoriesController.addCategory(category);
  }
  saving.value = false;
  if (success) {
    router.push("/admin-panel/categories");
  }
}
</script>

<style scoped>
.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}
</style>