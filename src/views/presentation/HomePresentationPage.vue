<template>
  <ion-page
    class="page-container"
    :class="{ 'page-background': backgroundActive }"
  >
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <!-- main options sm screen -->
        <ion-buttons
          slot="end"
          v-if="isPlatform('android') || isPlatform('ios')"
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
        <ion-buttons slot="end" v-if="isPlatform('desktop')">
          <ion-segment :scrollable="true" :value="$route.name as string">
            <ion-segment-button
              v-for="(option, key) in menuOptions"
              :key="key"
              :value="option.route"
              @click="
                mainSelectHandler({ option: option.route as MainOptions })
              "
            >
              <span>{{ option.title }}</span>
            </ion-segment-button>
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
      <transition name="fade" mode="out-in">
        <div :key="opcSelected">
          <div style="height: 100%" v-if="opcSelected == 'PresentationPage'">
            <div size="12" style="height: 100%" class="center center-vertical">
              <InformationComponent />
            </div>
          </div>

          <div v-if="opcSelected == 'SkillsPage'">
            <SkillsPage />
          </div>

          <div v-if="opcSelected == 'PortfolioPage'">
            <PortfolioPage />
          </div>
        </div>
      </transition>
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
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
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
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

// interfaces
type MainOptions = "PresentationPage" | "SkillsPage" | "PortfolioPage";

// components
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";
import HistoryPage from "../history/HistoryPage.vue";
import PortfolioPage from "../portfolio/PortfolioPage.vue";
import {
  albumsOutline,
  ellipsisVerticalOutline,
  imageOutline,
} from "ionicons/icons";

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

onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
