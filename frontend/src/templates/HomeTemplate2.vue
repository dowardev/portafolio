<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12">
              <div class="header-content">
                <div
                  class="avatar-container"
                  :class="{
                    'avatar-visible': showAvatar,
                    'avatar-hidden': !showAvatar,
                  }"
                >
                  <ion-avatar>
              <img
                  alt="Logo"
                  :src="introData?.logoUrl || defaultLogo"
                />
                  </ion-avatar>
                </div>

                <div
                  ref="menuContainerRef"
                  class="menu-scroll"
                  :style="{
                    display: 'flex',
                    width: buttonsWidth,
                    overflow: 'auto',
                  }"
                >
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
                    :class="{ active: activeSection === 'section-categories' }"
                    @click="scrollToSection('section-categories')"
                  >
                    Categorías
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
                    :class="{
                      active: activeSection === 'section-colaboracion',
                    }"
                    @click="scrollToSection('section-colaboracion')"
                  >
                    Colaboración
                  </ion-button>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef" scroll-events @ion-scroll="handleScroll">
      <!-- profile -->
      <div id="section-yo" class="hero-section">
        <ion-grid class="hero-content">
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col
              class="ion-justify-content-center"
              size="12"
              size-lg="10"
              style="display: flex; flex-direction: column"
            >
              <div class="profile-photo-container scale-in-item" :class="{ 'is-visible': heroReady }" style="--delay: 0ms">
                <div class="gradient-ring">
                  <ion-avatar class="profile-avatar">
            <img
                  alt="Foto de perfil"
                  :src="introData?.photoUrl || defaultPhoto"
                />
                  </ion-avatar>
                </div>
              </div>

              <h2 class="hero-title scale-in-item" :class="{ 'is-visible': heroReady }" style="--delay: 150ms">
                <span class="typing-text">{{ typedGreeting }}</span>
                <span class="cursor">|</span>
              </h2>

              <p class="hero-description scale-in-item" :class="{ 'is-visible': heroReady }" style="--delay: 300ms">
                {{ introData?.description }}
              </p>

              <div
                class="tags-container scale-in-item"
                :class="{ 'is-visible': heroReady }"
                style="--delay: 450ms"
              >
                <ion-chip
                  v-for="tag in safeTags"
                  :key="tag.id || tag.name"
                  color="primary"
                  class="tag-chip"
                  :button="!!tag.url"
                  @click="tag.url ? openUrl(tag.url) : null"
                >
                  <ion-icon v-if="tag.url" :icon="linkOutline"></ion-icon>
                  <ion-label>{{ tag.name }}</ion-label>
                </ion-chip>
</div>

              <div class="socials-container scale-in-item" :class="{ 'is-visible': heroReady }" style="--delay: 600ms">
                <ion-button
                  v-for="social in safeSocials"
                  :key="social.platform"
                  fill="clear"
                  class="social-btn"
                  @click="openSocialUrl(social.url)"
                >
                  <ion-icon
                    slot="icon-only"
                    :icon="getIconByName(social.iconName)?.icon"
                  ></ion-icon>
                </ion-button>
              </div>

            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

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
          fill="var(--ion-color-primary)"
          fill-opacity="1"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      <!-- projects -->
      <ion-grid id="section-proyectos" style="background: var(--ion-color-primary)">
        <ion-row
          class="projects-row ion-justify-content-center"
          :class="{ 'is-ios': isIOS }"
        >
          <ion-col
            v-section-reveal
            class="ion-justify-content-center"
            size="12"
            size-lg="8"
            style="display: flex; flex-direction: column"
          >
            <div
              class="ion-padding-bottom section-heading"
              style="display: flex; justify-content: center"
            >
              <h2 style="font-size: 34px; color: var(--ion-color-light)">
                Proyectos
              </h2>
            </div>

            <ion-list>
              <ion-list-header>
                <ion-label>Proyectos</ion-label>

                <ion-button @click="router.push('/home/portfolio')"
                  >Todos</ion-button
                >
              </ion-list-header>

              <div v-if="safeProjects.length === 0" class="ion-padding">
                <p style="text-align: center; color: var(--ion-color-light)">
                  No hay proyectos disponibles
                </p>
              </div>

              <ion-grid v-else>
                <ion-row>
                  <ion-col
                    v-for="project in safeProjects.slice(0, displayLimit)"
                    :key="project.title"
                    size="12"
                    size-sm="6"
                    size-md="6"
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
          fill="var(--ion-color-primary)"
          fill-opacity="1"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        ></path>
      </svg>

      <!-- categories -->
      <ion-grid id="section-categories" v-section-reveal class="skills-grid">
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-lg="8">
            <!-- TODO:implement project filter by technology -->
            <TechCloudBackground
              title="My Categorías"
              :height="isMobile ? 350 : 600"
              :main-icons="mainIcons"
              :background-techs="filteredBackgroundTechs"
bg-color="var(--background-contrast)"
title-color="var(--ion-text-color)"
label-color="var(--ion-text-color-step-400)"
icon-label-color="var(--ion-text-color)"
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
          fill="var(--ion-color-primary)"
          fill-opacity="1"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      <!-- experience -->
      <ion-grid id="section-experiencia" style="background: var(--ion-color-primary)">
        <ion-row
          class="experience-row ion-justify-content-center"
          :class="{ 'is-ios': isIOS }"
        >
          <ion-col
            v-section-reveal
            class="ion-justify-content-center"
            size="12"
            size-lg="8"
            style="display: flex; flex-direction: column"
          >
            <div
              class="ion-padding-bottom section-heading"
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

              <div v-if="safeExperience.length === 0" class="ion-padding">
                <p style="text-align: center; color: var(--ion-color-light)">
                  No hay experiencias disponibles
                </p>
              </div>

              <ion-grid v-else>
                <ion-row>
                  <ion-col
                    v-for="exp in safeExperience.slice(0, displayLimit)"
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
          fill="var(--ion-color-primary)"
          fill-opacity="1"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        ></path>
      </svg>

      <ion-grid id="section-colaboracion" v-section-reveal>
        <ion-row
          style="min-height: 80dvh; align-items: center"
          class="ion-justify-content-center"
        >
          <ion-col size="12" size-lg="8">
            <FinalSection
              :freelance-platforms="freelancePlatforms"
              :freelance-comments="freelanceComments"
              :show-contact-form="showContactForm"
            />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-footer class="home-footer">
      <div class="ion-padding">
        <p>
          <a href="https://gitlab.com/dowardev/portafolio" target="_blank">
            Código fuente
          </a>
          bajo la licencia GPL-3.0.
        </p>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonToolbar,
  isPlatform,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

import IntroController from "@/controllers/introController";
import ProjectsController from "@/controllers/projectsController";
import ExperienceController from "@/controllers/experienceController";
import SkillsCategoriesController from "@/controllers/skillsCategoriesController";
import StackController from "@/controllers/stackController";
import FreelancePlatformController from "@/controllers/freelancePlatformController";
import FreelanceCommentController from "@/controllers/freelanceCommentController";

import TechCloudBackground from "@/components/common/TechCloudBackground.vue";
import FinalSection from "@/views/presentation/sections/FinalSection.vue";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import ExperienceCard from "@/components/experience/ExperienceCard.vue";


import defaultLogo from "@/assets/portafolio/logo_dowar_2.1.png";
import defaultPhoto from "@/assets/portafolio/foto_perfil.jpg";
import { getIconByName } from "@/composables/iconsIndex";
import { linkOutline } from "ionicons/icons";

const router = useRouter();
const isIOS = isPlatform("ios");

const introController = new IntroController();
const projectsController = new ProjectsController();
const experienceController = new ExperienceController();
const skillsCategoriesController = new SkillsCategoriesController();
const stackController = new StackController();
const freelancePlatformController = new FreelancePlatformController();
const freelanceCommentController = new FreelanceCommentController();

const contentRef = ref();
const menuContainerRef = ref();
const activeSection = ref("section-yo");
const windowWidth = ref(window.innerWidth);

const typedGreeting = ref("");
const isMobile = computed(() => windowWidth.value <= 576);
const isTablet = computed(
  () => windowWidth.value >= 576 && windowWidth.value <= 991,
);
const isScrolled = ref(false);
const heroReady = ref(false);
const showAvatar = computed(() => !isMobile.value || !isScrolled.value);

const buttonsWidth = computed(() => {
  if (isMobile.value) {
    return isScrolled.value ? "100%" : "80%";
  }
  return "";
});

const handleScroll = (event: CustomEvent) => {
  const scrollTop = event.detail?.scrollTop;
  isScrolled.value = scrollTop > 50;
};

const introData = computed(() => introController.data.value);

const fullGreeting = computed(() => `Hola, Soy ${introData.value?.name || "..."}.`);

let typingInterval: ReturnType<typeof setInterval> | null = null;
let currentCharIndex = 0;

const startTyping = () => {
  if (typingInterval) clearInterval(typingInterval);
  typedGreeting.value = "";
  currentCharIndex = 0;

  typingInterval = setInterval(() => {
    if (currentCharIndex < fullGreeting.value.length) {
      typedGreeting.value = fullGreeting.value.slice(0, currentCharIndex + 1);
      currentCharIndex++;
    } else {
      if (typingInterval) clearInterval(typingInterval);
    }
  }, 80);
};

watch(fullGreeting, (newVal) => {
  if (newVal && newVal.length > 0) {
    startTyping();
  }
});

const categories = computed(() => skillsCategoriesController.skillsCategories.value);

const backgroundTechs = computed(() => {
  const techs: { name: string }[] = [];
  categories.value.forEach((cat) => {
    cat.technologies?.forEach((tech) => {
      const iconName = tech.iconName;
      if (iconName) {
        const label = getIconByName(iconName)?.label || iconName;
        techs.push({ name: label });
      }
    });
  });
  return techs;
});

const filteredBackgroundTechs = computed(() => backgroundTechs.value);

const mainIcons = computed(() => {
  const stacks = stackController.stack.value;
  return stacks.map((s) => {
    const label = getIconByName(s.iconName)?.label || s.iconName;
    return { name: label, iconName: s.iconName };
  });
});

const displayLimit = computed(() => (isTablet.value ? 4 : 3));

const safeExperience = computed(() => experienceController.experiences.value || []);
const safeProjects = computed(() => projectsController.projects.value || []);
const safeTags = computed(() => introData.value?.tags || []);
const safeSocials = computed(() => introData.value?.socials || []);

const freelancePlatforms = computed(() => freelancePlatformController.freelancePlatforms?.value || []);
const freelanceComments = computed(() => freelanceCommentController.freelanceComments?.value || []);
const showContactForm = computed(() => introController.showContactForm);

const sections = [
  { id: "section-yo" },
  { id: "section-proyectos" },
  { id: "section-categories" },
  { id: "section-experiencia" },
  { id: "section-colaboracion" },
];

let observer: IntersectionObserver | null = null;

const scrollToSection = async (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    activeSection.value = sectionId;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(scrollActiveButtonIntoView, 300);
  }
};

const scrollActiveButtonIntoView = () => {
  if (!isMobile.value || !menuContainerRef.value) return;

  const activeButton = menuContainerRef.value.querySelector(".nav-btn.active");
  if (activeButton) {
    activeButton.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }
};

const openSocialUrl = (url: string) => {
  window.open(url, "_blank");
};

const openUrl = (url: string) => {
  if (url) {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(fullUrl, "_blank");
  }
};

watch(activeSection, () => {
  setTimeout(scrollActiveButtonIntoView, 100);
});

const setupIntersectionObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      let topSection: IntersectionObserverEntry | null = null;
      let minAbsTop = Infinity;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const rect = (entry.target as HTMLElement).getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        const absTop = Math.abs(sectionTop);

        if (rect.top <= viewportHeight && rect.bottom > 0) {
          if (absTop < minAbsTop) {
            minAbsTop = absTop;
            topSection = entry;
          }
        }
      }

      if (topSection) {
        activeSection.value = topSection.target.id;
      }
    },
    {
      threshold: 0,
      rootMargin: isMobile.value ? "-60% 0px -20% 0px" : "-10% 0px -50% 0px",
    },
  );

  sections.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer?.observe(el);
  });
};

const onResize = () => {
  windowWidth.value = window.innerWidth;
  observer?.disconnect();
  setupIntersectionObserver();
};

onMounted(async () => {
  window.addEventListener("resize", onResize);
  setTimeout(setupIntersectionObserver, 100);
  await Promise.all([
    introController.loadIntro(),
    projectsController.loadPublicProjects(),
    experienceController.loadPublicExperiences(),
    skillsCategoriesController.loadSkillsCategories(),
    stackController.loadStack(),
    freelancePlatformController.loadFreelancePlatforms(),
    freelanceCommentController.loadFreelanceComments(),
  ]);

  heroReady.value = true;

  if (introData.value?.name) {
    startTyping();
  }
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener("resize", onResize);
  if (typingInterval) clearInterval(typingInterval);
});
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.hero-section {
  position: relative;
  min-height: 80dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.profile-photo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.gradient-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  padding: 4px;
  background: var(--ion-color-primary);
  box-shadow: 0 8px 32px rgba(var(--ion-color-primary-rgb, 61, 173, 233), 0.4);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border: 2px solid var(--ion-background-color);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0 0 16px 0;
}

.typing-text {
  display: inline;
}

.cursor {
  display: inline-block;
  color: var(--ion-color-primary);
  font-weight: 300;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.hero-description {
  text-align: center;
  font-size: 1.1rem;
  color: var(--ion-text-color-step-400);
  max-width: 600px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.tag-chip {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tag-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(var(--ion-color-primary-rgb, 61, 173, 233), 0.3);
}

.socials-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.social-btn {
  --color: var(--ion-text-color);
  --padding-start: 12px;
  --padding-end: 12px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-btn:hover {
  transform: scale(1.15);
  --color: var(--ion-color-primary);
}

.scale-in-item {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--delay, 0ms);
}

.scale-in-item.is-visible {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-description {
    font-size: 1rem;
    padding: 0 16px;
  }
  .gradient-ring {
    width: 140px;
    height: 140px;
  }
}

.avatar-container {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar-container.avatar-visible {
  opacity: 1;
  transform: scale(1);
  width: 40px;
  height: 40px;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    width 0.2s ease 0.2s;
}

.avatar-container.avatar-hidden {
  opacity: 0;
  transform: scale(0);
  width: 0;
  height: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    width 0.2s ease 0.2s;
}

.avatar-container ion-avatar {
  width: 100%;
  height: 100%;
}

.nav-btn {
  position: relative;
}

.menu-scroll::-webkit-scrollbar {
  display: none;
}
.menu-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 100%;
  height: 2px;
  background: var(--ion-color-primary);
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

/* Pull the categories section up to sit closer to the lower wave */
.categories-grid {
  margin-top: -8px; /* adjust -4px..-12px if you want it closer/further */
}

.projects-row,
.experience-row {
  height: 124dvh;
}

@media (max-width: 410px) {
  .projects-row.is-ios,
  .experience-row.is-ios {
    height: 130dvh;
  }
}

@media (max-width: 375px) {
  .projects-row.is-ios,
  .experience-row.is-ios {
    height: 167dvh;
  }
}

@media (min-width: 768px) {
  .projects-row,
  .experience-row {
    height: 84dvh;
  }
}

@media (max-width: 576px) {
  .categories-grid {
    padding: 0 8px;
  }
}

.home-footer {
  --background: var(--ion-background-color);
  --border-width: 0;
  text-align: center;
}

.home-footer p {
  color: var(--ion-color-medium);
  font-size: 0.875rem;
  margin: 0;
}

.home-footer a {
  color: var(--ion-color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.home-footer a:hover {
  color: var(--ion-color-secondary);
  text-decoration: underline;
}

/* ion-content { */
/*   --background: #191919; */
/* } */
</style>
