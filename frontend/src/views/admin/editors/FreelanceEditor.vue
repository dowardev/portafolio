<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Páginas Freelance</ion-label>

      <ion-button :disabled="!allValid" @click="addItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir plataforma
      </ion-button>
    </ion-list-header>

    <ion-card class="shadow1">
      <template v-for="(platform, index) in modelValue" :key="index">
        <ion-item lines="full">
          <ion-input
            label="Nombre de la plataforma"
            label-placement="floating"
            :value="platform.name"
            placeholder="Ej: Upwork"
            :class="{ 'ion-invalid': hasError({ index, field: 'name' }) }"
            @ion-input="updateItem({ index, field: 'name', value: $event.detail.value! })"
            @ion-blur="touchField({ index, field: 'name' })"
          ></ion-input>
        </ion-item>
        <span v-if="hasError({ index, field: 'name' })" class="error"
          >Nombre es requerido</span
        >

        <ion-item lines="full">
          <ion-input
            label="Link de la plataforma"
            label-placement="floating"
            :value="platform.url"
            placeholder="https://..."
            :class="{ 'ion-invalid': hasError({ index, field: 'url' }) }"
            @ion-input="updateItem({ index, field: 'url', value: $event.detail.value! })"
            @ion-blur="touchField({ index, field: 'url' })"
          ></ion-input>
        </ion-item>
        <span v-if="hasError({ index, field: 'url' })" class="error"
          >Link es requerido</span
        >

        <ion-item lines="full" button @click="openFileDialog({ index })">
          <ion-label>Logo de la plataforma</ion-label>

          <ion-note v-if="fileNames[index]" slot="end">{{
            fileNames[index]
          }}</ion-note>

          <ion-note v-else slot="end">Seleccionar</ion-note>

          <ion-button
            slot="end"
            fill="clear"
            :disabled="!props.modelValue[index]?.image"
            @click.stop="showPreview({ index })"
          >
            <ion-icon :icon="eyeOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <input
          style="display: none"
          :data-type="`freelance_${index}`"
          type="file"
          accept="image/*"
          @change="onMainFileChange({ event: $event, index })"
        />

        <span v-if="hasError({ index, field: 'image' })" class="error"
          >Logo es requerido</span
        >

        <ion-list>
          <ion-list-header>
            <ion-label>Comentarios</ion-label>

            <ion-button
              :disabled="!isPlatformValid({ platformIndex: index })"
              @click="addComment({ platformIndex: index })"
            >
              <ion-icon slot="start" :icon="addOutline"></ion-icon>
              Añadir
            </ion-button>
          </ion-list-header>

          <ion-card class="shadow1">
            <template
              v-for="(comment, commentIndex) in platform.comments"
              :key="commentIndex"
            >
              <ion-item lines="full">
                <ion-input
                  label="Título del proyecto"
                  label-placement="floating"
                  :value="comment.title"
                  placeholder="Nombre del proyecto"
                  :class="{
                    'ion-invalid': hasCommentError({
                      platformIndex: index,
                      commentIndex,
                      field: 'title',
                    }),
                  }"
                  @ion-input="
                    updateComment({
                      platformIndex: index,
                      commentIndex,
                      field: 'title',
                      value: $event.detail.value!
                    })
                  "
                  @ion-blur="touchCommentField({ platformIndex: index, commentIndex, field: 'title' })"
                ></ion-input>
              </ion-item>
              <span
                v-if="hasCommentError({ platformIndex: index, commentIndex, field: 'title' })"
                class="error"
              >
                Título es requerido
              </span>

              <ion-item lines="full">
                <ion-input
                  label="Calificación (1-5)"
                  label-placement="floating"
                  type="number"
                  :value="comment.rating"
                  min="1"
                  max="5"
                  @ion-input="
                    updateComment({
                      platformIndex: index,
                      commentIndex,
                      field: 'rating',
                      value: parseInt($event.detail.value || '5')
                    })
                  "
                ></ion-input>
              </ion-item>

              <ion-item lines="full">
                <ion-textarea
                  label="Comentario"
                  label-placement="floating"
                  :value="comment.comment.join('\n')"
                  :rows="3"
                  placeholder="Una línea por comentario..."
                  @ion-input="updateCommentText({ platformIndex: index, commentIndex, value: $event.detail.value! })"
                ></ion-textarea>
              </ion-item>

              <ion-item
                lines="full"
                button
                @click="openCommentFileDialog({ platformIndex: index, commentIndex })"
              >
                <ion-label>Imagen del cliente</ion-label>

                <ion-note
                  v-if="commentFileNames[`${index}_${commentIndex}`]"
                  slot="end"
                  >{{ commentFileNames[`${index}_${commentIndex}`] }}</ion-note
                >

                <ion-note v-else slot="end">Seleccionar</ion-note>

                <ion-button
                  slot="end"
                  fill="clear"
                  :disabled="!comment.image"
                  @click.stop="showCommentPreview({ platformIndex: index, commentIndex })"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>

              <input
                style="display: none"
                :data-type="`freelance_comment_${index}_${commentIndex}`"
                type="file"
                accept="image/*"
                @change="onCommentFileChange({ event: $event, platformIndex: index, commentIndex })"
              />

              <ion-item lines="none">
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  size="small"
                  @click="removeComment({ platformIndex: index, commentIndex })"
                >
                  <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                  Eliminar comentario
                </ion-button>
              </ion-item>
            </template>
          </ion-card>
        </ion-list>

        <ion-button
          expand="block"
          fill="clear"
          color="danger"
          @click="removeItem({ index })"
        >
          <ion-icon :icon="trashOutline"></ion-icon>
          Eliminar plataforma
        </ion-button>
      </template>
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
  IonTextarea,
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
import type { FreelanceItem } from "@/services/homeApi";
// end imports

// props and emits
const props = defineProps<{
  modelValue: FreelanceItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FreelanceItem[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();
// end props and emits

// vars and const
const pendingFiles: Record<string, File> = {};
const touched = reactive<Record<string, boolean>>({});
const commentTouched = reactive<Record<string, boolean>>({});

const fileNames = reactive<Record<number, string>>({});
const commentFileNames = reactive<Record<string, string>>({});
const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// computed
const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((platform, pIdx) => {
    if (!platform.name?.trim() || !platform.url?.trim() || !platform.image)
      return false;
    return platform.comments.every((comment) => {
      return comment.title?.trim();
    });
  });
});
// end computed

// functions
function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const key = `${index}_${field}`;
  if (!touched[key]) return false;
  const platform = props.modelValue[index];
  if (field === "name") return !platform?.name?.trim();
  if (field === "url") return !platform?.url?.trim();
  if (field === "image") return !platform?.image;
  return false;
}

function openFileDialog(params: { index: number }) {
  const { index } = params;
  const selector = `input[data-type="freelance_${index}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showPreview(params: { index: number }) {
  const { index } = params;
  const platform = props.modelValue[index];
  const src = platform?.image ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function closePreview() {
  isPreviewOpen.value = false;
  previewSrc.value = null;
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  touched[`${index}_${field}`] = true;
}

function hasCommentError(
  params: { platformIndex: number; commentIndex: number; field: string },
): boolean {
  const { platformIndex, commentIndex, field } = params;
  const key = `${platformIndex}_${commentIndex}_${field}`;
  if (!commentTouched[key]) return false;
  const comment = props.modelValue[platformIndex]?.comments[commentIndex];
  if (field === "title") return !comment?.title?.trim();
  return false;
}

function touchCommentField(params: {
  platformIndex: number;
  commentIndex: number;
  field: string;
}) {
  const { platformIndex, commentIndex, field } = params;
  commentTouched[`${platformIndex}_${commentIndex}_${field}`] = true;
}

function isPlatformValid(params: { platformIndex: number }): boolean {
  const { platformIndex } = params;
  const platform = props.modelValue[platformIndex];
  if (!platform?.name?.trim() || !platform?.url?.trim() || !platform?.image)
    return false;
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

function updateItem(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeItem(params: { index: number }) {
  const { index } = params;
  delete pendingFiles[`freelance_image_${index}`];
  emitFiles();
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}

function addComment(params: { platformIndex: number }) {
  const { platformIndex } = params;
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

function updateComment(params: {
  platformIndex: number;
  commentIndex: number;
  field: string;
  value: any;
}) {
  const { platformIndex, commentIndex, field, value } = params;
  const updated = [...props.modelValue];
  const comments = [...updated[platformIndex].comments];
  comments[commentIndex] = { ...comments[commentIndex], [field]: value };
  updated[platformIndex] = { ...updated[platformIndex], comments };
  emit("update:modelValue", updated);
}

function updateCommentText(params: {
  platformIndex: number;
  commentIndex: number;
  value: string;
}) {
  const { platformIndex, commentIndex, value } = params;
  const updated = [...props.modelValue];
  const comments = [...updated[platformIndex].comments];
  comments[commentIndex] = {
    ...comments[commentIndex],
    comment: value.split("\n").filter((line) => line.trim()),
  };
  updated[platformIndex] = { ...updated[platformIndex], comments };
  emit("update:modelValue", updated);
}

function removeComment(params: { platformIndex: number; commentIndex: number }) {
  const { platformIndex, commentIndex } = params;
  delete pendingFiles[
    `freelance_comment_image_${platformIndex}_${commentIndex}`
  ];
  emitFiles();
  const updated = [...props.modelValue];
  updated[platformIndex] = {
    ...updated[platformIndex],
    comments: updated[platformIndex].comments.filter(
      (_, i) => i !== commentIndex,
    ),
  };
  emit("update:modelValue", updated);
}

function onMainFileChange(params: { event: Event; index: number }) {
  const { event, index } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`freelance_image_${index}`] = file;
  const objectUrl = URL.createObjectURL(file);
  updateItem({ index, field: "image", value: objectUrl });
  fileNames[index] = file.name;
  emitFiles();
  touchField({ index, field: "image" });
}

function openCommentFileDialog(params: {
  platformIndex: number;
  commentIndex: number;
}) {
  const { platformIndex, commentIndex } = params;
  const selector = `input[data-type="freelance_comment_${platformIndex}_${commentIndex}"]`;
  const input = document.querySelector(selector) as HTMLInputElement | null;
  if (input) input.click();
}

function showCommentPreview(params: { platformIndex: number; commentIndex: number }) {
  const { platformIndex, commentIndex } = params;
  const comment = props.modelValue[platformIndex]?.comments[commentIndex];
  const src = comment?.image ?? null;
  if (src) {
    previewSrc.value = src;
    isPreviewOpen.value = true;
  }
}

function onCommentFileChange(params: {
  event: Event;
  platformIndex: number;
  commentIndex: number;
}) {
  const { event, platformIndex, commentIndex } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  pendingFiles[`freelance_comment_image_${platformIndex}_${commentIndex}`] =
    file;
  const objectUrl = URL.createObjectURL(file);
  updateComment({ platformIndex, commentIndex, field: "image", value: objectUrl });
  commentFileNames[`${platformIndex}_${commentIndex}`] = file.name;
  emitFiles();
}
// end functions
// end functions
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

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>
