<template>
  <div class="flip-card" :class="{ 'is-flipped': isFlipped }">
    <div class="flip-card-face flip-card-front">
      <ion-card class="shadow1 experience-card">
        <div>
          <ion-item lines="full">
            <ion-thumbnail slot="start">
              <img v-if="experience.img" :src="experience.img" alt="" />

              <img
                v-else
                src="../assets/otros/light-wallpaper1.png"
                class="experience-header-img"
                alt=""
              />
            </ion-thumbnail>

            <ion-label>{{ experience.title || "Sin título" }}</ion-label>
          </ion-item>

          <ion-item lines="full">
            <ion-label>{{
              formatDate(experience.startDate, experience.endDate)
            }}</ion-label>
          </ion-item>

          <ion-grid>
            <ion-row>
              <ion-col
                class="ion-padding-start ion-padding-top ion-padding-bottom tech-col"
              >
                <template
                  v-for="(tech, techIndex) in experience.technologies"
                  :key="techIndex"
                >
                  <img
                    v-if="tech.type === 'img'"
                    v-tooltip="{
                      content: tech.name,
                      trigger: 'mouseenter',
                      touch: 'hold',
                    }"
                    :src="tech.source"
                    :alt="tech.name"
                    :style="{ width: tech.size }"
                  />

                  <ion-icon
                    v-if="tech.type === 'icon'"
                    v-tooltip="{
                      content: tech.name,
                      trigger: 'mouseenter',
                      touch: 'hold',
                    }"
                    :icon="getIconByName(tech.source)"
                    :style="{
                      fontSize: tech.size,
                      color: getIconColor(tech.source),
                    }"
                  ></ion-icon>
                </template>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div class="card-footer">
          <ion-button expand="block" @click="toggleFlip">
            <ion-icon
              slot="start"
              :icon="ionicons.informationCircleOutline"
            ></ion-icon>
            Detalles
          </ion-button>
        </div>
      </ion-card>
    </div>

    <div class="flip-card-face flip-card-back">
      <ion-card class="shadow1 experience-card">
        <ion-card-content>
          <div>
            <h2 class="back-title">{{ experience.title }}</h2>

            <div class="back-description">
              <p>
                {{ experience.details?.description }}
              </p>
            </div>
          </div>
        </ion-card-content>

        <div class="card-footer">
          <ion-button expand="block" @click="toggleFlip">
            <ion-icon :icon="ionicons.arrowBackOutline"></ion-icon>
            Volver
          </ion-button>
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
  IonItem,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";
import * as ionicons from "ionicons/icons";
import type { ExperienceItem } from "@/services/homeApi";
import { vTooltip } from "@/directives/tooltip";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useIconColors } from "@/composables/useIconColors";

const { getIconColor } = useIconColors();

const props = withDefaults(
  defineProps<{
    experience: ExperienceItem;
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

function formatDate(start: string, end?: string): string {
  if (!start) return "";
  try {
    const capitalize = (s: string) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    const startDate = parseISO(start);
    if (!isValid(startDate)) return start;
    const startFormatted = capitalize(
      format(startDate, "MMMM yyyy", { locale: es }),
    );

    if (!end) return `${startFormatted} - Actual`;

    const endDate = parseISO(end);
    if (!isValid(endDate)) return `${startFormatted} - ${end}`;
    const endFormatted = capitalize(
      format(endDate, "MMMM yyyy", { locale: es }),
    );

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return start;
  }
}
</script>

<style scoped>
.flip-card {
  width: 100%;
  height: 254px;
  perspective: 1000px;
  margin-bottom: 16px;
  position: relative;
}

.flip-card-face {
  /* Keep in-flow, use flex so children can stretch uniformly */
  display: flex;
  flex-direction: column;
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

.experience-card {
  display: flex;
  flex-direction: column;
}

/* Ensure the ion-card inside each face fills the face and allows footer to stick to bottom */
.flip-card-face > ion-card,
.flip-card-face > .experience-card {
  flex: 1 1 auto;
}

.experience-header-img {
  width: 100%;
  max-height: 140px;
  object-fit: contain;
  display: block;
}

.tech-col {
  display: flex;
  align-items: center;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card.is-flipped .flip-card-front {
  transform: rotateY(-180deg);
}

.flip-card.is-flipped .flip-card-back {
  transform: rotateY(0deg);
}

.card-footer {
  margin-top: auto;
}

.card-footer ion-button {
  --border-radius: 0;
  margin: 0;
}

.flip-btn-container,
.back-buttons {
  display: contents;
}

.back-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--ion-text-color, #000);
}

/* Layout parent: permite que el contenido interno se encoja dentro del card */
.flip-card-back ion-card-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

/* Asegura que el wrapper directo dentro de ion-card-content reparta el espacio
   y permita que .back-description se encoja y muestre el scrollbar. */
.flip-card-back ion-card-content > div {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

/* Área desplazable específica para la descripción trasera */
.back-description {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 8px;
}
</style>
