<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/admin-panel/skills"
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
                    label="Nombre de skill"
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
                :model-value="technologies"
                @update:model-value="technologies = $event"
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
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  alertController,
} from "@ionic/vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { saveOutline, trashOutline } from "ionicons/icons";
import SkillsController from "@/controllers/skillsController";
import TechSkillsEditor from "./TechSkillsEditor.vue";

interface TechItem {
  iconName: string;
}

const route = useRoute();
const router = useRouter();
const skillsController = new SkillsController();

const isEditing = computed(() => route.path.includes("/edit/"));
const categoryIndex = computed(() => {
  const idx = route.params.index;
  return idx ? parseInt(idx as string, 10) : undefined;
});

const loading = ref(true);
const saving = ref(false);
const nameTouched = ref(false);

const categoryName = ref("");
const technologies = ref<TechItem[]>([]);

const nameError = computed(() => {
  if (!nameTouched.value || !categoryName.value) return "";
  return categoryName.value.trim() ? "" : "Nombre de skill es requerido";
});

onMounted(async () => {
  await skillsController.loadSkills();

  if (isEditing.value && categoryIndex.value !== undefined) {
    const category = skillsController.getSkillCategory(categoryIndex.value);
    if (category) {
      categoryName.value = category.name;
      technologies.value.splice(
        0,
        technologies.value.length,
        ...category.technologies,
      );
    }
  }

  loading.value = false;
});

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Eliminar skill",
    message: `¿Estás seguro de eliminar "${categoryName.value || "esta skill"}"?`,
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
  if (categoryIndex.value !== undefined) {
    await skillsController.deleteSkillCategory(categoryIndex.value);
    router.push("/admin-panel/skills");
  }
}

async function saveCategory() {
  nameTouched.value = true;

  if (!categoryName.value.trim()) return;

  const category = {
    name: categoryName.value.trim(),
    technologies: technologies.value.filter((t) => t.iconName?.trim()),
  };

  saving.value = true;
  try {
    const success = await skillsController.saveSkillCategory(
      category,
      categoryIndex.value,
    );
    if (success) {
      router.push("/admin-panel/skills");
    }
  } finally {
    saving.value = false;
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
