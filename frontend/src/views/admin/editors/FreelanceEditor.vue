<template>
  <div class="ion-padding">
    <ion-item lines="none">
      <ion-label>Páginas Freelance</ion-label>
      <ion-button
        slot="end"
        size="small"
        @click="addItem"
        :disabled="!allValid"
      >
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir plataforma
      </ion-button>
    </ion-item>

    <div
      v-for="(platform, index) in modelValue"
      :key="index"
      class="platform-item"
    >
      <ion-item>
        <ion-label position="stacked">Nombre de la plataforma</ion-label>
        <ion-input
          :value="platform.name"
          placeholder="Ej: Upwork"
          :class="{ 'ion-invalid': hasError(index, 'name') }"
          @ion-input="updateItem(index, 'name', $event.detail.value!)"
          @ion-blur="touchField(index, 'name')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'name')" class="error">Nombre es requerido</span>

      <ion-item>
        <ion-label position="stacked">Link de la plataforma</ion-label>
        <ion-input
          :value="platform.url"
          placeholder="https://..."
          :class="{ 'ion-invalid': hasError(index, 'url') }"
          @ion-input="updateItem(index, 'url', $event.detail.value!)"
          @ion-blur="touchField(index, 'url')"
        ></ion-input>
      </ion-item>
      <span v-if="hasError(index, 'url')" class="error">Link es requerido</span>

      <div class="file-upload">
        <ion-label class="upload-label">Logo de la plataforma</ion-label>
        <input
          type="file"
          accept="image/*"
          @change="onMainFileChange($event, index)"
        />
        <div class="preview-row" v-if="platform.image">
          <img :src="platform.image" alt="preview" class="platform-preview" />
        </div>
      </div>
      <span v-if="hasError(index, 'image')" class="error">Logo es requerido</span>

      <ion-item lines="none">
        <ion-label>Comentarios</ion-label>
        <ion-button
          slot="end"
          size="small"
          @click="addComment(index)"
          :disabled="!isPlatformValid(index)"
        >
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Añadir
        </ion-button>
      </ion-item>

      <div
        v-for="(comment, commentIndex) in platform.comments"
        :key="commentIndex"
        class="comment-item"
      >
        <ion-item>
          <ion-label position="stacked">Título del proyecto</ion-label>
          <ion-input
            :value="comment.title"
            placeholder="Nombre del proyecto"
            :class="{ 'ion-invalid': hasCommentError(index, commentIndex, 'title') }"
            @ion-input="
              updateComment(index, commentIndex, 'title', $event.detail.value!)
            "
            @ion-blur="touchCommentField(index, commentIndex, 'title')"
          ></ion-input>
        </ion-item>
        <span v-if="hasCommentError(index, commentIndex, 'title')" class="error">
          Título es requerido
        </span>

        <ion-item>
          <ion-label position="stacked">Comentario</ion-label>
          <ion-textarea
            :value="comment.comment.join('\n')"
            :rows="3"
            placeholder="Una línea por comentario..."
            @ion-input="
              updateCommentText(index, commentIndex, $event.detail.value!)
            "
          ></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Calificación (1-5)</ion-label>
          <ion-input
            type="number"
            :value="comment.rating"
            min="1"
            max="5"
            @ion-input="
              updateComment(
                index,
                commentIndex,
                'rating',
                parseInt($event.detail.value || '5')
              )
            "
          ></ion-input>
        </ion-item>

        <div class="file-upload">
          <ion-label class="upload-label">Imagen del cliente</ion-label>
          <input
            type="file"
            accept="image/*"
            @change="onCommentFileChange($event, index, commentIndex)"
          />
          <div class="preview-row" v-if="comment.image">
            <img :src="comment.image" alt="preview" class="comment-preview" />
          </div>
        </div>

        <ion-button
          fill="clear"
          color="danger"
          size="small"
          @click="removeComment(index, commentIndex)"
        >
          <ion-icon :icon="trashOutline"></ion-icon>
        </ion-button>
      </div>

      <ion-button fill="clear" color="danger" @click="removeItem(index)">
        <ion-icon :icon="trashOutline"></ion-icon>
        Eliminar plataforma
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
} from "@ionic/vue";
import { addOutline, trashOutline } from "ionicons/icons";
import { computed, reactive } from "vue";
import type { FreelanceItem } from "@/services/homeApi";

const props = defineProps<{
  modelValue: FreelanceItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FreelanceItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();

const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<string, boolean>>({});
const commentTouched = reactive<Record<string, boolean>>({});

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((platform, pIdx) => {
    if (!platform.name?.trim() || !platform.url?.trim() || !platform.image) return false;
    return platform.comments.every((comment) => {
      return comment.title?.trim();
    });
  });
});

function hasError(index: number, field: string): boolean {
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const platform = props.modelValue[index];
  if (field === 'name') return !platform?.name?.trim();
  if (field === 'url') return !platform?.url?.trim();
  if (field === 'image') return !platform?.image;
  return false;
}

function touchField(index: number, field: string) {
  touched[`${index}_${field}`] = true;
}

function hasCommentError(platformIndex: number, commentIndex: number, field: string): boolean {
  const key = `${platformIndex}_${commentIndex}_${field}`;
  if (!commentTouched[key]) return false;
  const comment = props.modelValue[platformIndex]?.comments[commentIndex];
  if (field === 'title') return !comment?.title?.trim();
  return false;
}

function touchCommentField(platformIndex: number, commentIndex: number, field: string) {
  commentTouched[`${platformIndex}_${commentIndex}_${field}`] = true;
}

function isPlatformValid(platformIndex: number): boolean {
  const platform = props.modelValue[platformIndex];
  if (!platform?.name?.trim() || !platform?.url?.trim() || !platform?.image) return false;
  return platform.comments.every((comment) => comment.title?.trim());
}

function emitFiles() {
  emit("update:files", { ...pendingFiles });
}

function addItem() {
  emit("update:modelValue", [
    ...props.modelValue,
    {
      name: "",
      image: "",
      url: "",
      comments: [],
    },
  ]);
}

function updateItem(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeItem(index: number) {
  delete pendingFiles[`freelance_image_${index}`];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  );
}

function addComment(platformIndex: number) {
  const updated = [...props.modelValue];
  updated[platformIndex] = {
    ...updated[platformIndex],
    comments: [
      ...updated[platformIndex].comments,
      { image: "", title: "", comment: [], rating: 5 },
    ],
  };
  emit("update:modelValue", updated);
}

function updateComment(
  platformIndex: number,
  commentIndex: number,
  field: string,
  value: any
) {
  const updated = [...props.modelValue];
  const comments = [...updated[platformIndex].comments];
  comments[commentIndex] = { ...comments[commentIndex], [field]: value };
  updated[platformIndex] = { ...updated[platformIndex], comments };
  emit("update:modelValue", updated);
}

function updateCommentText(
  platformIndex: number,
  commentIndex: number,
  value: string
) {
  const updated = [...props.modelValue];
  const comments = [...updated[platformIndex].comments];
  comments[commentIndex] = {
    ...comments[commentIndex],
    comment: value.split("\n").filter((line) => line.trim()),
  };
  updated[platformIndex] = { ...updated[platformIndex], comments };
  emit("update:modelValue", updated);
}

function removeComment(platformIndex: number, commentIndex: number) {
  delete pendingFiles[`freelance_comment_image_${platformIndex}_${commentIndex}`];
  emitFiles();
  const updated = [...props.modelValue];
  updated[platformIndex] = {
    ...updated[platformIndex],
    comments: updated[platformIndex].comments.filter(
      (_, i) => i !== commentIndex
    ),
  };
  emit("update:modelValue", updated);
}

function onMainFileChange(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`freelance_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateItem(index, "image", objectUrl);
  emitFiles();
  touchField(index, "image");
}

function onCommentFileChange(event: Event, platformIndex: number, commentIndex: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`freelance_comment_image_${platformIndex}_${commentIndex}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateComment(platformIndex, commentIndex, "image", objectUrl);
  emitFiles();
}
</script>

<style scoped>
.platform-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
}

.comment-item {
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

.platform-preview {
  max-width: 60px;
  max-height: 40px;
}

.comment-preview {
  max-width: 50px;
  max-height: 50px;
  border-radius: 50%;
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
