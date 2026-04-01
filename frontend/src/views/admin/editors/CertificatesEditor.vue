<template>
  <div class="ion-padding">
    <ion-item lines="none">
      <ion-label>Certificados</ion-label>
      <ion-button
        slot="end"
        size="small"
        @click="addItem"
        :disabled="!allValid"
      >
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir certificado
      </ion-button>
    </ion-item>

    <div
      v-for="(cert, index) in modelValue"
      :key="index"
      class="cert-item"
    >
      <ion-item-divider>
        <ion-label>Certificado {{ index + 1 }}</ion-label>
      </ion-item-divider>

      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input
          :value="cert.title"
          placeholder="Ej: SkillValue JavaScript"
          :class="{ 'ion-invalid': hasError(index, 'title') }"
          @ion-input="updateItem(index, 'title', $event.detail.value!)"
          @ion-blur="touchField(index, 'title')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'title')" class="error">Título es requerido</span>

      <ion-item>
        <ion-label position="stacked">Link del certificado</ion-label>
        <ion-input
          :value="cert.url"
          placeholder="https://..."
          :class="{ 'ion-invalid': hasError(index, 'url') }"
          @ion-input="updateItem(index, 'url', $event.detail.value!)"
          @ion-blur="touchField(index, 'url')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'url')" class="error">Link es requerido</span>

      <div class="file-upload">
        <ion-label class="upload-label">Logo / Imagen</ion-label>
        <input type="file" accept="image/*" @change="onImageChange($event, index)" />
        <div class="preview-row" v-if="cert.img">
          <img :src="cert.img" alt="preview" class="item-preview" />
        </div>
      </div>
      <span v-if="hasError(index, 'img')" class="error">Imagen es requerida</span>

      <TechnologiesEditor
        :modelValue="cert.aptitudes"
        @update:modelValue="updateAptitudes(index, $event)"
        @update:files="(files) => updateAptFiles(index, files)"
      />

      <ion-button fill="clear" color="danger" @click="removeItem(index)">
        <ion-icon :icon="trashOutline"></ion-icon>
        Eliminar certificado
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonItemDivider,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { addOutline, trashOutline } from "ionicons/icons";
import { computed, reactive } from "vue";
import type { CertificateItem } from "@/services/homeApi";
import TechnologiesEditor from "./TechnologiesEditor.vue";

const props = defineProps<{
  modelValue: CertificateItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CertificateItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();

const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<string, boolean>>({});

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((cert) => {
    return cert.title?.trim() && cert.url?.trim() && cert.img;
  });
});

function hasError(index: number, field: string): boolean {
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const cert = props.modelValue[index];
  if (field === 'title') return !cert?.title?.trim();
  if (field === 'url') return !cert?.url?.trim();
  if (field === 'img') return !cert?.img;
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
      url: "",
      aptitudes: [],
    },
  ]);
}

function updateItem(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function updateAptitudes(index: number, aptitudes: CertificateItem["aptitudes"]) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], aptitudes };
  emit("update:modelValue", updated);
}

function updateAptFiles(certIndex: number, files: Record<number, File>) {
  for (const [aptIndex, file] of Object.entries(files)) {
    pendingFiles[`cert_apt_image_${certIndex}_${aptIndex}`] = file;
  }
  emitFiles();
}

function onImageChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  pendingFiles[`cert_image_${index}`] = input.files[0];
  updateItem(index, "img", URL.createObjectURL(input.files[0]));
  emitFiles();
  touchField(index, "img");
}

function removeItem(index: number) {
  delete pendingFiles[`cert_image_${index}`];
  emitFiles();
  emit("update:modelValue", props.modelValue.filter((_, i) => i !== index));
}
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
</style>
