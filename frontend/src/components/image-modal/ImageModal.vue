<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ scalePercent }}%</ion-title>

        <ion-buttons slot="end">
          <ion-button :disabled="scale <= 0.5" @click="zoomOut">
            <ion-icon :icon="removeOutline"></ion-icon>
          </ion-button>
          <ion-button :disabled="scale >= 3" @click="zoomIn">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
          <ion-button @click="resetPosition">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" @wheel="handleWheel">
      <div
        ref="imageContainerRef"
        class="image-container"
        :class="{ dragging: isDragging }"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @dblclick="toggleDoubleZoom"
      >
        <img
          ref="imageRef"
          :src="src"
          alt=""
          :class="{ 'no-transition': isDragging }"
          :style="{
            transform:
              'scale(' +
              scale +
              ') translate(' +
              translateX +
              'px, ' +
              translateY +
              'px)',
          }"
          @load="imageLoaded = true"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { addOutline, closeOutline, refreshOutline, removeOutline } from "ionicons/icons";
import { computed, ref } from "vue";

const props = defineProps<{ src: string }>();

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const imageLoaded = ref(false);
const imageContainerRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const lastTouchDist = ref(0);
const lastTapTime = ref(0);
const dragStart = { x: 0, y: 0 };

const scalePercent = computed(() => Math.round(scale.value * 100));

function closeModal() {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
  modalController.dismiss();
}

function zoomIn() {
  scale.value = Math.min(3, Math.round((scale.value + 0.25) * 100) / 100);
}

function zoomOut() {
  scale.value = Math.max(0.5, Math.round((scale.value - 0.25) * 100) / 100);
}

function resetPosition() {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
}

function handleWheel(event: WheelEvent) {
  if (!event.ctrlKey) return;
  event.preventDefault();

  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  scale.value = Math.max(0.5, Math.min(3, scale.value + delta));
}

function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) return;
  isDragging.value = true;
  dragStart.x = event.clientX - translateX.value;
  dragStart.y = event.clientY - translateY.value;
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return;
  translateX.value = event.clientX - dragStart.x;
  translateY.value = event.clientY - dragStart.y;
}

function handleMouseUp() {
  isDragging.value = false;
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length === 2) {
    lastTouchDist.value = getTouchDist(event);
  }
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length === 2) {
    event.preventDefault();
    const dist = getTouchDist(event);
    const delta = (dist - lastTouchDist.value) / 100;
    scale.value = Math.max(0.5, Math.min(3, scale.value + delta));
    lastTouchDist.value = dist;
  }
}

function handleTouchEnd(event: TouchEvent) {
  if (event.changedTouches.length === 1) {
    const now = Date.now();
    if (now - lastTapTime.value < 300) {
      toggleDoubleZoom();
      lastTapTime.value = 0;
    } else {
      lastTapTime.value = now;
    }
  }
}

function toggleDoubleZoom() {
  scale.value = scale.value === 1 ? 2 : 1;
}

function getTouchDist(event: TouchEvent): number {
  const dx = event.touches[0].clientX - event.touches[1].clientX;
  const dy = event.touches[0].clientY - event.touches[1].clientY;
  return Math.hypot(dx, dy);
}
</script>

<style>
ion-modal.image-modal {
  --width: 85%;
  --height: 85%;
  --max-width: 900px;
  --max-height: 650px;
}
</style>

<style scoped>
ion-content {
  --overflow: hidden;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: grab;
  user-select: none;
}

.image-container.dragging {
  cursor: grabbing;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
  user-select: none;
  -webkit-user-drag: none;
}

.image-container img.no-transition {
  transition: none;
}
</style>
