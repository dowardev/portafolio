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

        <ion-title>{{
          isNew ? "Nuevo Proyecto" : "Editar Proyecto"
        }}</ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="!isNew && projectIndex !== undefined"
            color="danger"
            fill="clear"
            @click="confirmDelete"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="projectsStore.saving" @click="handleSave">
            <ion-spinner v-if="projectsStore.saving" slot="start"></ion-spinner>
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-if="projectsStore.loading || !projectsStore.loaded"
        class="ion-text-center ion-padding"
      >
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else-if="localProject">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-list-header>
                  <ion-label>Proyecto</ion-label>
                </ion-list-header>

                <ion-card class="shadow1">
                  <ion-item lines="full">
                    <ion-input
                      v-model="localProject.title"
                      label="Nombre del proyecto"
                      label-placement="floating"
                      placeholder="Ej: Moneyflap"
                      :error-text="titleError"
                      :class="{
                        'ion-invalid': titleTouched && !!titleError,
                        'ion-touched': titleTouched,
                      }"
                      @ion-blur="titleTouched = true"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="full" button @click="openStartDatePopover">
                    <ion-label>Inicio</ion-label>
                    <ion-note slot="end">{{
                      formatDate(localProject.startDate ?? "")
                    }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="startDatePopoverOpen"
                    @ion-popover-dismiss="closeStartDatePopover"
                  >
                    <ion-datetime
                      presentation="month-year"
                      :value="localProject.startDate ?? undefined"
                      @ion-change="onStartDateChange"
                    ></ion-datetime>
                  </ion-popover>

                  <ion-item lines="full" button @click="openEndDatePopover">
                    <ion-label>Fin</ion-label>
                    <ion-note slot="end">{{
                      formatDate(localProject.endDate ?? "")
                    }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="endDatePopoverOpen"
                    @ion-popover-dismiss="closeEndDatePopover"
                  >
                    <ion-datetime
                      presentation="month-year"
                      :value="localProject.endDate ?? undefined"
                      @ion-change="onEndDateChange"
                    ></ion-datetime>
                  </ion-popover>

                  <ion-item lines="full">
                    <ion-select
                      v-model="localProject.status"
                      label="Estado"
                      label-placement="floating"
                    >
                      <ion-select-option value="progress"
                        >En progreso</ion-select-option
                      >
                      <ion-select-option value="indeterminate"
                        >Indeterminado</ion-select-option
                      >
                      <ion-select-option value="finished"
                        >Terminado</ion-select-option
                      >
                    </ion-select>
                  </ion-item>

                  <ion-item lines="full" button @click="openFileDialog">
                    <ion-label>Logo del proyecto</ion-label>

                    <ion-note v-if="fileName" slot="end">{{
                      fileName
                    }}</ion-note>

                    <ion-note v-else slot="end">Seleccionar</ion-note>

                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="!localProject.img"
                      @click.stop="showPreview"
                    >
                      <ion-icon :icon="eyeOutline"></ion-icon>
                    </ion-button>
                  </ion-item>

                  <input
                    ref="fileInput"
                    style="display: none"
                    type="file"
                    accept="image/*"
                    @change="onMainFileChange"
                  />

                  <span v-if="imgTouched && imgError" class="error">{{
                    imgError
                  }}</span>

                  <ion-item lines="full">
                    <ion-input
                      v-model="localProject.details.website"
                      label="Link del proyecto"
                      label-placement="floating"
                      placeholder="https://..."
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="none">
                    <ion-textarea
                      v-model="localProject.details.description"
                      label="Descripción"
                      label-placement="floating"
                      :rows="3"
                      placeholder="Descripción del proyecto..."
                      :error-text="descriptionError"
                      :class="{
                        'ion-invalid': descriptionTouched && !!descriptionError,
                        'ion-touched': descriptionTouched,
                      }"
                      @ion-blur="descriptionTouched = true"
                    ></ion-textarea>
                  </ion-item>
                </ion-card>

                <ion-list-header>
                  <ion-label>Fuente</ion-label>
                </ion-list-header>

                <ion-card class="shadow1">
                  <ion-item lines="full" button @click="openSourceFileDialog">
                    <ion-label>Imagen fuente</ion-label>

                    <ion-note v-if="sourceFileName" slot="end">{{
                      sourceFileName
                    }}</ion-note>

                    <ion-note v-else slot="end">Seleccionar</ion-note>

                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="!localProject.source?.img"
                      @click.stop="showSourcePreview"
                    >
                      <ion-icon :icon="eyeOutline"></ion-icon>
                    </ion-button>
                  </ion-item>

                  <input
                    ref="sourceFileInput"
                    style="display: none"
                    type="file"
                    accept="image/*"
                    @change="onSourceFileChange"
                  />

                  <ion-item>
                    <ion-input
                      v-model="localProject.source.name"
                      label="Nombre fuente"
                      label-placement="floating"
                      placeholder="Ej: PengyiLabs"
                    ></ion-input>
                  </ion-item>

                  <ion-item lines="none">
                    <ion-input
                      v-model="localProject.source.url"
                      label="URL fuente"
                      label-placement="floating"
                      placeholder="https://..."
                    ></ion-input>
                  </ion-item>
                </ion-card>

                <TechnologiesEditor
                  v-model="localProject.technologies"
                  @update:files="updateTechFiles"
                />
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>

    <ion-modal :is-open="isPreviewOpen" @ion-modal-did-dismiss="closePreview">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closePreview">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>Vista previa</ion-title>
        </ion-toolbar>
      </ion-header>
      <div style="padding: 16px; text-align: center">
        <img
          v-if="previewSrc"
          :src="previewSrc"
          alt="preview"
          class="modal-image"
        />
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
// imports
import {
  IonPage,
  IonHeader,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonDatetime,
  IonPopover,
  IonList,
  IonListHeader,
  IonCard,
  IonNote,
  IonBackButton,
  IonSpinner,
  alertController,
} from "@ionic/vue";
import {
  trashOutline,
  eyeOutline,
  closeOutline,
  saveOutline,
} from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ProjectItem } from "@/services/types";
import TechnologiesEditor from "./TechSkillsEditor.vue";
import ProjectsController from "@/controllers/projectsController";
import { useProjectsStore } from "@/store/projectsStore";
// end imports

const route = useRoute();
const router = useRouter();
const projectsController = new ProjectsController();
const projectsStore = useProjectsStore();

const projectIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "ProjectNewPage");

const localProject = ref<ProjectItem | null>(null);

onMounted(async () => {
  await projectsController.loadProjects();
  if (isNew.value) {
    localProject.value = {
      id: crypto.randomUUID(),
      img: "",
      title: "",
      status: "progress",
      startDate: "",
      endDate: "",
      technologies: [],
      source: { img: "", name: "", url: "" },
      details: { description: "", website: "" },
    };
  } else if (projectIndex.value !== undefined) {
    const project = projectsController.getProject(projectIndex.value);
    if (project) {
      localProject.value = { ...project };
    }
  }
});

async function handleSave() {
  if (!localProject.value) return;
  try {
    const success = isNew.value
      ? await projectsController.addProject(localProject.value)
      : await projectsController.updateProject(localProject.value.id, localProject.value);
    if (success) {
      router.push("/admin-panel/projects");
    }
  } catch (error) {
    console.error("Error saving project:", error);
  }
}

async function confirmDelete() {
  const alert = await alertController.create({
    header: "Eliminar proyecto",
    message: "¿Estás seguro de eliminar este proyecto?",
    buttons: [
      {
        text: "Cancelar",
        role: "cancel",
      },
      {
        text: "Eliminar",
        role: "destructive",
        handler: () => deleteProject(),
      },
    ],
  });
  await alert.present();
}

async function deleteProject() {
  if (!localProject.value?.id) return;
  const success = await projectsController.deleteProject(localProject.value.id);
  if (success) {
    router.push("/admin-panel/projects");
  }
}

// vars and const
const pendingFiles: Record<string, File> = {};
const fileName = ref("");
const sourceFileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const sourceFileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const startDatePopoverOpen = ref(false);
const endDatePopoverOpen = ref(false);

// validation state
const titleTouched = ref(false);
const imgTouched = ref(false);
const descriptionTouched = ref(false);
// end vars and const

// validation computed
const titleError = computed(() => {
  if (!localProject.value?.title?.trim()) return "Nombre es requerido";
  return "";
});

const imgError = computed(() => {
  if (!localProject.value?.img) return "Logo es requerido";
  return "";
});

const descriptionError = computed(() => {
  if (!localProject.value?.details?.description?.trim())
    return "Descripción es requerida";
  return "";
});

// functions
function updateTechFiles(files: Record<number, File>) {
  Object.keys(pendingFiles).forEach((key) => {
    if (!key.startsWith("project_tech_image_0_")) {
      delete pendingFiles[key];
    }
  });

  for (const [techIndex, file] of Object.entries(files)) {
    pendingFiles[`project_tech_image_0_${techIndex}`] = file;
  }
}

function openFileDialog() {
  fileInput.value?.click();
}

function onMainFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles["project_image_0"] = file;
  if (localProject.value) {
    localProject.value.img = URL.createObjectURL(file);
  }
  fileName.value = file.name;
  imgTouched.value = true;
}

function showPreview() {
  const src = localProject.value?.img;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function openSourceFileDialog() {
  sourceFileInput.value?.click();
}

function onSourceFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles["project_source_image_0"] = file;
  if (localProject.value) {
    localProject.value.source.img = URL.createObjectURL(file);
  }
  sourceFileName.value = file.name;
}

function showSourcePreview() {
  const src = localProject.value?.source?.img;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Seleccionar";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

function openStartDatePopover() {
  startDatePopoverOpen.value = true;
}

function closeStartDatePopover() {
  startDatePopoverOpen.value = false;
}

function onStartDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value && localProject.value) {
    localProject.value.startDate = value;
  }
  closeStartDatePopover();
}

function openEndDatePopover() {
  endDatePopoverOpen.value = true;
}

function closeEndDatePopover() {
  endDatePopoverOpen.value = false;
}

function onEndDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value && localProject.value) {
    localProject.value.endDate = value;
  }
  closeEndDatePopover();
}
// end functions
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>

