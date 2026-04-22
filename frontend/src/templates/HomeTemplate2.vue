<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
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

                <ion-button
                  fill="clear"
                  class="nav-btn"
                  :class="{ active: activeSection === 'section-yo' }"
                  @click="scrollToSection('section-yo')"
                >
                  Yo
                </ion-button>

                <ion-button
                  fill="clear"
                  class="nav-btn"
                  :class="{ active: activeSection === 'section-proyectos' }"
                  @click="scrollToSection('section-proyectos')"
                >
                  Proyectos
                </ion-button>

                <ion-button
                  fill="clear"
                  class="nav-btn"
                  :class="{ active: activeSection === 'section-skills' }"
                  @click="scrollToSection('section-skills')"
                >
                  Skills
                </ion-button>

                <ion-button
                  fill="clear"
                  class="nav-btn"
                  :class="{ active: activeSection === 'section-experiencia' }"
                  @click="scrollToSection('section-experiencia')"
                >
                  Experiencia
                </ion-button>

                <ion-button
                  fill="clear"
                  class="nav-btn"
                  :class="{ active: activeSection === 'section-colaboracion' }"
                  @click="scrollToSection('section-colaboracion')"
                >
                  Colaboración
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef">
      <!-- profile -->
      <ion-grid id="section-yo">
        <ion-row style="height: 80dvh" class="ion-justify-content-center">
          <ion-col
            class="ion-justify-content-center"
            size="12"
            size-lg="4"
            style="display: flex; flex-direction: column"
          >
            <h2 style="text-align: center">Hola, Soy {{ name }}.</h2>

            <p style="text-align: center">
              {{ description }}
            </p>

            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <div style="display: flex">
                <ion-chip v-for="tag in tags" :key="tag" color="primary">{{
                  tag
                }}</ion-chip>
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

      <!-- projects -->
      <ion-grid id="section-proyectos" style="background: #0099ff">
        <ion-row class="projects-row ion-justify-content-center">
          <ion-col
            class="ion-justify-content-center"
            size="12"
            size-lg="8"
            style="display: flex; flex-direction: column"
          >
            <div
              class="ion-padding-bottom"
              style="display: flex; justify-content: center"
            >
              <h2 style="font-size: 34px; color: var(--ion-color-light)">
                Proyectos mas recientes
              </h2>
            </div>

            <ion-list>
              <ion-list-header>
                <ion-label>Proyectos</ion-label>

                <ion-button @click="router.push('/home/portfolio')"
                  >Todos</ion-button
                >
              </ion-list-header>

              <ion-grid>
                <ion-row>
                  <ion-col
                    v-for="project in props.projects?.slice(0, 3)"
                    :key="project.title"
                    size="12"
                    size-lg="4"
                  >
                    <ProjectCard :project="project" />
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
      <ion-grid id="section-skills" class="skills-grid">
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-lg="8">
            <!-- TODO:implement project filter by technology -->
            <TechCloudBackground
              title="My Skillsets"
              :height="isMobile ? 350 : 600"
              :main-icons="[
                { name: 'Vue', svg: vueIcon },
                { name: 'Ionic', svg: ionicIcon },
                { name: 'Laravel', svg: laravelIcon },
                { name: 'MariaDb', svg: mariadbIcon },
              ]"
              :icon-size="isMobile ? 36 : 50"
              :background-techs="filteredBackgroundTechs"
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
      <ion-grid id="section-experiencia" style="background: #0099ff">
        <ion-row class="experience-row ion-justify-content-center">
          <ion-col
            class="ion-justify-content-center"
            size="12"
            size-lg="8"
            style="display: flex; flex-direction: column"
          >
            <div
              class="ion-padding-bottom"
              style="display: flex; justify-content: center"
            >
              <h2 style="font-size: 34px; color: var(--ion-color-light)">
                Experiencias
              </h2>
            </div>

            <ion-list>
              <ion-list-header>
                <ion-label>Experiencia</ion-label>

                <ion-button @click="router.push('/home/experience')"
                  >Todos</ion-button
                >
              </ion-list-header>

              <ion-grid>
                <ion-row>
                  <ion-col
                    v-for="exp in props.experience?.slice(0, 3)"
                    :key="exp.title"
                    size="12"
                    size-lg="4"
                  >
                    <ExperienceCard :experience="exp" />
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

      <ion-grid id="section-colaboracion">
        <ion-row style="height: 80dvh" class="ion-justify-content-center">
          <ion-col
            class="ion-justify-content-center"
            size="5"
            style="display: flex; flex-direction: column"
          >
            <FinalSection v-bind="$props" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- <ion-footer> -->
    <!--   <div class="ion-padding-start"> -->
    <!--     <p> -->
    <!--       <a href="https://gitlab.com/dowardev/portafolio" target="_blank" -->
    <!--         >Código fuente</a -->
    <!--       > -->
    <!--       bajo la licencia gpl-3.0. -->
    <!--     </p> -->
    <!--   </div> -->
    <!-- </ion-footer> -->
  </ion-page>
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
  IonIcon,
  IonPage,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";

import TechCloudBackground from "@/components/common/TechCloudBackground.vue";
import FinalSection from "@/views/presentation/sections/FinalSection.vue";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import ExperienceCard from "@/components/experience/ExperienceCard.vue";
import type { HomePageData } from "@/services/types";
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

const router = useRouter();
const props = defineProps<Partial<HomePageData>>();

const contentRef = ref();
const activeSection = ref("section-yo");
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value <= 576);

const backgroundTechs = [
  { name: "capacitor" },
  { name: "javascript" },
  { name: "CSS" },
  { name: "TypeScript" },
  { name: "Linux" },
  { name: "Pinia" },
];

const filteredBackgroundTechs = computed(() => backgroundTechs);

const sections = [
  { id: "section-yo" },
  { id: "section-proyectos" },
  { id: "section-skills" },
  { id: "section-experiencia" },
  { id: "section-colaboracion" },
];

let observer: IntersectionObserver | null = null;

const scrollToSection = async (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    activeSection.value = sectionId;
  }
};

const setupIntersectionObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      let topSection: IntersectionObserverEntry | null = null;
      let minTop = Infinity;

      for (const entry of entries) {
        const rect = (entry.target as HTMLElement).getBoundingClientRect();
        const sectionTop = rect.top;

        if (sectionTop >= 0 && sectionTop < minTop) {
          minTop = sectionTop;
          topSection = entry;
        }
      }

      if (topSection) {
        activeSection.value = topSection.target.id;
      }
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-10% 0px -50% 0px",
    },
  );

  sections.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer?.observe(el);
  });
};

const onResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  setTimeout(setupIntersectionObserver, 100);
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.nav-btn {
  position: relative;
}

.nav-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 100%;
  height: 2px;
  background: var(--ion-color-primary, #0099ff);
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.nav-btn.active::after {
  transform: translateX(-50%) scaleX(1);
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

.tech-icon {
  margin: 2px;
}

.wave.invert {
  transform: scaleY(-1);
}

/* Pull the skills section up to sit closer to the lower wave */
.skills-grid {
  margin-top: -8px; /* adjust -4px..-12px if you want it closer/further */
}

.projects-row,
.experience-row {
  height: 124dvh;
}

@media (min-width: 992px) {
  .projects-row,
  .experience-row {
    height: 64dvh;
  }
}

@media (max-width: 576px) {
  .skills-grid {
    padding: 0 8px;
  }
}

/* ion-content { */
/*   --background: #191919; */
/* } */
</style>
