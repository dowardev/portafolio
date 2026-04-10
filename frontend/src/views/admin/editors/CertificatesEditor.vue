<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Certificados</ion-label>

      <ion-button :disabled="!allValid" @click="addItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir certificado
      </ion-button>
    </ion-list-header>
  </ion-list>

  <ion-card class="shadow1">
    <template v-for="(cert, index) in modelValue" :key="index">
      <ion-item lines="full">
        <ion-input
          label="Título"
          label-placement="floating"
          :value="cert.title"
          placeholder="Ej: SkillValue JavaScript"
          :class="{ 'ion-invalid': hasError({ index, field: 'title' }) }"
          @ion-input="updateItem({ index, field: 'title', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'title' })"
        ></ion-input>
      </ion-item>
      <span v-if="hasError({ index, field: 'title' })" class="error"
        >Título es requerido</span
      >

      <ion-item lines="full">
        <ion-input
          label="Link del certificado"
          label-placement="floating"
          :value="cert.url"
          placeholder="https://..."
          :class="{ 'ion-invalid': hasError({ index, field: 'url' }) }"
          @ion-input="updateItem({ index, field: 'url', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'url' })"
        ></ion-input>
      </ion-item>
      <span v-if="hasError({ index, field: 'url' })" class="error">Link es requerido</span>

      <ion-item lines="full" button @click="openFileDialog({ index })">
        <ion-label>Logo / Imagen</ion-label>

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
        :data-type="`cert_${index}`"
        type="file"
        accept="image/*"
        @change="onImageChange({ event: $event, index })"
      />

      <span v-if="hasError({ index, field: 'img' })" class="error"
        >Imagen es requerida</span
      >

      <TechnologiesEditor
        :model-value="cert.aptitudes"
        @update:model-value="updateAptitudes({ index, aptitudes: $event })"
        @update:files="(files) => updateAptFiles({ certIndex: index, files })"
      />

      <ion-button
        expand="block"
        fill="clear"
        color="danger"
        @click="removeItem({ index })"
      >
        <ion-icon :icon="trashOutline"></ion-icon>
        Eliminar certificado
      </ion-button>
    </template>
  </ion-card>

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
  IonButton,
  IonIcon,
  IonModal,
  IonToolbar,
  IonButtons,
  IonTitle,
} from "@ionic/vue";
import {
  addOutline,
  trashOutline,
  eyeOutline,
  closeOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import type { CertificateItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";
// end imports

// props and emits
const props = defineProps<{
  modelValue: CertificateItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CertificateItem[]): void;
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
  return props.modelValue.every((cert) => {
    return cert.title?.trim() && cert.url?.trim() && cert.img;
  });
});
// end computed

// functions
function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const cert = props.modelValue[index];
  if (field === "title") return !cert?.title?.trim();
  if (field === "url") return !cert?.url?.trim();
  if (field === "img") return !cert?.img;
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
      url: "",
      aptitudes: [],
    },
  ]);
}

function updateItem(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function updateAptitudes(
  params: { index: number; aptitudes: CertificateItem["aptitudes"] },
) {
  const { index, aptitudes } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], aptitudes };
  emit("update:modelValue", updated);
}

function updateAptFiles(params: { certIndex: number; files: Record<number, File> }) {
  const { certIndex, files } = params;
  for (const [aptIndex, file] of Object.entries(files)) {
    pendingFiles[`cert_apt_image_${certIndex}_${aptIndex}`] = file;
  }
  emitFiles();
}

function openFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-type="cert_${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { index: number }) {
  const { index } = params;
  const cert = props.modelValue[index];
  const src = cert?.img ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}
// end functions

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function onImageChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`cert_image_${index}`] = file;
  updateItem({ index, field: "img", value: URL.createObjectURL(file) });
  fileNames[index] = file.name;
  emitFiles();
  touchField({ index, field: "img" });
}

function removeItem(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[`cert_image_${index}`];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
// end functions
</script>

<style scoped>
.cert-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
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

.item-preview {
  max-width: 80px;
  max-height: 45px;
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
