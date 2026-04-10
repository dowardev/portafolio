<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Experiencia</ion-label>

      <ion-button :disabled="!allValid" @click="addItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>
  </ion-list>

  <ion-card class="shadow1">
    <template v-for="(exp, index) in modelValue" :key="index">
      <ion-item lines="full">
        <ion-input
          label="Nombre / Empresa"
          label-placement="floating"
          :value="exp.title"
          placeholder="Ej: Upwork"
          :class="{ 'ion-invalid': hasError({ index, field: 'title' }) }"
          @ion-input="updateItem({ index, field: 'title', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'title' })"
        ></ion-input>
      </ion-item>
      <span v-if="hasError({ index, field: 'title' })" class="error"
        >Nombre es requerido</span
      >

      <ion-item lines="full">
        <ion-input
          :value="exp.date"
          placeholder="Ej: Marzo 2023 - Actualidad"
          label="Fecha"
          label-placement="floating"
          :class="{ 'ion-invalid': hasError({ index, field: 'date' }) }"
          @ion-input="updateItem({ index, field: 'date', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'date' })"
        ></ion-input>
      </ion-item>
      <span v-if="hasError({ index, field: 'date' })" class="error"
        >Fecha es requerida</span
      >

      <ion-item lines="full" button @click="openFileDialog({ index })">
        <ion-label>Logo de la empresa</ion-label>

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
        :data-type="`exp_${index}`"
        type="file"
        accept="image/*"
        @change="onMainFileChange({ event: $event, index })"
      />

      <span v-if="hasError({ index, field: 'img' })" class="error">Logo es requerido</span>

      <ion-item lines="full">
        <ion-textarea
          label="Descripción"
          label-placement="floating"
          :value="exp.details.description"
          :rows="3"
          placeholder="Descripción del trabajo..."
          :class="{ 'ion-invalid': hasError({ index, field: 'description' }) }"
          @ion-input="updateDetail({ index, field: 'description', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'description' })"
        ></ion-textarea>
      </ion-item>
      <span v-if="hasError({ index, field: 'description' })" class="error"
        >Descripción es requerida</span
      >

      <ion-item lines="full">
        <ion-input
          label="Link"
          label-placement="floating"
          :value="exp.details.website"
          placeholder="https://..."
          @ion-input="updateDetail({ index, field: 'website', value: $event.detail.value! })"
        ></ion-input>
      </ion-item>

      <TechnologiesEditor
        :model-value="exp.technologies"
        @update:model-value="updateTechnologies({ index, technologies: $event })"
        @update:files="(files) => updateTechFiles({ expIndex: index, files })"
      />

      <ion-button
        expand="block"
        fill="clear"
        color="danger"
        @click="removeItem({ index })"
      >
        <ion-icon :icon="trashOutline"></ion-icon>
        Eliminar experiencia
      </ion-button>
    </template>
  </ion-card>

  <!-- modals -->
  <!-- preview modal -->
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
  <!-- modals -->
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
} from "@ionic/vue";
import {
  addOutline,
  trashOutline,
  eyeOutline,
  closeOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import type { ExperienceItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";
// end imports

// props and emits
const props = defineProps<{
  modelValue: ExperienceItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ExperienceItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();
// end props and emits

// vars and const
const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<string, boolean>>({});

const fileNames = reactive<Record<number, string>>({});

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// computed
const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((exp) => {
    return (
      exp.title?.trim() &&
      exp.date?.trim() &&
      exp.img &&
      exp.details?.description?.trim()
    );
  });
});
// end computed

// functions
function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const exp = props.modelValue[index];
  if (field === "title") return !exp?.title?.trim();
  if (field === "date") return !exp?.date?.trim();
  if (field === "img") return !exp?.img;
  if (field === "description") return !exp?.details?.description?.trim();
  return false;
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
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
      date: "",
      technologies: [],
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

function updateTechnologies(
  params: { index: number; technologies: ExperienceItem["technologies"] },
) {
  const { index, technologies } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], technologies };
  emit("update:modelValue", updated);
}

function updateTechFiles(params: { expIndex: number; files: Record<number, File> }) {
  const { expIndex, files } = params;
  for (const [techIndex, file] of Object.entries(files)) {
    pendingFiles[`exp_tech_image_${expIndex}_${techIndex}`] = file;
  }
  emitFiles();
}

function onMainFileChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`exp_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateItem({ index, field: "img", value: objectUrl });
  fileNames[index] = file.name;
  emitFiles();
  touchField({ index, field: "img" });
}

function openFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-type="exp_${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { index: number }) {
  const { index } = params;
  const exp = props.modelValue[index];
  const src = exp?.img ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function removeItem(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[`exp_image_${index}`];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
// end functions
// end functions
</script>

<style scoped>
.exp-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
}

.preview-row {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.exp-preview {
  max-width: 80px;
  max-height: 45px;
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

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>
