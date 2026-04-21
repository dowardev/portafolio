<template>
  <div class="flip-card" :class="{ 'is-flipped': isFlipped }">
    <div class="flip-card-face flip-card-front">
      <ion-card class="shadow1 experience-card">
        <div>
          <ion-item lines="full">
            <ion-thumbnail slot="start">
              <img v-if="project.img" :src="project.img" alt="" />

              <img
                v-else
                src="../assets/otros/light-wallpaper1.png"
                class="project-header-img"
                alt=""
              />
            </ion-thumbnail>

            <ion-label>
              <h2>{{ project.title }}</h2>

              <ion-text :color="getStatusColor(project.status)">
                {{ getStatusText(project.status) }}
              </ion-text>
            </ion-label>
          </ion-item>

          <ion-item lines="full">
            <ion-icon slot="start" :icon="briefcaseOutline"></ion-icon>

            <ion-label
              v-tooltip="{
                content: project.source.name,
                trigger: 'mouseenter',
                touch: 'hold',
              }"
              class="truncate-source-name"
            >
              {{ project.source.name }}
            </ion-label>
          </ion-item>

          <ion-grid>
            <ion-row>
              <ion-col
                class="ion-padding-start ion-padding-top ion-padding-bottom tech-col"
              >
                <div style="display: flex; gap: 6px">
                  <template
                    v-for="(tech, techIndex) in project.technologies"
                    :key="techIndex"
                  >
                    <ion-icon
                      v-tooltip="{
                        content: getTechLabel(tech.iconName),
                        trigger: 'mouseenter',
                        touch: 'hold',
                      }"
                      :icon="getIconByName(tech.iconName)"
                      :style="{
                        color: getIconColor(tech.iconName),
                      }"
                      style="font-size: 18px"
                    ></ion-icon>
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
          <h2 class="back-title">{{ project.title }}</h2>

          <div class="back-description">
            <p>
              {{ project.details.description }}
            </p>
          </div>
        </ion-card-content>

        <div class="card-footer">
          <ion-button
            fill="outline"
            class="btn-footer-left"
            @click="toggleFlip"
          >
            <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
            Volver
          </ion-button>

          <ion-button
            v-if="project.details.website"
            class="btn-footer-right"
            :href="project.details.website"
            target="_blank"
          >
            <ion-icon slot="start" :icon="openOutline"></ion-icon>
            Ver Proyecto
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
  IonText,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";
import type { ProjectItem } from "@/services/types";
import { vTooltip } from "@/directives/tooltip";
import { useIconColors } from "@/composables/useIconColors";
import * as ionicons from "ionicons/icons";
import {
  arrowBackOutline,
  briefcaseOutline,
  informationCircleOutline,
  openOutline,
} from "ionicons/icons";

const { getIconColor } = useIconColors();

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

function getStatusText(status: string) {
  if (status === "progress") return "En progreso";
  if (status === "indeterminate") return "Indeterminado";
  return "Terminado";
}

function getStatusColor(status: string) {
  if (status === "finished") return "success";
  if (status === "indeterminate") return "warning";
  if (status === "progress") return "primary";
  return "medium";
}
</script>

<style scoped>
.flip-card {
  width: 100%;
  height: 259px;
  perspective: 1000px;
  margin-bottom: 16px;
  position: relative;
}

.flip-card-face {
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

.flip-card-face > ion-card,
.flip-card-face > .experience-card {
  flex: 1 1 auto;
}

.project-header-img {
  width: 100%;
  max-height: 140px;
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

.card-footer {
  margin-top: auto;
}

.flip-card-back .card-footer {
  display: flex;
}

.card-footer ion-button {
  --border-radius: 0;
  margin: 0;
}

.truncate-source-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  display: block;
}

.btn-footer-left {
  flex: 0 0 auto;
}

.btn-footer-right {
  flex: 1;
}

.back-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--ion-text-color, #000);
}

.experience-card {
  display: flex;
  flex-direction: column;
}

.flip-card-back ion-card-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.flip-card-back ion-card-content > div {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.back-description {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 8px;
}

.btn-footer-left {
  flex: 0 0 auto;
}

.btn-footer-right {
  flex: 1;
}
</style>
