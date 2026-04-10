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
            :class="{ 'ion-invalid': hasError({ index, field: 'name' }) }"
            @ion-input="updateTech({ index, field: 'name', value: $event.detail.value! })"
            @ion-blur="touchField({ index, field: 'name' })"
          ></ion-input>
        </ion-item>
        <span v-if="hasError({ index, field: 'name' })" class="error">
          {{ getError({ index, field: "name" }) }}
        </span>

        <ion-item lines="full">
          <ion-select
            interface="popover"
            label="Tipo"
            label-placement="floating"
            :value="tech.type"
            @ion-change="updateTech({ index, field: 'type', value: $event.detail.value })"
          >
            <ion-select-option value="img">Imagen</ion-select-option>
            <ion-select-option value="icon">Icono</ion-select-option>
          </ion-select>

          <TechIconSelector
            v-if="tech.type === 'icon'"
            slot="end"
            :model-value="tech.source"
            label="Icono de tecnología"
            @update:model-value="updateTech({ index, field: 'source', value: $event })"
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
          @change="onFileChange({ event: $event, index })"
        />
        <span v-if="hasError({ index, field: 'source' })" class="error">
          {{ getError({ index, field: "source" }) }}
        </span>

        <ion-item lines="full">
          <ion-input
            label="Tamaño"
            label-placement="floating"
            :value="tech.size"
            placeholder="18px"
            @ion-input="updateTech({ index, field: 'size', value: $event.detail.value! })"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            size="small"
            @click="removeTech({ index })"
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
// imports
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
// end imports

// props and emits
const props = defineProps<{
  modelValue: Technology[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Technology[]): void;
  (e: "update:files", files: Record<number, File>): void;
}>();
// end props and emits

// vars and const
const pendingFiles: Record<number, File> = {};
const touched = reactive<Record<number, Record<string, boolean>>>({});
const preview = reactive({ open: false, src: "", name: "" });
// end vars and const

// functions
function openPreview(src: string, name: string) {
  preview.src = src;
  preview.name = name;
  preview.open = true;
}
// end functions

// vuelidate
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

function addTech() {
  emit("update:modelValue", [
    ...props.modelValue,
    { source: "", name: "", size: "18px", type: "icon" },
  ]);
}

function updateTech(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function onFileChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[index] = file;
  const objectUrl = URL.createObjectURL(file);
  updateTech({ index, field: "source", value: objectUrl });
  emitFiles();
  touchField({ index, field: "source" });
}

function removeTech(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[index];
  delete touched[index];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
// end functions
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
