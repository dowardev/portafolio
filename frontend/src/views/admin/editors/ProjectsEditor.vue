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

          <ion-button :disabled="saving" @click="handleSave">
            <ion-spinner v-if="saving" slot="start"></ion-spinner>
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-if="loading || !loaded"
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

                  <ion-item lines="full" button @click="openStartDatePopover($event)">
                    <ion-label>Inicio</ion-label>
                    <ion-note slot="end">{{
                      formatDate(localProject.startDate ?? "")
                    }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="startDatePopoverOpen"
                    :event="startDatePopoverEvent"
                    @did-dismiss="closeStartDatePopover"
                  >
                    <div>
                      <ion-datetime
                        presentation="month-year"
                        locale="es-ES"
                        :show-default-buttons="true"
                        done-text="Aceptar"
                        cancel-text="Cancelar"
                        :value="localProject.startDate ?? undefined"
                        :max="localProject.endDate || undefined"
                        @ion-change="onStartDateChange"
                      ></ion-datetime>
                    </div>
                  </ion-popover>

                  <ion-item lines="full" button @click="syncAndOpenEndDatePopover($event)">
                    <ion-label>Fin</ion-label>
                    <ion-note slot="end">{{ formattedEndDate }}</ion-note>
                  </ion-item>

                  <ion-popover
                    :is-open="endDatePopoverOpen"
                    :event="endDatePopoverEvent"
                    @did-dismiss="closeEndDatePopover"
                  >
                    <div>
                      <ion-datetime
                        presentation="month-year"
                        locale="es-ES"
                        :show-default-buttons="true"
                        done-text="Aceptar"
                        cancel-text="Cancelar"
                        :value="localProject.endDate ?? undefined"
                        :min="localProject.startDate || undefined"
                        @ion-change="onEndDateChange"
                      ></ion-datetime>

                      <ion-item lines="full">
                        <ion-checkbox
                          :checked="isCurrent"
                          @click="onIsCurrentClick"
                          @blur="endDateTouched = true"
                        >
                          Actualidad
                        </ion-checkbox>
                      </ion-item>

                      <span v-if="endDateTouched && endDateError" class="error">{{
                        endDateError
                      }}</span>
                    </div>
                  </ion-popover>

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

                <IconSelector
                  :model-value="localProject.technologies"
                  type="tech"
                  @update:model-value="localProject.technologies = $event"
                  @add="handleTechAdd"
                  @remove="handleTechRemove"
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
  IonModal,
  IonCheckbox,
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
import IconSelector from "@/components/admin/IconSelector.vue";
import ProjectsController from "@/controllers/projectsController";
// end imports

const route = useRoute();
const router = useRouter();
const projectsController = new ProjectsController();

const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);
const projects = ref<ProjectItem[]>([]);

const projectIndex = computed(() => {
  const index = route.params.index;
  if (typeof index === "string") {
    return parseInt(index, 10);
  }
  return undefined;
});

const isNew = computed(() => route.name === "ProjectNewPage");

const localProject = ref<ProjectItem | null>(null);

function handleTechAdd() {
  if (localProject.value) {
    localProject.value.technologies = [...(localProject.value.technologies || []), { iconName: "" }];
  }
}

function handleTechRemove(index: number) {
  if (localProject.value && localProject.value.technologies) {
    localProject.value.technologies = localProject.value.technologies.filter((_: any, i: number) => i !== index);
  }
}

onMounted(async () => {
  loading.value = true;
  projects.value = await projectsController.loadPublicProjects();
  if (isNew.value) {
    localProject.value = {
      id: crypto.randomUUID(),
      img: "",
      title: "",
      status: "progress",
      startDate: "",
      endDate: undefined,
      technologies: [],
      source: { img: "", name: "", url: "" },
      details: { description: "", website: "" },
    };
  } else if (projectIndex.value !== undefined) {
    const project = projects.value[projectIndex.value];
    if (project) {
      localProject.value = { ...project };
      isCurrent.value = !localProject.value?.endDate;
    }
  }
  loading.value = false;
  loaded.value = true;
});

async function handleSave() {
  if (!localProject.value) return;
  try {
    const success = isNew.value
      ? await projectsController.addProject(localProject.value, pendingMainImageFile, pendingTechFiles)
      : await projectsController.updateProject(localProject.value.id, localProject.value, pendingMainImageFile, pendingTechFiles);
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
let pendingMainImageFile: File | null = null;
let pendingTechFiles: Record<number, File> = {};
const fileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const startDatePopoverOpen = ref(false);
const endDatePopoverOpen = ref(false);
const startDatePopoverEvent = ref<Event | undefined>(undefined);
const endDatePopoverEvent = ref<Event | undefined>(undefined);

const isCurrent = ref(false);

// validation state
const titleTouched = ref(false);
const imgTouched = ref(false);
const descriptionTouched = ref(false);
const endDateTouched = ref(false);
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

const endDateError = computed(() => {
  if (endDateTouched.value) {
    if (!localProject.value?.endDate && !isCurrent.value) {
      return "Selecciona una fecha o marca Actualidad";
    }
  }
  return "";
});

// functions
function updateTechFiles(files: Record<number, File>) {
  pendingTechFiles = files;
}

function openFileDialog() {
  fileInput.value?.click();
}

function onMainFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingMainImageFile = file;
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

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Seleccionar";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

const formattedEndDate = computed(() => {
  if (isCurrent.value) return "Actual";
  const d = localProject.value?.endDate;
  if (!d) return "Seleccionar";
  return new Date(d).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
});

function openStartDatePopover(event: Event) {
  startDatePopoverEvent.value = event;
  startDatePopoverOpen.value = true;
}

function closeStartDatePopover() {
  startDatePopoverOpen.value = false;
  startDatePopoverEvent.value = undefined;
}

function onStartDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value && localProject.value) {
    localProject.value.startDate = value;
  }
  closeStartDatePopover();
}

function openEndDatePopover(event: Event) {
  endDatePopoverEvent.value = event;
  endDatePopoverOpen.value = true;
}

function syncAndOpenEndDatePopover(event: Event) {
  if (!isNew.value && localProject.value) {
    isCurrent.value = !localProject.value.endDate;
  }
  openEndDatePopover(event);
}

function closeEndDatePopover() {
  endDatePopoverOpen.value = false;
  endDatePopoverEvent.value = undefined;
}

function onEndDateChange(event: CustomEvent) {
  const value = event.detail.value;
  if (value && localProject.value) {
    localProject.value.endDate = value;
    isCurrent.value = false;
  }
  closeEndDatePopover();
}

function onIsCurrentClick() {
  isCurrent.value = !isCurrent.value;
  if (isCurrent.value && localProject.value) {
    localProject.value.endDate = undefined;
  }
  endDateTouched.value = true;
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

