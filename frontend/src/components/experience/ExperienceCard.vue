<template>
  <div class="flip-card" :class="{ 'is-flipped': isFlipped, 'is-ios': isIOS }">
    <div class="flip-card-face flip-card-front">
      <ion-card class="shadow1 experience-card">
        <div>
          <ion-item lines="full">
            <ion-thumbnail slot="start">
              <img v-if="experience.img" :src="experience.img" alt="" />

              <img
                v-else
                src="../../assets/otros/light-wallpaper1.png"
                class="experience-header-img"
                alt=""
              />
            </ion-thumbnail>

            <ion-label>{{ experience.title || "Sin título" }}</ion-label>
          </ion-item>

          <ion-item lines="full">
            <ion-icon slot="start" :icon="calendarOutline"></ion-icon>

            <ion-label>{{
              formatDate(experience.startDate, experience.endDate)
            }}</ion-label>
          </ion-item>

          <ion-grid>
            <ion-row>
              <ion-col
                class="ion-padding-start ion-padding-top ion-padding-bottom tech-col"
              >
                <div style="display: flex; gap: 6px">
                  <template
                    v-for="(tech, techIndex) in experience.technologies"
                    :key="techIndex"
                  >
                    <IconRenderer
                      v-tooltip="{
                        content: getTechLabel(tech.iconName),
                        trigger: 'mouseenter',
                        touch: 'hold',
                      }"
                      :name="tech.iconName"
                      :color="getIconColor(tech.iconName)"
                      size="18px"
                    />
                  </template>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div class="card-footer">
          <ion-button expand="block" @click="toggleFlip">
            <ion-icon slot="start" :icon="informationCircleOutline"></ion-icon>
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
            <ion-icon :icon="arrowBackOutline"></ion-icon>
            Volver
          </ion-button>
        </div>
      </ion-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonThumbnail,
  isPlatform,
} from "@ionic/vue";
import { ref } from "vue";
import type { ExperienceItem } from "@/services/types";
import { vTooltip } from "@/directives/tooltip";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useIconColors } from "@/composables/useIconColors";
import {
  arrowBackOutline,
  calendarOutline,
  informationCircleOutline,
  helpCircleOutline,
} from "ionicons/icons";
import { getIconByName as getUnifiedIcon, getIonIconSvg } from "@/utils/iconsIndex";
import IconRenderer from "@/components/IconRenderer.vue";

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
const isIOS = isPlatform("ios");

function toggleFlip() {
  isFlipped.value = !isFlipped.value;
}

function getIconByName(source: string) {
  if (!source) return helpCircleOutline;
  const iconData = getUnifiedIcon(source);
  if (!iconData) return helpCircleOutline;
  
  if (iconData.source === "lineicons") {
    return iconData.icon;
  }
  
  const svgIcon = getIonIconSvg(source);
  return svgIcon || helpCircleOutline;
}

function getTechLabel(iconName: string): string {
  const labels: Record<string, string> = {
    logoVue: "Vue.js",
    logoReact: "React",
    logoAngular: "Angular",
    logoNodejs: "Node.js",
    logoPython: "Python",
    logoJavascript: "JavaScript",
    logoHtml5: "HTML5",
    logoCss3: "CSS3",
    logoSass: "Sass",
    logoLaravel: "Laravel",
    logoIonic: "Ionic",
    logoFirebase: "Firebase",
    logoGithub: "GitHub",
    logoGitlab: "GitLab",
    logoNpm: "NPM",
    logoDocker: "Docker",
    logoAndroid: "Android",
    logoApple: "Apple",
    logoWindows: "Windows",
    logoTux: "Linux",
    logoGoogle: "Google",
    logoLinkedin: "LinkedIn",
    logoTwitter: "Twitter",
    logoFacebook: "Facebook",
    logoInstagram: "Instagram",
    logoYoutube: "YouTube",
    logoTiktok: "TikTok",
    logoDiscord: "Discord",
    logoSlack: "Slack",
    logoWordpress: "WordPress",
    logoStackoverflow: "Stack Overflow",
    logoChrome: "Chrome",
    logoFirefox: "Firefox",
    logoEdge: "Edge",
    compassOutline: "Safari",
    logoMicrosoft: "Microsoft",
    logoAmazon: "AWS",
    logoCapacitor: "Capacitor",
    logoElectron: "Electron",
    codeSlashOutline: "PHP",
    terminalOutline: "Terminal",
    gitBranchOutline: "Git",
    serverOutline: "Servidor",
    cloudOutline: "Cloud",
    hardwareChipOutline: "Hardware",
  };
  return labels[iconName] || iconName;
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

.flip-card.is-ios {
  height: 296px;
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
