<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <!-- main options md and lg screen -->
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
          <ion-segment-button value="contact">Contacto</ion-segment-button>
          <ion-segment-button value="skills">Skills</ion-segment-button>
          <ion-segment-button value="experience"
            >Experiencia</ion-segment-button
          >
          <ion-segment-button value="projects">Proyectos</ion-segment-button>
          <ion-segment-button value="certificates"
            >Certificados</ion-segment-button
          >
          <ion-segment-button value="final">Final</ion-segment-button>
        </ion-segment>

        <ion-button
          @click="buttonMenuDesktopOptions = { open: true, event: $event }"
        >
          <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="screenSize.preset == 'xs'" :mode="designMode">
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
        <ion-segment-button value="certificates"
          >Certificados</ion-segment-button
        >
        <ion-segment-button value="final">Final</ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="snap-container">
      <!-- info -->
      <section id="contact">
        <ion-row
          class="snap-section ion-align-items-center ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <InformationComponent />
          </ion-col>
        </ion-row>
      </section>

      <!-- skills -->
      <section id="skills">
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <div style="height: 81dvh">
              <SkillsPage />
            </div>
          </ion-col>
        </ion-row>
      </section>

      <!-- experience -->
      <section id="experience">
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Experiencia reciente</ion-label>
                <ion-button
                  disabled
                  @click="$router.push({ name: 'PortfolioPage' })"
                  >Ver todo</ion-button
                >
              </ion-list-header>

              <ExperienceComponent />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <!-- projects -->
      <section id="projects">
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Últimos proyectos</ion-label>
                <ion-button @click="$router.push({ name: 'PortfolioPage' })"
                  >Ver todo</ion-button
                >
              </ion-list-header>

              <ProjectsComponent />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <!-- certificates -->
      <section id="certificates">
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6" style="height: 100%">
            <ion-list style="height: 82dvh">
              <ion-list-header>
                <ion-label>Certificados recientes</ion-label>
                <ion-button @click="$router.push({ name: 'CertificatesPage' })"
                  >Ver todo</ion-button
                >
              </ion-list-header>

              <CertificatesComponent />
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <!-- final -->
      <section id="final" class="snap-section">
        <ion-row
          class="snap-section ion-justify-content-center"
          style="display: flex"
        >
          <ion-col size-xs="12" size-md="8" size-lg="6">
            <ion-row>
              <ion-col style="display: flex" class="ion-justify-content-center">
                <h2>Trabajemos juntos</h2>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col style="display: flex" class="ion-justify-content-center">
                <div
                  style="cursor: pointer"
                  class="ion-padding-start ion-padding-end"
                >
                  <img
                    style="width: 40px"
                    :src="UpworkLogo"
                    alt=""
                    @click="
                      openUrl({
                        url: 'https://www.upwork.com/freelancers/~0162303a78d7d448db?mp_source=share',
                      })
                    "
                  />
                </div>
                <div
                  style="cursor: pointer"
                  class="ion-padding-start ion-padding-end"
                >
                  <img
                    style="width: 40px"
                    :src="WorkanaLogo"
                    alt=""
                    @click="
                      openUrl({
                        url: 'https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c',
                      })
                    "
                  />
                </div>
                <div
                  style="cursor: pointer"
                  class="ion-padding-start ion-padding-end"
                  @click="openContactModal()"
                >
                  <img style="width: 40px" :src="ContractLogo" alt="" />
                </div>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <Swiper
                  :modules="[Pagination, Navigation, Autoplay]"
                  :slides-per-view="
                    screenSize.preset == 'xs' || screenSize.preset == 'md'
                      ? 1
                      : 2
                  "
                  :loop="true"
                  :pagination="{ clickable: true }"
                  :autoplay="{ delay: 3000, disableOnInteraction: false }"
                >
                  <SwiperSlide v-for="(review, index) in reviews" :key="index">
                    <ion-card class="shadow-1">
                      <ion-card-header>
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <img
                            :src="
                              review.platform === 'upwork'
                                ? UpworkLogo
                                : WorkanaLogo
                            "
                            alt=""
                            style="height: 45px"
                          />
                        </div>
                        <ion-card-title>{{ review.title }}</ion-card-title>
                        <ion-card-subtitle>
                          <ion-icon
                            v-for="n in review.rating"
                            :key="n"
                            :icon="star"
                          ></ion-icon>
                        </ion-card-subtitle>
                      </ion-card-header>
                      <ion-card-content v-if="review.comment">
                        <p>
                          <ion-text>
                            <span
                              v-for="(line, indexComment) in review.comment"
                              :key="indexComment"
                            >
                              {{ line
                              }}<br
                                v-if="indexComment < review.comment.length - 1"
                              />
                            </span>
                          </ion-text>
                        </p>
                      </ion-card-content>
                    </ion-card>
                  </SwiperSlide>
                </Swiper>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </section>
    </div>
  </ion-content>

  <!-- popovers -->
  <!-- popover main options mobile -->
  <ion-popover
    :is-open="buttonMenuMobileOptions.open"
    :event="buttonMenuMobileOptions.event"
    :mode="isPlatform('ios') ? 'ios' : 'md'"
    @did-dismiss="buttonMenuMobileOptions.open = false"
  >
    <ion-content>
      <ion-item
        lines="full"
        button
        @click="backgroundActive = !backgroundActive"
      >
        <ion-icon slot="start" :icon="imageOutline"></ion-icon>

        <ion-label v-if="backgroundActive == false">Activar fondo</ion-label>
        <ion-label v-else>Desactivar fondo</ion-label>
      </ion-item>

      <ion-item
        v-for="(option, key) in menuOptions"
        :key="key"
        lines="none"
        button
        @click="$router.push({ name: option.route })"
      >
        <ion-label>{{ option.title }}</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>
  <!-- popover main options desktop-->
  <ion-popover
    :is-open="buttonMenuDesktopOptions.open"
    :event="buttonMenuDesktopOptions.event"
    :mode="isPlatform('ios') ? 'ios' : 'md'"
    @did-dismiss="buttonMenuDesktopOptions.open = false"
  >
    <ion-content>
      <ion-item
        lines="full"
        button
        @click="backgroundActive = !backgroundActive"
      >
        <ion-icon slot="start" :icon="imageOutline"></ion-icon>

        <ion-label v-if="backgroundActive == false">Activar fondo</ion-label>
        <ion-label v-else>Desactivar fondo</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  alertController,
  IonButtons,
  IonMenuButton,
  useBackButton,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonPopover,
  modalController,
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { ellipsisVerticalOutline, imageOutline, star } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// interfaces

// components
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "./skills/SkillsPage.vue";
import ExperienceComponent from "./experience/ExperienceComponent.vue";
import ProjectsComponent from "./projects/ProjectsComponent.vue";
import CertificatesComponent from "./certificates/CertificatesComponent.vue";
import ButtonIconAnimationComponent from "@/components/buttons/ButtonIconAnimationComponent.vue";
import ContactModal from "../../components/modals/contact/ContactModal.vue";
// end components

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end controllers

// media
import UpworkLogo from "../../assets/otros/brand-upwork-svgrepo-com.svg";
import WorkanaLogo from "../../assets/otros/Workana_ISOLOGO_W.png";
import ContractLogo from "../../assets/otros/contract-svgrepo-com.svg";

// interface
import { DesignMode } from "@/utils/types";
// end interface

// vars
const pageTitle = "Presentación";
const menuOptions = ref({
  contact: { title: "Contacto", route: "PresentationPage" },
  skills: { title: "Habilidades", route: "SkillsPage" },
  portfolio: { title: "Porfolio", route: "PortfolioPage" },
});
const buttonMenuMobileOptions = ref({ open: false, event: null });
const buttonMenuDesktopOptions = ref({ open: false, event: null });
const backgroundActive = ref(false);
const designPlatform = isPlatform("ios") ? "ios" : "md";
const selectedSegment = ref("contact");
const designMode = ref<DesignMode>(systemController.getdesignMode());
const screenSize = ref(systemController.getScreenSize());
const reviews = ref([
  {
    platform: "upwork",
    title: "SISTEMA DE INVENTARIO PARA CICLOPARTES AVILA",
    rating: 5,
    comment: [
      "Excelente, es una persona muy dedicada en lo que hace",
      "Muy atento y siempre tiene los trabajos a tiempo",
      "Recomendadisimo",
    ],
  },
  {
    platform: "upwork",
    title: "login laravel telegram",
    rating: 5,
    comment: [
      "Excelente, es una persona muy dedicada en lo que hace",
      "Muy atento y siempre tiene los trabajos a tiempo",
      "Recomendadisimo",
    ],
  },
  {
    platform: "upwork",
    title: "Modificación sistema y creación app web",
    rating: 5,
    comment: ["Good Worker"],
  },
  {
    platform: "workana",
    title: "Landing Page",
    rating: 5,
    comment: ["Excelente profesional y comunicación."],
  },
  {
    platform: "workana",
    title: "App iOS & Android Venta de productos para mascotas",
    rating: 5,
    comment: [],
  },
  {
    platform: "workana",
    title: "Agregar E-learning plugin y pasarela de pago local",
    rating: 5,
    comment: [],
  },
  {
    platform: "workana",
    title: "Pagina web Fcm",
    rating: 5,
    comment: ["Muy buena profesional y sabes lo que está haciendo."],
  },
]);
// end vars

// component refs
ref<InstanceType<typeof ButtonIconAnimationComponent>>();
// end refs

// life
onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });

  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
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
    observer.observe(section);
  });
});
watch(
  () => systemController.getdesignMode(),
  (newValue) => {
    designMode.value = newValue;
  },
);
// end life

// functions
async function alertExitApp(): Promise<void> {
  const alert = await alertController.create({
    header: "Alerta",
    message: "Esta a punto de salir de la aplicación",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        id: "cancel-button",
        handler: () => {
          // console.log('Confirm Cancel:', blah)
        },
      },
      {
        text: "Continuar",
        id: "confirm-button",
        handler: () => {
          // App.exitApp();
        },
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

function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}

async function openContactModal() {
  const modal = await modalController.create({
    component: ContactModal,
  });

  modal.present();
}
// end functions
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hide-scroll {
  -ms-overflow-style: none; /* IE y Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari y Opera */
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
