<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="12">
          <div class="header-content">
            <ion-avatar>
              <img
                alt="Silhouette of a person's head"
                src="@/assets/portafolio/logo_dowar_2.1.png"
              />
            </ion-avatar>

            <ion-button fill="clear">Yo</ion-button>

            <ion-button fill="clear">Experiencia</ion-button>

            <ion-button fill="clear">Proyectos</ion-button>

            <ion-button fill="clear">Colaboración</ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-header>

  <ion-content>
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <h2 style="text-align: center">Hi, I'm Vijay Verma.</h2>

          <p style="text-align: center">
            Right now, I'm focusing on making my own game. I love both design
            and code. Alongside that, I spend time doing contract work,
            illustrating, and building tools and plugins.
          </p>

          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <div>
              <ion-note>CEO QuantumLabs</ion-note>
            </div>

            <div>
              <ion-button fill="clear">
                <ion-icon slot="icon-only" :icon="logoGitlab"></ion-icon>
              </ion-button>

              <ion-button fill="clear">
                <ion-icon slot="icon-only" :icon="logoLinkedin"></ion-icon>
              </ion-button>

              <ion-button fill="clear">
                <ion-icon slot="icon-only" :icon="logoMastodon"></ion-icon>
              </ion-button>

              <ion-button fill="clear">
                <ion-icon slot="icon-only" :icon="chatbox"></ion-icon>
              </ion-button>
            </div>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>

    <!-- projetcs -->
    <svg
      class="wave"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0099ff"
        fill-opacity="1"
        d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>

    <ion-grid style="background: #0099ff">
      <ion-row class="ion-justify-content-center">
        <ion-col size="6">
          <ion-list>
            <ion-list-header>
              <ion-label>Proyectos</ion-label>

              <ion-button>Todos</ion-button>
            </ion-list-header>

            <ion-grid>
              <ion-row>
                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>

                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>

                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>

    <svg
      class="wave"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0099ff"
        fill-opacity="1"
        d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      ></path>
    </svg>

    <!-- skills -->
    <ion-grid class="skills-grid">
      <ion-row class="ion-justify-content-center">
        <ion-col size="8">
          <!-- TODO:implement project filter by technology -->
          <TechCloudBackground
            title="My Skillsets"
            :height="600"
            :main-icons="[
              { name: 'Vue', svg: vueIcon },
              { name: 'Ionic', svg: ionicIcon },
              { name: 'Laravel', svg: laravelIcon },
              { name: 'MariaDb', svg: mariadbIcon },
            ]"
            :icon-size="50"
            :background-techs="[
              { name: 'capacitor' },
              { name: 'javascript' },
              { name: 'CSS' },
              { name: 'TypeScript' },
              { name: 'Linux' },
              { name: 'Pinia' },
            ]"
            bg-color="#ffffff"
            title-color="#000000"
            label-color="var(--ion-text-color-step-400)"
            icon-label-color="#000000"
          />
        </ion-col>
      </ion-row>
    </ion-grid>

    <svg
      class="wave"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0099ff"
        fill-opacity="1"
        d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>

    <!-- experience -->
    <ion-grid style="background: #0099ff">
      <ion-row class="ion-justify-content-center">
        <ion-col size="6">
          <ion-list>
            <ion-list-header>
              <ion-label>Experiencia</ion-label>

              <ion-button>Todos</ion-button>
            </ion-list-header>

            <ion-grid>
              <ion-row>
                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>

                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>

                <ion-col size="4">
                  <ion-card class="shadow1">
                    <img src="../assets/otros/light-wallpaper1.png" />

                    <ion-item lines="none">
                      <ion-label>Poyecto1</ion-label>

                      <ion-label slot="end">2026</ion-label>
                    </ion-item>

                    <div class="ion-padding-start ion-padding-bottom">
                      <ion-note>QuantumStudios</ion-note>
                    </div>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>

    <svg
      class="wave"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0099ff"
        fill-opacity="1"
        d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      ></path>
    </svg>

    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="5">
          <FinalSection v-bind="$props" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonLabel,
} from "@ionic/vue";

import TechCloudBackground from "@/components/common/TechCloudBackground.vue";
import FinalSection from "@/views/presentation/sections/FinalSection.vue";
import type { HomePageData } from "@/services/homeApi";

// declare component props so $props contains the passed template data
const props = defineProps<Partial<HomePageData>>();
import {
  chatbox,
  logoGitlab,
  logoLinkedin,
  logoMastodon,
} from "ionicons/icons";
import vueIcon from "@/assets/otros/vue-js-1.svg";
import mariadbIcon from "@/assets/otros/mariadb-icon.svg";
import ionicIcon from "@/assets/otros/ionicframework-icon.svg";
import laravelIcon from "@/assets/otros/laravel-2.svg";
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.tech-cloud-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.skills-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.section-title {
  color: #cfcfcf;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 16px 0;
}

/* Wave SVG helpers to control height and remove gaps */
.wave {
  display: block; /* remove inline gap */
  width: 100%;
  height: 120px; /* adjust this to taste (try 80-140px) */
  line-height: 0; /* prevent extra inline spacing */
  margin: 0;
  padding: 0;
}

.wave.invert {
  transform: scaleY(-1);
}

/* Pull the skills section up to sit closer to the lower wave */
.skills-grid {
  margin-top: -8px; /* adjust -4px..-12px if you want it closer/further */
}

/* ion-content { */
/*   --background: #191919; */
/* } */
</style>
