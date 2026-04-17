<template>
  <ion-page>
    <ion-header v-if="standalone" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/admin-panel/projects"
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
        v-if="standalone && (projectsStore.loading || !projectsStore.loaded)"
        class="ion-text-center ion-padding"
      >
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else-if="projects.length > 0">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="4">
              <ion-list>
                <ion-list-header>
                  <ion-label>Proyecto</ion-label>
                </ion-list-header>

                <template v-for="(project, index) in projects" :key="index">
                  <ion-card class="shadow1">
                    <ion-item lines="full">
                      <ion-input
                        label="Nombre del proyecto"
                        label-placement="floating"
                        :value="project.title"
                        placeholder="Ej: Moneyflap"
                        :error-text="getError({ index, field: 'title' })"
                        :class="{
                          'ion-invalid': hasError({ index, field: 'title' }),
                          'ion-touched': touched[index]?.title,
                        }"
                        @ion-input="
                          updateItem({
                            index,
                            field: 'title',
                            value: $event.detail.value!,
                          })
                        "
                        @ion-blur="touchField({ index, field: 'title' })"
                      ></ion-input>
                    </ion-item>

                    <!-- fecha -->

                    <ion-item
                      lines="full"
                      button
                      @click="openStartDatePopover(index)"
                    >
                      <ion-label>Inicio</ion-label>
                      <ion-note slot="end">{{
                        formatDate(project.startDate ?? "")
                      }}</ion-note>
                    </ion-item>

                    <ion-popover
                      :is-open="startDatePopoverOpen[index]"
                      @ion-popover-dismiss="closeStartDatePopover"
                    >
                      <ion-datetime
                        presentation="month-year"
                        :value="project.startDate ?? undefined"
                        @ion-change="onStartDateChange(index, $event)"
                      ></ion-datetime>
                    </ion-popover>

                    <ion-item
                      lines="full"
                      button
                      @click="openEndDatePopover(index)"
                    >
                      <ion-label>Fin</ion-label>
                      <ion-note slot="end">{{
                        formatDate(project.endDate ?? "")
                      }}</ion-note>
                    </ion-item>

                    <ion-popover
                      :is-open="endDatePopoverOpen[index]"
                      @ion-popover-dismiss="closeEndDatePopover"
                    >
                      <ion-datetime
                        presentation="month-year"
                        :value="project.endDate ?? undefined"
                        @ion-change="onEndDateChange(index, $event)"
                      ></ion-datetime>
                    </ion-popover>

                    <ion-item lines="full">
                      <ion-select
                        label="Estado"
                        label-placement="floating"
                        :value="project.status"
                        @ion-change="
                          updateItem({
                            index,
                            field: 'status',
                            value: $event.detail.value,
                          })
                        "
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

                    <ion-item
                      lines="full"
                      button
                      @click="openFileDialog({ index })"
                    >
                      <ion-label>Logo del proyecto</ion-label>

                      <ion-note v-if="fileNames[index]" slot="end">{{
                        fileNames[index]
                      }}</ion-note>

                      <ion-note v-else slot="end">Seleccionar</ion-note>

                      <ion-button
                        slot="end"
                        fill="clear"
                        :disabled="!projects[index]?.img"
                        @click.stop="showPreview({ index })"
                      >
                        <ion-icon :icon="eyeOutline"></ion-icon>
                      </ion-button>
                    </ion-item>

                    <input
                      style="display: none"
                      :data-type="`project_${index}`"
                      type="file"
                      accept="image/*"
                      @change="onMainFileChange({ event: $event, index })"
                    />

                    <span
                      v-if="hasError({ index, field: 'img' })"
                      class="error"
                    >
                      {{ getError({ index, field: "img" }) }}
                    </span>

                    <ion-item lines="full">
                      <ion-input
                        label="Link del proyecto"
                        label-placement="floating"
                        :value="project.details.website"
                        placeholder="https://..."
                        @ion-input="
                          updateDetail({
                            index,
                            field: 'website',
                            value: $event.detail.value!,
                          })
                        "
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-textarea
                        label="Descripción"
                        label-placement="floating"
                        :value="project.details.description"
                        :rows="3"
                        placeholder="Descripción del proyecto..."
                        :error-text="getError({ index, field: 'description' })"
                        :class="{
                          'ion-invalid': hasError({
                            index,
                            field: 'description',
                          }),
                          'ion-touched': touched[index]?.description,
                        }"
                        @ion-input="
                          updateDetail({
                            index,
                            field: 'description',
                            value: $event.detail.value!,
                          })
                        "
                        @ion-blur="touchField({ index, field: 'description' })"
                      ></ion-textarea>
                    </ion-item>
                  </ion-card>

                  <ion-list-header>
                    <ion-label>Fuente</ion-label>
                  </ion-list-header>

                  <ion-card class="shadow1">
                    <ion-item
                      lines="full"
                      button
                      @click="openSourceFileDialog({ index })"
                    >
                      <ion-label>Imagen fuente</ion-label>

                      <ion-note v-if="sourceFileNames[index]" slot="end">{{
                        sourceFileNames[index]
                      }}</ion-note>

                      <ion-note v-else slot="end">Seleccionar</ion-note>

                      <ion-button
                        slot="end"
                        fill="clear"
                        :disabled="!projects[index]?.source?.img"
                        @click.stop="showSourcePreview({ index })"
                      >
                        <ion-icon :icon="eyeOutline"></ion-icon>
                      </ion-button>
                    </ion-item>

                    <input
                      style="display: none"
                      :data-type="`project_source_${index}`"
                      type="file"
                      accept="image/*"
                      @change="onSourceFileChange({ event: $event, index })"
                    />

                    <ion-item>
                      <ion-input
                        label="Nombre fuente"
                        label-placement="floating"
                        :value="project.source.name"
                        placeholder="Ej: PengyiLabs"
                        @ion-input="
                          updateSource({
                            index,
                            field: 'name',
                            value: $event.detail.value!,
                          })
                        "
                      ></ion-input>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-input
                        label="URL fuente"
                        label-placement="floating"
                        :value="project.source.url"
                        placeholder="https://..."
                        @ion-input="
                          updateSource({
                            index,
                            field: 'url',
                            value: $event.detail.value!,
                          })
                        "
                      ></ion-input>
                    </ion-item>
                  </ion-card>

                  <TechnologiesEditor
                    :model-value="project.technologies"
                    @update:model-value="
                      updateTechnologies({ index, technologies: $event })
                    "
                    @update:files="
                      (files) => updateTechFiles({ projectIndex: index, files })
                    "
                  />
                </template>
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
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { ProjectItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";
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

const standalone = computed(() => {
  return route.name === "ProjectNewPage" || route.name === "ProjectEditPage";
});

// props and emits
const props = defineProps<{
  modelValue: ProjectItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProjectItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();

const localProjects = ref<ProjectItem[]>([]);

const projects = computed(() => {
  if (standalone.value) {
    return localProjects.value;
  }
  return props.modelValue ?? [];
});

onMounted(async () => {
  if (standalone.value) {
    await projectsController.loadProjects();
    if (isNew.value) {
      const newProject: ProjectItem = {
        img: "",
        title: "",
        status: "progress",
        startDate: "",
        endDate: "",
        technologies: [],
        source: { img: "", name: "", url: "" },
        details: { description: "", website: "" },
      };
      localProjects.value = [newProject];
    } else if (projectIndex.value !== undefined) {
      const project = projectsController.getProject(projectIndex.value);
      if (project) {
        localProjects.value = [{ ...project }];
      }
    }
  }
});

async function handleSave() {
  if (!standalone.value) return;
  try {
    const success = await projectsController.saveProject(
      localProjects.value[0],
      isNew.value ? undefined : projectIndex.value,
    );
    if (success) {
      router.push("/admin-panel/projects");
    }
  } catch (error) {
    console.error("Error saving project:", error);
  }
}

async function confirmDelete() {
  if (!standalone.value) return;
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
  if (!standalone.value || projectIndex.value === undefined) return;
  const success = await projectsController.deleteProject(projectIndex.value);
  if (success) {
    router.push("/admin-panel/projects");
  }
}
// end props and emits

// vars and const
const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<number, Record<string, boolean>>>({});

const fileNames = reactive<Record<number, string>>({});
const sourceFileNames = reactive<Record<number, string>>({});

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);

const startDatePopoverOpen = reactive<Record<number, boolean>>({});
const endDatePopoverOpen = reactive<Record<number, boolean>>({});
// end vars and const

// vuelidate
const descriptionRequired = helpers.withMessage(
  "Descripción es requerida",
  (value: string, siblings: ProjectItem) => {
    return !!siblings?.details?.description?.trim();
  },
);

const rules = {
  items: {
    $each: helpers.forEach({
      title: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      img: {
        required: helpers.withMessage("Logo es requerido", required),
      },
      description: {
        required: descriptionRequired,
      },
    }),
  },
};

// Flatten details.description into a virtual "description" field for forEach validation
const flatItems = computed(() =>
  projects.value.map((project) => ({
    ...project,
    description: project.details?.description ?? "",
  })),
);

const v$ = useVuelidate(rules, { items: flatItems });
// end vuelidate

// functions
function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  if (!projects.value[index]) return false;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  if (!projects.value[index]) return "";
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function emitFiles() {
  if (!standalone.value) {
    emit("update:files", { ...pendingFiles });
  }
}

function updateItem(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  if (standalone.value) {
    localProjects.value = localProjects.value.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
  } else {
    const updated = [...projects.value];
    updated[index] = { ...updated[index], [field]: value };
    emit("update:modelValue", updated);
  }
}

function updateDetail(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  if (standalone.value) {
    localProjects.value = localProjects.value.map((p, i) =>
      i === index ? { ...p, details: { ...p.details, [field]: value } } : p,
    );
  } else {
    const updated = [...projects.value];
    updated[index] = {
      ...updated[index],
      details: { ...updated[index].details, [field]: value },
    };
    emit("update:modelValue", updated);
  }
}

function updateSource(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  if (standalone.value) {
    localProjects.value = localProjects.value.map((p, i) =>
      i === index ? { ...p, source: { ...p.source, [field]: value } } : p,
    );
  } else {
    const updated = [...projects.value];
    updated[index] = {
      ...updated[index],
      source: { ...updated[index].source, [field]: value },
    };
    emit("update:modelValue", updated);
  }
}

function updateTechnologies(params: {
  index: number;
  technologies: ProjectItem["technologies"];
}) {
  const { index, technologies } = params;
  if (standalone.value) {
    localProjects.value = localProjects.value.map((p, i) =>
      i === index ? { ...p, technologies } : p,
    );
  } else {
    const updated = [...projects.value];
    updated[index] = { ...updated[index], technologies };
    emit("update:modelValue", updated);
  }
}

function updateTechFiles(params: {
  projectIndex: number;
  files: Record<number, File>;
}) {
  const { projectIndex, files } = params;
  const prefix = `project_tech_image_${projectIndex}_`;

  Object.keys(pendingFiles).forEach((key) => {
    if (key.startsWith(prefix)) {
      const techIndex = key.replace(prefix, "");
      if (!(techIndex in files)) {
        delete pendingFiles[key];
      }
    }
  });

  for (const [techIndex, file] of Object.entries(files)) {
    pendingFiles[`project_tech_image_${projectIndex}_${techIndex}`] = file;
  }
  emitFiles();
}

function openFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-type="project_${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { index: number }) {
  const { index } = params;
  const project = projects.value[index];
  const src = project?.img ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function onMainFileChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`project_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateItem({ index, field: "img", value: objectUrl });
  fileNames[index] = file.name;
  emitFiles();
  touchField({ index, field: "img" });
}

function openSourceFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-type="project_source_${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showSourcePreview(params: { index: number }) {
  const { index } = params;
  const project = projects.value[index];
  const src = project?.source?.img ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function onSourceFileChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`project_source_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateSource({ index, field: "img", value: objectUrl });
  sourceFileNames[index] = file.name;
  emitFiles();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Seleccionar";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
}

function openStartDatePopover(index: number) {
  startDatePopoverOpen[index] = true;
}

function closeStartDatePopover() {
  const keys = Object.keys(startDatePopoverOpen);
  for (const key of keys) {
    startDatePopoverOpen[Number(key)] = false;
  }
}

function onStartDateChange(index: number, event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    updateItem({ index, field: "startDate", value });
  }
  closeStartDatePopover();
}

function openEndDatePopover(index: number) {
  endDatePopoverOpen[index] = true;
}

function closeEndDatePopover() {
  const keys = Object.keys(endDatePopoverOpen);
  for (const key of keys) {
    endDatePopoverOpen[Number(key)] = false;
  }
}

function onEndDateChange(index: number, event: CustomEvent) {
  const value = event.detail.value;
  if (value) {
    updateItem({ index, field: "endDate", value });
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
