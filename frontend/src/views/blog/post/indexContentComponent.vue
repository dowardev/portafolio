<template>
  <div
    :class="{
      indexContent: props.autoHideContent,
    }"
  >
    <ion-item class="transparent">
      <ion-label>Contenido</ion-label>
    </ion-item>

    <div
      v-if="props.autoHideContent == true"
      style="display: flex; opacity: 0.5"
      class="ion-padding-start"
    >
      <div
        style="
          margin-right: 16px;
          display: flex;
          align-content: center;
          align-items: center;
        "
      >
        <ion-icon :icon="alertCircleOutline"></ion-icon>
      </div>

      <div style="display: flex; align-content: center; align-items: center">
        <ion-label>Pasa el mouse por encima</ion-label>
      </div>
    </div>

    <div
      id="indexContent"
      ref="indexContainer"
      style="overflow: auto; height: 70vh"
      class="ion-padding-start"
    >
      <div
        v-for="element in indexContent"
        :key="element.id"
        :data-section-id="element.id"
        :class="{
          'active-section': activeSection === element.id,
          h3Button: element.type === 'h3',
          h4Button: element.type === 'h4',
          h5Button: element.type === 'h5',
          h6Button: element.type === 'h6',
        }"
        style="margin-bottom: 10px"
      >
        <div>
          <span
            style="cursor: pointer"
            @click="goToSection({ id: element.id })"
            >{{ element.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { alertCircleOutline } from "ionicons/icons";
import { ref, onMounted, onUnmounted, watch } from "vue";

// vars
const props = defineProps({
  indexContent: {
    type: Array<{ id: string; type: string; name: string }>,
    default: [],
  },
  autoHideContent: { type: Boolean, default: true },
});
const emits = defineEmits(["elementId"]);
const activeSection = ref("");
const indexContainer = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;

onMounted(() => {
  observer = createObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

watch(
  () => props.indexContent,
  () => {
    observer = createObserver();
  }
);

function createObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActiveSection(entry.target.id);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-10% 0px -70% 0px",
    }
  );

  setTimeout(() => {
    props.indexContent.forEach((element) => {
      const target = document.getElementById(element.id);
      if (target) {
        observer.observe(target);
      }
    });
  }, 100);

  return observer;
}

function updateActiveSection(id: string) {
  activeSection.value = id;
  scrollActiveSectionIntoView();
}

function scrollActiveSectionIntoView() {
  if (!indexContainer.value) return;

  const activeElement = indexContainer.value.querySelector(".active-section");
  if (!activeElement) return;

  const container = indexContainer.value;
  const elementRect = activeElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Calculate if element is in view
  const isInView =
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom;

  if (!isInView) {
    // Add padding to avoid edge positioning
    const padding = 10;
    const scrollTop = activeElement.offsetTop - container.offsetTop - padding;

    container.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }
}

function goToSection(params: { id: string }) {
  const id = params.id;
  updateActiveSection(id);
  emits("elementId", id);
}
</script>

<style scoped>
.indexContent > #indexContent {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  word-wrap: break-word;
}

.indexContent:hover #indexContent {
  opacity: 1;
}

.hidde-scroll::-webkit-scrollbar {
  display: none;
}

.h3Button {
  margin-left: 10px;
}

.h4Button {
  margin-left: 15px;
}

.h5Button {
  margin-left: 20px;
}

.h6Button {
  margin-left: 25px;
}

.active-section {
  color: var(--ion-color-primary);
  font-weight: bold;
  position: relative;
}

.active-section::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 100%;
  background-color: var(--ion-color-primary);
  border-radius: 2px;
}
</style>
