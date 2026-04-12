<template>
  <div class="content-container" style="height: 100%">
    <!-- menu options -->
    <ion-row>
      <ion-col>
        <!-- undo -->
        <ion-button fill="clear" :disabled="!canUndo" @click="undo">
          <ion-icon :icon="arrowUndoOutline"></ion-icon>
        </ion-button>

        <!-- redo -->
        <ion-button fill="clear" :disabled="!canRedo" @click="redo">
          <ion-icon :icon="arrowRedoOutline"></ion-icon>
        </ion-button>

        <!-- insert image -->
        <ion-button fill="clear" @click="isModalUploadImageOpen = true">
          <ion-icon :icon="imageOutline"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>

    <!-- content -->
    <ion-row style="height: 100%">
      <ion-col style="height: 90%">
        <div
          ref="editorRef"
          contenteditable="true"
          style="
            padding: 10px;
            white-space: pre-wrap;
            max-height: 100%;
            overflow: auto;
          "
          @input="handleInput"
          @keydown.ctrl.z.prevent="undo"
          @keydown.ctrl.y.prevent="redo"
          @blur="handleBlur"
          @focus="isFocused = true"
          v-html="content"
        ></div>
      </ion-col>
    </ion-row>

    <!-- modals -->
    <ion-modal
      :is-open="isModalUploadImageOpen"
      @ion-modal-did-dismiss="isModalUploadImageOpen = false"
    >
      <ion-header mode="ios" class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="isModalUploadImageOpen = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>Subir imagen</ion-title>

          <ion-buttons slot="end">
            <ion-button @click="($refs as any).inputPostCover.click()">
              Seleccionar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-row
          style="display: flex; height: 100%"
          class="ion-align-items-center"
          :class="{ hover: isDragging }"
          @dragenter="handleDragEnter"
          @dragover="handleDragOver({ event: $event })"
          @dragleave="handleDragLeave()"
          @drop="handleDrop({ event: $event })"
        >
          <ion-col size="12">
            <ion-row
              style="display: flex"
              class="ion-justify-content-center ion-align-items-center"
            >
              <ion-col size="auto">
                <img style="height: 200px" :src="UploadImage" alt="" />
              </ion-col>
            </ion-row>

            <ion-row
              style="display: flex"
              class="ion-justify-content-center ion-align-items-center"
            >
              <ion-col size="auto"> Arrastra o selecciona una imagen </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-content>
    </ion-modal>

    <!-- others -->
    <input
      ref="inputPostCover"
      style="display: none"
      accept="image/*"
      type="file"
      @change="handleSelectFile({ file: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  arrowRedoOutline,
  arrowUndoOutline,
  closeOutline,
  imageOutline,
  saveOutline,
} from "ionicons/icons";

// vars
const props = defineProps<{ content: string }>();
const emits = defineEmits(["image-upload", "update-content"]);
const editorRef = ref<HTMLElement | null>(null);
const history = ref<string[]>([]);
const currentIndex = ref(-1);
const maxHistory = 100;
const imageFile = ref<File | null>(null);
const isFocused = ref(false);
const isModalUploadImageOpen = ref(false);
const isDragging = ref(false);
// images
import UploadImage from "@/assets/otros/upload.svg";

// computed
const canUndo = computed(() => currentIndex.value > 0);
const canRedo = computed(() => currentIndex.value < history.value.length - 1);

// functions
function handleInput() {
  const content = editorRef.value?.innerHTML || "";
  currentIndex.value++;
  history.value.splice(currentIndex.value);
  history.value.push(content);

  if (history.value.length > maxHistory) {
    history.value.shift();
    currentIndex.value--;
  }
}

function undo() {
  if (canUndo.value && editorRef.value) {
    currentIndex.value--;
    editorRef.value.innerHTML = history.value[currentIndex.value];
  }
}

function redo() {
  if (canRedo.value && editorRef.value) {
    currentIndex.value++;
    editorRef.value.innerHTML = history.value[currentIndex.value];
  }
}

function handleSelectFile(params: { file: Event }) {
  const { file: element } = params;
  const input = element.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    imageFile.value = file;
    emits("image-upload", file);
    isModalUploadImageOpen.value = false;
  }
}

function handleBlur() {
  isFocused.value = false;
  const content = editorRef.value?.innerHTML || "";

  const markdownContent = content
    .replace(/<div><br><\/div>/gi, "\n\n")
    .replace(/<div>/gi, "\n")
    .replace(/<\/div>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  emits("update-content", markdownContent);
}

function handleDragEnter() {
  isDragging.value = true;
}

function handleDragOver(params: { event: DragEvent }) {
  const { event } = params;
  event.preventDefault();
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(params: { event: DragEvent }) {
  const { event } = params;
  event.preventDefault();
  isDragging.value = false;
  const dataTransfer = event.dataTransfer;
  if (dataTransfer) {
    const file = dataTransfer.files;
    emits("image-upload", file[0]);
    isModalUploadImageOpen.value = false;
  }
}
</script>
