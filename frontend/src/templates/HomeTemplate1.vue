<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>Presentación</ion-title>

      <ion-buttons
        v-if="isLargeScreen"
        slot="end"
        :mode="designPlatform"
      >
        <ion-segment
          :value="selectedSegment"
          class="hide-scroll"
          scrollable
          style="width: 20dvw"
          @ion-change="scrollToSection({ event: $event })"
        >
          <ion-segment-button value="contact">Contacto</ion-segment-button>
          <ion-segment-button value="skills">Skills</ion-segment-button>
          <ion-segment-button value="experience">Experiencia</ion-segment-button>
          <ion-segment-button value="projects">Proyectos</ion-segment-button>
          <ion-segment-button value="certificates">Certificados</ion-segment-button>
          <ion-segment-button value="final">Final</ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="screenSize.preset === 'xs'" :mode="designMode">
      <ion-segment
        :value="selectedSegment"
        class="hide-scroll"
        scrollable
        @ion-change="scrollToSection({ event: $event })"
      >
        <ion-segment-button value="contact">Contacto</ion-segment-button>
        <ion-segment-button value="skills">Skills</ion-segment-button>
        <ion-segment-button value="experience">Experiencia</ion-segment-button>
        <ion-segment-button value="projects">Proyectos</ion-segment-button>
        <ion-segment-button value="certificates">Certificados</ion-segment-button>
        <ion-segment-button value="final">Final</ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="snap-container">
      <section id="contact">
        <ion-row class="snap-section ion-align-items-center ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <InformationComponent v-bind="$props" />
          </ion-col>
        </ion-row>
      </section>

      <section id="skills">
        <ion-row class="snap-section ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <div style="height: 81dvh">
              <SkillsPage v-bind="$props" />
            </div>
          </ion-col>
        </ion-row>
      </section>

      <section id="experience">
        <ion-row class="snap-section ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Experiencia reciente</ion-label>
                <ion-button @click="$router.push({ name: 'ExperiencePage' })">Ver todo</ion-button>
              </ion-list-header>
              <ExperienceComponent v-bind="$props" />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <section id="projects">
        <ion-row class="snap-section ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Últimos proyectos</ion-label>
                <ion-button @click="$router.push({ name: 'PortfolioPage' })">Ver todo</ion-button>
              </ion-list-header>
              <ProjectsComponent v-bind="$props" />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <section id="certificates">
        <ion-row class="snap-section ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6" style="height: 100%">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Certificados recientes</ion-label>
                <ion-button @click="$router.push({ name: 'CertificatesPage' })">Ver todo</ion-button>
              </ion-list-header>
              <CertificatesComponent v-bind="$props" />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <section id="final" class="snap-section">
        <ion-row class="snap-section ion-justify-content-center" style="display: flex">
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <FinalSection v-bind="$props" />
          </ion-col>
        </ion-row>
      </section>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
  alertController,
  IonButtons,
  IonMenuButton,
  useBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonLabel,
  IonButton,
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import type { HomePageData } from "@/services/types";

// declare component props so $props contains the passed template data
const props = defineProps<Partial<HomePageData>>();

import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

import InformationComponent from "@/views/presentation/information/InformationComponent.vue";
import SkillsPage from "@/views/presentation/skills/SkillsPage.vue";
import ExperienceComponent from "@/views/presentation/experience/ExperienceComponent.vue";
import ProjectsComponent from "@/views/presentation/projects/ProjectsComponent.vue";
import CertificatesComponent from "@/views/presentation/certificates/CertificatesComponent.vue";
import FinalSection from "@/views/presentation/sections/FinalSection.vue";

const designPlatform = isPlatform("ios") ? "ios" : "md";
const selectedSegment = ref("contact");
const designMode = ref(systemController.getdesignMode() || undefined);
const screenSize = ref(systemController.getScreenSize() || { width: 0, height: 0, preset: 'md' });

const isLargeScreen = computed(() => {
  const preset = screenSize.value.preset;
  return preset === 'md' || preset === 'lg' || preset === 'xl' || preset === 'xxl';
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });

  setupIntersectionObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

function setupIntersectionObserver() {
  const sections = document.querySelectorAll("section");

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          selectedSegment.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0.7,
    },
  );

  sections.forEach((section) => {
    observer?.observe(section);
  });
}

async function alertExitApp() {
  const alert = await alertController.create({
    header: "Alerta",
    message: "Esta a punto de salir de la aplicación",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => {},
      },
      {
        text: "Continuar",
        id: "confirm-button",
        handler: () => {},
      },
    ],
  });
  await alert.present();
}

function scrollToSection(params: { event: CustomEvent }) {
  const { event } = params;
  const sectionId = event.detail.value;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style scoped>
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll::-webkit-scrollbar {
  display: none;
}

.snap-container {
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-snap-stop: always;
}

.snap-section {
  height: 100%;
  scroll-snap-align: start;
}

ion-content::part(scroll) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

ion-content::part(scroll)::-webkit-scrollbar {
  display: none;
}

.snap-container > section {
  height: 100%;
}
</style>
