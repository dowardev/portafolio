<template>
  <div>
    <ion-item lines="none">
      <ion-label>Tecnologías</ion-label>
      <ion-button
        slot="end"
        size="small"
        @click="addTech"
        :disabled="!allValid"
      >
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir
      </ion-button>
    </ion-item>

    <div v-for="(tech, index) in modelValue" :key="index" class="tech-item">
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input
          :value="tech.name"
          placeholder="Ej: Vue"
          :class="{ 'ion-invalid': hasError(index, 'name') }"
          @ion-input="updateTech(index, 'name', $event.detail.value!)"
          @ion-blur="touchField(index, 'name')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'name')" class="error">
        {{ getError(index, 'name') }}
      </span>

      <ion-item>
        <ion-label position="stacked">Tipo</ion-label>
        <ion-select
          :value="tech.type"
          @ion-change="updateTech(index, 'type', $event.detail.value)"
        >
          <ion-select-option value="img">Imagen</ion-select-option>
          <ion-select-option value="icon">Icono</ion-select-option>
        </ion-select>
      </ion-item>

      <div v-if="tech.type === 'img'" class="file-upload">
        <ion-label class="upload-label">Imagen</ion-label>
        <input
          type="file"
          accept="image/*"
          @change="onFileChange($event, index)"
        />
        <div class="preview-row" v-if="tech.source">
          <img :src="tech.source" alt="preview" class="tech-preview" />
        </div>
      </div>
      <span v-if="hasError(index, 'source')" class="error">
        {{ getError(index, 'source') }}
      </span>

      <TechIconSelector
        v-if="tech.type === 'icon'"
        :modelValue="tech.source"
        label="Icono de tecnología"
        @update:modelValue="updateTech(index, 'source', $event)"
      />

      <ion-item>
        <ion-label position="stacked">Tamaño</ion-label>
        <ion-input
          :value="tech.size"
          placeholder="18px"
          @ion-input="updateTech(index, 'size', $event.detail.value!)"
        ></ion-input>
      </ion-item>

      <ion-button fill="clear" color="danger" size="small" @click="removeTech(index)">
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
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { addOutline, trashOutline } from "ionicons/icons";
import { computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import TechIconSelector from "./TechIconSelector.vue";

interface Technology {
  source: string;
  name: string;
  size: string;
  type: "img" | "icon";
}

const props = defineProps<{
  modelValue: Technology[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Technology[]): void;
  (e: "update:files", files: Record<number, File>): void;
}>();

const pendingFiles: Record<number, File> = {};
const touched = reactive<Record<number, Record<string, boolean>>>({});

const rules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      source: {
        required: helpers.withMessage("Debe seleccionar una imagen o icono", required),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { items: computed(() => props.modelValue) });

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return !v$.value.$invalid;
});

function hasError(index: number, field: string): boolean {
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(index: number, field: string): string {
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(index: number, field: string) {
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function emitFiles() {
  emit("update:files", { ...pendingFiles });
}

function addTech() {
  emit("update:modelValue", [
    ...props.modelValue,
    { source: "", name: "", size: "18px", type: "icon" },
  ]);
}

function updateTech(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function onFileChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[index] = file;
  const objectUrl = URL.createObjectURL(file);
  updateTech(index, "source", objectUrl);
  emitFiles();
  touchField(index, "source");
}

function removeTech(index: number) {
  delete pendingFiles[index];
  delete touched[index];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  );
}
</script>

<style scoped>
.tech-item {
  border: 1px solid var(--ion-color-medium-tint);
  border-radius: 6px;
  padding: 6px;
  margin: 8px 0;
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

.preview-row {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.tech-preview {
  max-width: 40px;
  max-height: 40px;
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
