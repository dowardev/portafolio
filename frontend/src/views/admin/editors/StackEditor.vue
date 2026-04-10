<template>
  <ion-list>
    <ion-list-header>
      <ion-label></ion-label>

      <ion-button :disabled="!allValid" @click="addStackItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card v-for="(item, index) in modelValue" :key="index" class="shadow1">
      <ion-item lines="full">
        <ion-input
          label="Nombre"
          label-placement="floating"
          :value="item.name"
          placeholder="Ej: Vue.js"
          :class="{
            'ion-invalid':
              v$.items.$each.$response.$errors[index]?.name?.length > 0 &&
              touched[index]?.name,
          }"
          @ion-input="updateStackItem({ index, field: 'name', value: $event.detail.value! })"
          @ion-blur="touchField({ index, field: 'name' })"
        ></ion-input>
      </ion-item>

      <span
        v-if="
          touched[index]?.name &&
          v$.items.$each.$response.$errors[index]?.name?.length
        "
        class="error"
      >
        {{ v$.items.$each.$response.$errors[index].name[0].$message }}
      </span>

      <ion-item lines="full" button @click="openFileDialog({ index })">
        <ion-label>Imagen</ion-label>

        <ion-note v-if="fileNames[index]" slot="end">{{
          fileNames[index]
        }}</ion-note>
        <ion-note v-else slot="end">Seleccionar</ion-note>

        <ion-button
          slot="end"
          fill="clear"
          :disabled="!item.image"
          @click.stop="showPreview({ index })"
        >
          <ion-icon :icon="eyeOutline"></ion-icon>
        </ion-button>
      </ion-item>

      <input
        style="display: none"
        type="file"
        accept="image/*"
        :data-index="index"
        @change="onFileChange({ event: $event, index })"
      />

      <span
        v-if="
          touched[index]?.image &&
          v$.items.$each.$response.$errors[index]?.image?.length
        "
        class="error"
      >
        {{ v$.items.$each.$response.$errors[index].image[0].$message }}
      </span>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          @click="removeStackItem({ index })"
        >
          <ion-icon :icon="trashOutline"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-card>
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

    <div class="modal-content" style="padding: 16px; text-align: center">
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
  IonNote,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/vue";
import { addOutline, closeOutline, eyeOutline, trashOutline } from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { StackItem } from "@/services/homeApi";
// end imports

// props and emits
const props = defineProps<{
  modelValue: StackItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: StackItem[]): void;
  (e: "update:files", files: Record<number, File>): void;
}>();
// end props and emits

// vars and const
const pendingFiles: Record<number, File> = {};

const touched = reactive<Record<number, Record<string, boolean>>>({});

const fileNames = reactive<Record<number, string>>({});

const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// vuelidate
const rules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      image: {
        required: helpers.withMessage("Imagen es requerida", required),
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
function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addStackItem() {
  emit("update:modelValue", [...props.modelValue, { name: "", image: "" }]);
}

function updateStackItem(params: { index: number; field: keyof StackItem; value: string }) {
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
  fileNames[index] = file.name;
  const objectUrl = URL.createObjectURL(file);
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], image: objectUrl };
  emit("update:modelValue", updated);
  emit("update:files", { ...pendingFiles });
  touchField({ index, field: "image" });
}

function openFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-index="${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { index: number }) {
  const { index } = params;
  const src = props.modelValue[index]?.image ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function removeStackItem(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[index];
  delete touched[index];
  delete fileNames[index];
  emit("update:files", { ...pendingFiles });
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}
// end functions
</script>

<style scoped>
.stack-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 12px;
}

.preview-row {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.stack-preview {
  max-width: 60px;
  max-height: 60px;
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
