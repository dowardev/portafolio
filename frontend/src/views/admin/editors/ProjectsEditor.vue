<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Proyectos</ion-label>

      <ion-button :disabled="!allValid" @click="addItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <template v-for="(project, index) in modelValue" :key="index">
      <ion-item-divider sticky>
        <ion-label>{{ project.title }} </ion-label>

        <ion-button
          slot="end"
          expand="block"
          fill="clear"
          color="danger"
          @click="removeItem({ index })"
        >
          <ion-icon :icon="trashOutline"></ion-icon>
          Eliminar proyecto
        </ion-button>
      </ion-item-divider>

      <ion-list>
        <ion-list-header>
          <ion-label> Básico </ion-label>
        </ion-list-header>

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
              <ion-select-option value="finished">Terminado</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item lines="full" button @click="openFileDialog({ index })">
            <ion-label>Logo del proyecto</ion-label>

            <ion-note v-if="fileNames[index]" slot="end">{{
              fileNames[index]
            }}</ion-note>

            <ion-note v-else slot="end">Seleccionar</ion-note>

            <ion-button
              slot="end"
              fill="clear"
              :disabled="!props.modelValue[index]?.img"
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

          <span v-if="hasError({ index, field: 'img' })" class="error">
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

          <ion-item lines="full">
            <ion-textarea
              label="Descripción"
              label-placement="floating"
              :value="project.details.description"
              :rows="3"
              placeholder="Descripción del proyecto..."
              :error-text="getError({ index, field: 'description' })"
              :class="{
                'ion-invalid': hasError({ index, field: 'description' }),
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
      </ion-list>

      <ion-list>
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
              :disabled="!props.modelValue[index]?.source?.img"
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

          <ion-item>
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
      </ion-list>

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
</template>

<script setup lang="ts">
// imports
import {
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
} from "@ionic/vue";
import {
  addOutline,
  trashOutline,
  eyeOutline,
  closeOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { ProjectItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";
// end imports

// props and emits
const props = defineProps<{
  modelValue: ProjectItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProjectItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();
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
  props.modelValue.map((project) => ({
    ...project,
    description: project.details?.description ?? "",
  })),
);

const v$ = useVuelidate(rules, { items: flatItems });

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return !v$.value.$invalid;
});
// end vuelidate

// functions
function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function emitFiles() {
  emit("update:files", { ...pendingFiles });
}

function addItem() {
  emit("update:modelValue", [
    ...props.modelValue,
    {
      img: "",
      title: "",
      status: "progress",
      startDate: "",
      endDate: "",
      technologies: [],
      source: { img: "", name: "", url: "" },
      details: { description: "", website: "" },
    },
  ]);
}

function updateItem(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function updateDetail(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = {
    ...updated[index],
    details: { ...updated[index].details, [field]: value },
  };
  emit("update:modelValue", updated);
}

function updateSource(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = {
    ...updated[index],
    source: { ...updated[index].source, [field]: value },
  };
  emit("update:modelValue", updated);
}

function updateTechnologies(params: {
  index: number;
  technologies: ProjectItem["technologies"];
}) {
  const { index, technologies } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], technologies };
  emit("update:modelValue", updated);
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
  const project = props.modelValue[index];
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
  const project = props.modelValue[index];
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

function removeItem(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[`project_image_${index}`];
  delete pendingFiles[`project_source_image_${index}`];
  delete touched[index];
  delete fileNames[index];
  delete sourceFileNames[index];
  delete startDatePopoverOpen[index];
  delete endDatePopoverOpen[index];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
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
