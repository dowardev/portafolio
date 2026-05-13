<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/skills-categories"
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

              <IconSelector
                ref="techSkillsRef"
                :model-value="technologies"
                type="tech"
                @update:model-value="technologies = $event"
                @add="handleAdd"
                @remove="handleRemove"
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

import SkillsCategoriesController from "@/controllers/skillsCategoriesController";

import IconSelector from "@/components/admin/IconSelector.vue";

import type { SkillsCategoryItem } from "@/store/skillsCategoriesStore";
import { usePermissionGuard } from "@/composables/usePermissionGuard";

const { guard } = usePermissionGuard();

const route = useRoute();
const router = useRouter();
const skillsCategoriesController = new SkillsCategoriesController();
const techSkillsRef = ref<InstanceType<typeof IconSelector> | null>(null);

const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);
const skillCategories = ref<SkillsCategoryItem[]>([]);

const categoryName = ref("");
const technologies = ref<{ iconName: string }[]>([]);
const nameTouched = ref(false);
const nameError = ref("");

function handleAdd() {
  technologies.value = [...technologies.value, { iconName: "" }];
}

function handleRemove(index: number) {
  technologies.value = technologies.value.filter((_, i) => i !== index);
}

const isEditing = computed(() => route.path.includes("/edit/"));
const categoryIndex = computed(() => parseInt(route.params.index as string));
const categoryId = ref<number | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    skillCategories.value = await skillsCategoriesController.loadSkillsCategories();

    if (isEditing.value && categoryIndex.value !== undefined) {
      const category = skillCategories.value[categoryIndex.value];
      if (category) {
        categoryName.value = category.name;
        categoryId.value = category.id ?? null;
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
  if (!(await guard({ permission: 'skills-categories.delete' }))) {
    return;
  }

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
  if (categoryId.value !== null) {
    saving.value = true;
    const success = await skillsCategoriesController.deleteSkillsCategory(categoryId.value);
    saving.value = false;
    if (success) {
router.push("/admin-panel/skills-categories");
}
  }
}

async function saveCategory() {
  const requiredPerm = isEditing.value ? 'skills-categories.update' : 'skills-categories.create';
  if (!(await guard({ permission: requiredPerm, message: `No tienes permisos para ${isEditing.value ? 'actualizar' : 'crear'} categorías de habilidades. Contacta al administrador.` }))) {
    return;
  }

  nameTouched.value = true;

  if (!categoryName.value.trim()) return;

  const techData = techSkillsRef.value?.modelValue || technologies.value;
  saving.value = true;
  let success: boolean;
  
  const categoryData = {
    name: categoryName.value.trim(),
    technologies: techData,
  };
  
  if (isEditing.value && categoryId.value !== null) {
    success = await skillsCategoriesController.updateSkillsCategory(categoryId.value, categoryData);
  } else {
    success = await skillsCategoriesController.addSkillsCategory(categoryData);
  }
  saving.value = false;
  if (success) {
router.push("/admin-panel/skills-categories");
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