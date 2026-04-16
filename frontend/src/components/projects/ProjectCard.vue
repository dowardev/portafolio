<template>
  <div class="flip-card" :class="{ 'is-flipped': isFlipped }">
    <div class="flip-card-face flip-card-front">
      <ion-card class="shadow1 project-card">
        <img class="project-header-img" :src="project.img" alt="" />

        <div style="display: flex; justify-content: center">
          <ion-chip
            :color="
              project.status === 'finished'
                ? 'success'
                : project.status === 'indeterminate'
                  ? 'warning'
                  : project.status === 'progress'
                    ? 'primary'
                    : ''
            "
          >
            {{
              project.status === "progress"
                ? "En progreso"
                : project.status === "indeterminate"
                  ? "Indeterminado"
                  : "Terminado"
            }}
          </ion-chip>
        </div>

        <ion-item lines="none">
          <ion-label>{{ project.title }}</ion-label>
          <ion-label slot="end">{{ project.date }}</ion-label>
        </ion-item>

        <div class="ion-padding-start ion-padding-bottom">
          <ion-note>{{ project.source.name }}</ion-note>
        </div>

        <ion-row>
          <ion-col size="10" style="display: flex">
            <div
              v-for="(tech, techIndex) in project.technologies"
              :key="techIndex"
              style="display: flex; align-items: center; margin-right: 10px"
            >
              <img
                v-if="tech.type === 'img'"
                v-tooltip="{ content: tech.name, trigger: 'click' }"
                :src="tech.source"
                :alt="tech.name"
                :style="{ width: tech.size }"
              />
              <ion-icon
                v-if="tech.type === 'icon'"
                v-tooltip="{ content: tech.name, trigger: 'click' }"
                :icon="getIconByName(tech.source)"
                :style="{
                  fontSize: tech.size,
                  color: getIconColorByName(tech.name),
                }"
              ></ion-icon>
            </div>
          </ion-col>
        </ion-row>

        <div class="flip-btn-container">
          <button class="flip-btn" @click="toggleFlip">
            <ion-icon :icon="ionicons.informationCircleOutline"></ion-icon>
            Detalles
          </button>
        </div>
      </ion-card>
    </div>

    <div class="flip-card-face flip-card-back">
      <ion-card class="shadow1 flip-card-card-back">
        <h2 class="back-title">{{ project.title }}</h2>
        <p class="project-description">{{ project.details.description }}</p>

        <div class="back-buttons">
          <a
            v-if="project.details.website"
            :href="project.details.website"
            target="_blank"
            class="project-link-btn"
            @click.stop
          >
            <ion-icon :icon="ionicons.openOutline"></ion-icon>
            Ver Proyecto
          </a>
          <button
            v-else
            class="project-link-btn project-link-btn-disabled"
            disabled
          >
            <ion-icon :icon="ionicons.openOutline"></ion-icon>
            Ver Proyecto
          </button>

          <button class="flip-btn" @click="toggleFlip">
            <ion-icon :icon="ionicons.arrowBackOutline"></ion-icon>
            Volver
          </button>
        </div>
      </ion-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonRow,
  IonCol,
  IonLabel,
  IonNote,
  IonChip,
  IonItem,
  IonIcon,
} from "@ionic/vue";
import { ref } from "vue";
import * as ionicons from "ionicons/icons";
import type { ProjectItem } from "@/services/homeApi";
import { vTooltip } from "@/directives/tooltip";

const props = withDefaults(
  defineProps<{
    project: ProjectItem;
    flipped?: boolean;
  }>(),
  {
    flipped: false,
  },
);

const isFlipped = ref(props.flipped);

function toggleFlip() {
  isFlipped.value = !isFlipped.value;
}

function getIconByName(source: string) {
  if (!source) return ionicons.helpCircleOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
}

function getIconColorByName(name: string) {
  const colors: { [key: string]: string } = {
    Ionic: "#3356c7",
    Vue: "#41b883",
    Laravel: "#ff2819",
    Firebase: "#ffca28",
    Capacitorjs: "#119eff",
    Electronjs: "#47848f",
    Web: "#3356c7",
    Linux: "#000000",
    PWA: "#5905c8",
    Android: "#44ac5a",
    Windows: "#0078d4",
  };
  return colors[name] || "";
}
</script>

<style scoped>
.flip-card {
  width: 100%;
  height: 420px;
  perspective: 1000px;
  margin-bottom: 16px;
  position: relative;
}

.flip-card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0.6s ease;
}

.project-card {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}

.project-header-img {
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  display: block;
}

.flip-card-card-back {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  box-sizing: border-box;
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}

.flip-card.is-flipped .flip-card-front {
  transform: rotateY(-180deg);
}

.flip-card.is-flipped .flip-card-back {
  transform: rotateY(0deg);
}

.flip-btn-container {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.flip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--ion-color-primary, #3880ff);
  background: transparent;
  color: var(--ion-color-primary, #3880ff);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.flip-btn:hover {
  background: var(--ion-color-primary, #3880ff);
  color: #fff;
}

.back-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--ion-text-color, #000);
}

.project-description {
  color: var(--ion-text-color, #333);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  line-clamp: 6;
  overflow: hidden;
}

.back-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.project-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--ion-color-primary, #3880ff);
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.project-link-btn:hover {
  opacity: 0.85;
}

.project-link-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
