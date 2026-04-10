<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Tecnologías</ion-label>

      <ion-button :disabled="!allValid" @click="addTech">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card class="shadow1">
      <template v-for="(tech, index) in modelValue" :key="index">
        <ion-item lines="full">
          <ion-input
            label="Nombre de la tecnología"
            label-placement="floating"
            :value="tech.name"
            placeholder="Ej: Vue"
            :class="{ 'ion-invalid': hasError(index, 'name') }"
            @ion-input="updateTech(index, 'name', $event.detail.value!)"
            @ion-blur="touchField(index, 'name')"
          ></ion-input>
        </ion-item>
        <span v-if="hasError(index, 'name')" class="error">
          {{ getError(index, "name") }}
        </span>

        <ion-item lines="full">
          <ion-select
            interface="popover"
            label="Tipo"
            label-placement="floating"
            :value="tech.type"
            @ion-change="updateTech(index, 'type', $event.detail.value)"
          >
            <ion-select-option value="img">Imagen</ion-select-option>
            <ion-select-option value="icon">Icono</ion-select-option>
          </ion-select>

          <TechIconSelector
            v-if="tech.type === 'icon'"
            slot="end"
            :model-value="tech.source"
            label="Icono de tecnología"
            @update:model-value="updateTech(index, 'source', $event)"
          />

          <label
            v-if="tech.type === 'img'"
            slot="end"
            :for="`tech-file-${index}`"
            class="file-trigger"
          >
            <ion-icon :icon="imageOutline"></ion-icon>
          </label>

          <ion-button
            v-if="tech.type === 'img' && tech.source"
            slot="end"
            fill="clear"
            @click="openPreview(tech.source, tech.name)"
          >
            <ion-icon :icon="eyeOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <input
          :id="`tech-file-${index}`"
          type="file"
          accept="image/*"
          hidden
          @change="onFileChange($event, index)"
        />
        <span v-if="hasError(index, 'source')" class="error">
          {{ getError(index, "source") }}
        </span>

        <ion-item lines="full">
          <ion-input
            label="Tamaño"
            label-placement="floating"
            :value="tech.size"
            placeholder="18px"
            @ion-input="updateTech(index, 'size', $event.detail.value!)"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            size="small"
            @click="removeTech(index)"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
            Eliminar tecnología
          </ion-button>
        </ion-item>
      </template>
    </ion-card>

    <!-- ion-modal -->
    <ion-modal :is-open="preview.open" @did-dismiss="preview.open = false">
      <ion-header mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="preview.open = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>{{ preview.name || "Preview" }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="preview-container">
          <img :src="preview.src" :alt="preview.name" class="preview-image" />
        </div>
      </ion-content>
    </ion-modal>
    <!-- ion-modals -->
  </ion-list>
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
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import {
  addOutline,
  closeOutline,
  eyeOutline,
  imageOutline,
  trashOutline,
} from "ionicons/icons";
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
const preview = reactive({ open: false, src: "", name: "" });

function openPreview(src: string, name: string) {
  preview.src = src;
  preview.name = name;
  preview.open = true;
}

const rules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      source: {
        required: helpers.withMessage(
          "Debe seleccionar una imagen o icono",
          required,
        ),
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
    props.modelValue.filter((_, i) => i !== index),
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

.file-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  color: var(--ion-color-primary);
  font-size: 24px;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
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
