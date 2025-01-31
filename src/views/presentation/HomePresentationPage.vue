<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <!-- main options sm screen -->
      <ion-buttons
        v-if="isPlatform('android') || isPlatform('ios')"
        slot="end"
        :mode="designPlatform"
      >
        <div>
          <ion-button
            @click="buttonMenuMobileOptions = { open: true, event: $event }"
          >
            <ion-icon :icon="albumsOutline"></ion-icon>
          </ion-button>
        </div>
      </ion-buttons>

      <!-- main options md and lg screen -->
      <ion-buttons
        v-if="isPlatform('desktop')"
        slot="end"
        :mode="designPlatform"
      >
        <ion-segment
          :value="selectedSegment"
          class="hide-scroll"
          scrollable
          style="width: 24dvw"
          @ion-change="scrollToSection($event)"
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
  </ion-header>

  <ion-content>
    <div class="snap-container">
      <!-- info -->
      <section id="contact">
        <ion-row
          style="height: 88dvh; display: flex"
          class="ion-align-items-center snap-section"
        >
          <ion-col class="ion-justify-content-center" style="display: flex">
            <InformationComponent />
          </ion-col>
        </ion-row>
      </section>

      <!-- skills -->
      <section id="skills">
        <ion-row
          style="height: 88dvh; display: flex"
          class="ion-align-items-center snap-section"
        >
          <ion-col>
            <SkillsPage />
          </ion-col>
        </ion-row>
      </section>

      <!-- experience -->
      <section id="experience">
        <ion-row
          style="height: 88dvh; display: flex"
          class="ion-align-items-center snap-section"
        >
          <ion-col>
            <ion-list>
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
          style="height: 88dvh; display: flex"
          class="ion-align-items-center snap-section"
        >
          <ion-col>
            <ion-list>
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
          style="height: 88dvh; display: flex"
          class="ion-align-items-center snap-section"
        >
          <ion-col>
            <ion-list>
              <ion-list-header>
                <ion-label>Certificados recientes</ion-label>
                <ion-button
                  disabled
                  @click="$router.push({ name: 'PortfolioPage' })"
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
        <div
          style="height: 88dvh; display: flex"
          class="ion-align-items-center ion-justify-content-center"
        >
          <div>
            <ion-row>
              <ion-col>
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
                  @click="modalContactForm?.$el.present()"
                >
                  <img style="width: 40px" :src="ContractLogo" alt="" />
                </div>
              </ion-col>
            </ion-row>
          </div>
        </div>
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

  <!-- modals -->
  <!-- modal contact form -->
  <ion-modal
    ref="modalContactForm"
    trigger="open-modal-contact-form"
    @will-dismiss="modalContactForm?.$el.dismiss()"
  >
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="modalContactForm?.$el.dismiss()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Contacto</ion-title>

        <ion-buttons slot="end">
          <ButtonIconAnimationComponent
            ref="buttonAnimation1"
            color="primary"
            @click="handleSendMessage(contactForm?.getData()!)"
          >
            <template #icon-start>
              <ion-icon :icon="sendOutline"></ion-icon>
            </template>

            <template #message>Enviando</template>
          </ButtonIconAnimationComponent>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ContactForm ref="contactForm" />
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  alertController,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  useBackButton,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonPopover,
  IonModal,
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  albumsOutline,
  closeOutline,
  ellipsisVerticalOutline,
  imageOutline,
  sendOutline,
} from "ionicons/icons";

// interfaces
type MainOptions = "PresentationPage" | "SkillsPage" | "PortfolioPage";

// components
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";
import HistoryPage from "../history/HistoryPage.vue";
import PortfolioPage from "../portfolio/PortfolioPage.vue";
import ExperienceComponent from "./experience/ExperienceComponent.vue";
import ProjectsComponent from "./projects/ProjectsComponent.vue";
import CertificatesComponent from "./certificates/CertificatesComponent.vue";
import ContactForm from "@/components/forms/contact/ContactForm.vue";
import ButtonIconAnimationComponent from "@/components/buttons/ButtonIconAnimationComponent.vue";
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
import { ContactMessage } from "@/services/interfaces";
// end interface

// vars
const showTitle = ref(true);
const router = useRouter();
const pageTitle = "Presentación";
const menuOptions = ref({
  contact: { title: "Contacto", route: "PresentationPage" },
  skills: { title: "Habilidades", route: "SkillsPage" },
  // history: { title: "Historia", route: "HistoryPage" },
  portfolio: { title: "Porfolio", route: "PortfolioPage" },
});
const buttonMenuMobileOptions = ref({ open: false, event: null });
const buttonMenuDesktopOptions = ref({ open: false, event: null });
const backgroundActive = ref(false);
const opcSelected = ref<MainOptions>("PresentationPage");
const designPlatform = isPlatform("ios") ? "ios" : "md";
const selectedSegment = ref("contact");
// end vars

// component refs
const modalContactForm = ref<InstanceType<typeof IonModal>>();
const contactForm = ref<InstanceType<typeof ContactForm>>();
const buttonAnimation1 =
  ref<InstanceType<typeof ButtonIconAnimationComponent>>();
// end refs

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
      threshold: 0.9,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
});

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

function mainSelectHandler(params: { option: MainOptions }) {
  const { option } = params;
  if (option == "PresentationPage") {
    // router.push({ name: "PresentationPage" });
    opcSelected.value = "PresentationPage";
  }
  if (option == "SkillsPage") {
    // router.push({ name: "SkillsPage" });
    opcSelected.value = "SkillsPage";
  }
  if (option == "PortfolioPage") {
    // router.push({ name: "PortfolioPage" });
    opcSelected.value = "PortfolioPage";
  }
}

function scrollToSection(event) {
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

async function handleSendMessage(params: ContactMessage) {
  const { name, email, subject, description } = params;
  buttonAnimation1.value?.updateConfig({ status: true, fill: "solid" });

  await new Promise((resolve) => setTimeout(resolve, 800));
  await sendMessage({ name, email, subject, description });
  await new Promise((resolve) => setTimeout(resolve, 800));

  buttonAnimation1.value?.updateConfig({ status: false, fill: "default" });

  await new Promise((resolve) => setTimeout(resolve, 800));
  modalContactForm.value?.$el.dismiss();
}

async function sendMessage(params: ContactMessage) {
  const { name, email, subject, description } = params;

  try {
    await systemController.createContactMessage({
      name,
      email,
      subject,
      description,
    });
    await systemController.presentToast({ message: "Mensaje recibido" });
  } catch (e: unknown) {
    await systemController.presentToast({ message: "Error al enviar mensaje" });
    console.error(e);
    return;
  } finally {
    //
  }
}
</script>

<style scoped>
.page-background {
  background-image: url("../../assets/backgrounds/b5.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

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
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-snap-stop: always;
}
.snap-section {
  height: 100vh;
  scroll-snap-align: start;
}

ion-content::part(scroll) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

ion-content::part(scroll)::-webkit-scrollbar {
  display: none;
}
</style>
