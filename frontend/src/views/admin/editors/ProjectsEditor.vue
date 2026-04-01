<template>
  <div class="ion-padding">
    <ion-item lines="none">
      <ion-label>Proyectos</ion-label>
      <ion-button
        slot="end"
        size="small"
        @click="addItem"
        :disabled="!allValid"
      >
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir
      </ion-button>
    </ion-item>

    <div
      v-for="(project, index) in modelValue"
      :key="index"
      class="project-item"
    >
      <ion-item>
        <ion-label position="stacked">Nombre del proyecto</ion-label>
        <ion-input
          :value="project.title"
          placeholder="Ej: Moneyflap"
          :class="{ 'ion-invalid': hasError(index, 'title') }"
          @ion-input="updateItem(index, 'title', $event.detail.value!)"
          @ion-blur="touchField(index, 'title')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'title')" class="error">Nombre es requerido</span>

      <ion-item>
        <ion-label position="stacked">Estado</ion-label>
        <ion-select
          :value="project.status"
          @ion-change="updateItem(index, 'status', $event.detail.value)"
        >
          <ion-select-option value="progress">En progreso</ion-select-option>
          <ion-select-option value="indeterminate">Indeterminado</ion-select-option>
          <ion-select-option value="finished">Terminado</ion-select-option>
        </ion-select>
      </ion-item>

      <div class="file-upload">
        <ion-label class="upload-label">Logo del proyecto</ion-label>
        <input
          type="file"
          accept="image/*"
          @change="onMainFileChange($event, index)"
        />
        <div class="preview-row" v-if="project.img">
          <img :src="project.img" alt="preview" class="project-preview" />
        </div>
      </div>
      <span v-if="hasError(index, 'img')" class="error">Logo es requerido</span>

      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-textarea
          :value="project.details.description"
          :rows="3"
          placeholder="Descripción del proyecto..."
          :class="{ 'ion-invalid': hasError(index, 'description') }"
          @ion-input="updateDetail(index, 'description', $event.detail.value!)"
          @ion-blur="touchField(index, 'description')"
        ></ion-textarea>
      </ion-item>
      <span v-if="hasError(index, 'description')" class="error">Descripción es requerida</span>

      <ion-item>
        <ion-label position="stacked">Link del proyecto</ion-label>
        <ion-input
          :value="project.details.website"
          placeholder="https://..."
          @ion-input="updateDetail(index, 'website', $event.detail.value!)"
        ></ion-input>
      </ion-item>

      <ion-item lines="none" class="ion-margin-top">
        <ion-label>Fuente / Cliente</ion-label>
      </ion-item>
      <div class="source-section">
        <div class="file-upload">
          <ion-label class="upload-label">Imagen fuente</ion-label>
          <input
            type="file"
            accept="image/*"
            @change="onSourceFileChange($event, index)"
          />
          <div class="preview-row" v-if="project.source.img">
            <img :src="project.source.img" alt="preview" class="source-preview" />
          </div>
        </div>
        <ion-item>
          <ion-label position="stacked">Nombre fuente</ion-label>
          <ion-input
            :value="project.source.name"
            placeholder="Ej: PengyiLabs"
            @ion-input="updateSource(index, 'name', $event.detail.value!)"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">URL fuente</ion-label>
          <ion-input
            :value="project.source.url"
            placeholder="https://..."
            @ion-input="updateSource(index, 'url', $event.detail.value!)"
          ></ion-input>
        </ion-item>
      </div>

      <TechnologiesEditor
        :modelValue="project.technologies"
        @update:modelValue="updateTechnologies(index, $event)"
        @update:files="(files) => updateTechFiles(index, files)"
      />

      <ion-button fill="clear" color="danger" @click="removeItem(index)">
        <ion-icon :icon="trashOutline"></ion-icon>
        Eliminar
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { addOutline, trashOutline } from "ionicons/icons";
import { computed, reactive } from "vue";
import type { ProjectItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";

const props = defineProps<{
  modelValue: ProjectItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProjectItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();

const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<string, boolean>>({});

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((project) => {
    return project.title?.trim() && project.img && project.details?.description?.trim();
  });
});

function hasError(index: number, field: string): boolean {
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const project = props.modelValue[index];
  if (field === 'title') return !project?.title?.trim();
  if (field === 'img') return !project?.img;
  if (field === 'description') return !project?.details?.description?.trim();
  return false;
}

function touchField(index: number, field: string) {
  touched[`${index}_${field}`] = true;
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
      technologies: [],
      source: { img: "", name: "", url: "" },
      details: { description: "", website: "" },
    },
  ]);
}

function updateItem(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function updateDetail(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = {
    ...updated[index],
    details: { ...updated[index].details, [field]: value },
  };
  emit("update:modelValue", updated);
}

function updateSource(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = {
    ...updated[index],
    source: { ...updated[index].source, [field]: value },
  };
  emit("update:modelValue", updated);
}

function updateTechnologies(
  index: number,
  technologies: ProjectItem["technologies"]
) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], technologies };
  emit("update:modelValue", updated);
}

function updateTechFiles(projectIndex: number, files: Record<number, File>) {
  for (const [techIndex, file] of Object.entries(files)) {
    pendingFiles[`project_tech_image_${projectIndex}_${techIndex}`] = file;
  }
  emitFiles();
}

function onMainFileChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`project_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateItem(index, "img", objectUrl);
  emitFiles();
  touchField(index, "img");
}

function onSourceFileChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`project_source_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateSource(index, "img", objectUrl);
  emitFiles();
}

function removeItem(index: number) {
  delete pendingFiles[`project_image_${index}`];
  delete pendingFiles[`project_source_image_${index}`];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  );
}
</script>

<style scoped>
.project-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
}

.source-section {
  border: 1px solid var(--ion-color-medium-tint);
  border-radius: 6px;
  padding: 6px;
  margin: 8px 0;
}

.preview-row {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.project-preview {
  max-width: 80px;
  max-height: 45px;
}

.source-preview {
  max-width: 60px;
  max-height: 40px;
}

.file-upload {
  padding: 8px 16px;
}

.upload-label {
  display: block;
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}

.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.ion-invalid {
  --border-color: var(--ion-color-danger);
}
</style>
