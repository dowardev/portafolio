<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons
        v-if="
          screenSize.preset == 'md' ||
          screenSize.preset == 'lg' ||
          screenSize.preset == 'xl' ||
          screenSize.preset == 'xxl'
        "
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
          <ion-segment-button
            v-for="section in template.sections"
            :key="section.id"
            :value="section.id"
          >
            {{ section.title || section.id }}
          </ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="screenSize.preset == 'xs'" :mode="designMode">
      <ion-segment
        :value="selectedSegment"
        class="hide-scroll"
        scrollable
        @ion-change="scrollToSection({ event: $event })"
      >
        <ion-segment-button
          v-for="section in template.sections"
          :key="section.id"
          :value="section.id"
        >
          {{ section.title || section.id }}
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="snap-container">
      <section
        v-for="section in template.sections"
        :id="section.id"
        :key="section.id"
      >
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col
            :size-xs="section.layout?.columns === 1 ? '12' : '12'"
            :size-md="section.layout?.columns === 1 ? '8' : '8'"
            :size-lg="section.layout?.columns === 1 ? '6' : '6'"
            :style="{ height: section.height || '100%' }"
          >
            <component
              :is="section.component"
              v-bind="getComponentProps(section, data)"
            />
          </ion-col>
        </ion-row>
      </section>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { star as starIcon } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { type TemplateConfig, type HomeTemplateData } from "@/utils/types/homeTemplate";
import { type DesignMode } from "@/utils/types";

import ContractLogo from "@/assets/otros/contract-svgrepo-com.svg";

import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

interface Props {
  template: TemplateConfig;
  data: HomeTemplateData;
}

const props = defineProps<Props>();

const pageTitle = "Presentación";
const designPlatform = isPlatform("ios") ? "ios" : "md";
const selectedSegment = ref("contact");
const designMode = ref<DesignMode | undefined>(systemController.getdesignMode() || undefined);
const screenSize = ref(systemController.getScreenSize() || { width: 0, height: 0, preset: 'md' });

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

function getComponentProps(section: any, data: HomeTemplateData) {
  const componentName = section.component?.name || section.component;
  
  if (componentName === "FinalSection") {
    return {
      freelance: data.freelance,
      showContactForm: data.showContactForm,
      screenSize: screenSize.value,
    };
  }

  return section.props || {};
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
        id: "cancel-button",
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

function openUrl(url: string) {
  window.open(url, "_blank");
}

async function openContactModal() {
  const { modalController } = await import("@ionic/vue");
  const { default: ContactModal } = await import(
    "@/components/modals/contact/ContactModal.vue"
  );
  const modal = await modalController.create({
    component: ContactModal,
  });
  modal.present();
}

defineExpose({
  openUrl,
  openContactModal,
  star: starIcon,
  ContractLogo,
  screenSize,
});
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

.swiper {
  height: auto;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>