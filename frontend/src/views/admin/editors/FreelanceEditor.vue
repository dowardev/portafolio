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
            :error-text="getPlatformError({ index, field: 'name' })"
            :class="{
              'ion-invalid': hasPlatformError({ index, field: 'name' }),
              'ion-touched': touched[index]?.name,
            }"
            @ion-input="updateItem({ index, field: 'name', value: $event.detail.value! })"
            @ion-blur="touchField({ index, field: 'name' })"
          ></ion-input>
        </ion-item>

        <ion-item lines="full">
          <ion-input
            label="Link de la plataforma"
            label-placement="floating"
            :value="platform.url"
            placeholder="https://..."
            :error-text="getPlatformError({ index, field: 'url' })"
            :class="{
              'ion-invalid': hasPlatformError({ index, field: 'url' }),
              'ion-touched': touched[index]?.url,
            }"
            @ion-input="updateItem({ index, field: 'url', value: $event.detail.value! })"
            @ion-blur="touchField({ index, field: 'url' })"
          ></ion-input>
        </ion-item>

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

        <span
          v-if="hasPlatformError({ index, field: 'image' })"
          class="error"
        >
          {{ getPlatformError({ index, field: "image" }) }}
        </span>

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
                  :error-text="getCommentError({
                    platformIndex: index,
                    commentIndex,
                    field: 'title',
                  })"
                  :class="{
                    'ion-invalid': hasCommentError({
                      platformIndex: index,
                      commentIndex,
                      field: 'title',
                    }),
                    'ion-touched': commentTouched[`${index}_${commentIndex}`]?.title,
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

              <ion-item lines="full">
                <ion-input
                  label="Calificación (1-5)"
                  label-placement="floating"
                  type="number"
                  :value="comment.rating"
                  min="1"
                  max="5"
                  :error-text="getCommentError({
                    platformIndex: index,
                    commentIndex,
                    field: 'rating',
                  })"
                  :class="{
                    'ion-invalid': hasCommentError({
                      platformIndex: index,
                      commentIndex,
                      field: 'rating',
                    }),
                    'ion-touched': commentTouched[`${index}_${commentIndex}`]?.rating,
                  }"
                  @ion-input="
                    updateComment({
                      platformIndex: index,
                      commentIndex,
                      field: 'rating',
                      value: parseInt($event.detail.value || '5')
                    })
                  "
                  @ion-blur="touchCommentField({ platformIndex: index, commentIndex, field: 'rating' })"
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
import useVuelidate from "@vuelidate/core";
import {
  required,
  url as urlValidator,
  between,
  helpers,
} from "@vuelidate/validators";
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
const touched = reactive<Record<number, Record<string, boolean>>>({});
const commentTouched = reactive<Record<string, Record<string, boolean>>>({});

const fileNames = reactive<Record<number, string>>({});
const commentFileNames = reactive<Record<string, string>>({});
const isPreviewOpen = ref(false);
const previewSrc = ref<string | null>(null);
// end vars and const

// vuelidate — platform level
const platformRules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      url: {
        required: helpers.withMessage("Link es requerido", required),
        url: helpers.withMessage("Debe ser una URL válida", urlValidator),
      },
      image: {
        required: helpers.withMessage("Logo es requerido", required),
      },
    }),
  },
};

const v$ = useVuelidate(platformRules, {
  items: computed(() => props.modelValue),
});

// vuelidate — comment level (flattened)
interface FlatComment {
  platformIndex: number;
  commentIndex: number;
  title: string;
  rating: number;
}

const flatComments = computed<FlatComment[]>(() => {
  const result: FlatComment[] = [];
  props.modelValue.forEach((platform, pIdx) => {
    platform.comments.forEach((comment, cIdx) => {
      result.push({
        platformIndex: pIdx,
        commentIndex: cIdx,
        title: comment.title,
        rating: comment.rating,
      });
    });
  });
  return result;
});

const commentRules = {
  comments: {
    $each: helpers.forEach({
      title: {
        required: helpers.withMessage("Título es requerido", required),
      },
      rating: {
        required: helpers.withMessage("Calificación es requerida", required),
        between: helpers.withMessage(
          "Calificación debe estar entre 1 y 5",
          between(1, 5),
        ),
      },
    }),
  },
};

const vComments$ = useVuelidate(commentRules, { comments: flatComments });

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return !v$.value.$invalid && !vComments$.value.$invalid;
});
// end vuelidate

// functions
function hasPlatformError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getPlatformError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function touchCommentField(params: {
  platformIndex: number;
  commentIndex: number;
  field: string;
}) {
  const { platformIndex, commentIndex, field } = params;
  const key = `${platformIndex}_${commentIndex}`;
  if (!commentTouched[key]) commentTouched[key] = {};
  commentTouched[key][field] = true;
}

function getFlatCommentIndex(params: {
  platformIndex: number;
  commentIndex: number;
}): number {
  const { platformIndex, commentIndex } = params;
  let flatIdx = 0;
  for (let p = 0; p < platformIndex; p++) {
    flatIdx += props.modelValue[p]?.comments?.length ?? 0;
  }
  return flatIdx + commentIndex;
}

function hasCommentError(params: {
  platformIndex: number;
  commentIndex: number;
  field: string;
}): boolean {
  const { platformIndex, commentIndex, field } = params;
  const key = `${platformIndex}_${commentIndex}`;
  if (!commentTouched[key]?.[field]) return false;
  const flatIdx = getFlatCommentIndex({ platformIndex, commentIndex });
  const errors =
    vComments$.value.comments.$each.$response.$errors[flatIdx]?.[field];
  return errors?.length > 0;
}

function getCommentError(params: {
  platformIndex: number;
  commentIndex: number;
  field: string;
}): string {
  const { platformIndex, commentIndex, field } = params;
  const flatIdx = getFlatCommentIndex({ platformIndex, commentIndex });
  const errors =
    vComments$.value.comments.$each.$response.$errors[flatIdx]?.[field];
  return errors?.[0]?.$message || "";
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
  delete touched[index];
  delete fileNames[index];
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
  const key = `${platformIndex}_${commentIndex}`;
  delete pendingFiles[`freelance_comment_image_${platformIndex}_${commentIndex}`];
  delete commentTouched[key];
  delete commentFileNames[key];
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
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.modal-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}
</style>
