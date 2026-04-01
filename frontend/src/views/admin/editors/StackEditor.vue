<template>
  <div class="ion-padding">
    <ion-item lines="none">
      <ion-label>Stack Principal</ion-label>
      <ion-button
        slot="end"
        size="small"
        @click="addStackItem"
        :disabled="!allValid"
      >
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir
      </ion-button>
    </ion-item>

    <div v-for="(item, index) in modelValue" :key="index" class="stack-item">
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input
          :value="item.name"
          placeholder="Ej: Vue.js"
          :class="{
            'ion-invalid': v$.items.$each.$response.$errors[index]?.name?.length > 0 && touched[index]?.name,
          }"
          @ion-input="updateStackItem(index, 'name', $event.detail.value!)"
          @ion-blur="touchField(index, 'name')"
        ></ion-input>
      </ion-item>
      <span
        v-if="touched[index]?.name && v$.items.$each.$response.$errors[index]?.name?.length"
        class="error"
      >
        {{ v$.items.$each.$response.$errors[index].name[0].$message }}
      </span>

      <div class="file-upload">
        <ion-label class="upload-label">Imagen</ion-label>
        <input
          type="file"
          accept="image/*"
          @change="onFileChange($event, index)"
        />
      </div>
      <span
        v-if="touched[index]?.image && v$.items.$each.$response.$errors[index]?.image?.length"
        class="error"
      >
        {{ v$.items.$each.$response.$errors[index].image[0].$message }}
      </span>

      <div class="preview-row" v-if="item.image">
        <img :src="item.image" alt="preview" class="stack-preview" />
      </div>

      <ion-button fill="clear" color="danger" @click="removeStackItem(index)">
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
} from "@ionic/vue";
import { addOutline, trashOutline } from "ionicons/icons";
import { computed, reactive, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { StackItem } from "@/services/homeApi";

const props = defineProps<{
  modelValue: StackItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: StackItem[]): void;
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

function touchField(index: number, field: string) {
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addStackItem() {
  emit("update:modelValue", [...props.modelValue, { name: "", image: "" }]);
}

function updateStackItem(index: number, field: keyof StackItem, value: string) {
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
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], image: objectUrl };
  emit("update:modelValue", updated);
  emit("update:files", { ...pendingFiles });
  touchField(index, "image");
}

function removeStackItem(index: number) {
  delete pendingFiles[index];
  delete touched[index];
  emit("update:files", { ...pendingFiles });
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  );
}
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
</style>
