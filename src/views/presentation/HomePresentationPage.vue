<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
          <!-- main options sm screen -->
          <div v-if="isPlatform('android') || isPlatform('ios')">
            <ion-button id="click-trigger">
              <ion-icon :icon="albumsOutline"></ion-icon>
            </ion-button>
          </div>

          <!-- main options md and lg screen -->
          <div v-if="isPlatform('desktop')">
            <ion-segment :scrollable="true" :value="$route.name as string">
              <ion-segment-button
                v-for="(option, key) in menuOptions"
                :key="key"
                :value="option.route"
                @click="$router.push({ name: option.route })"
              >
                {{ option.title }}
              </ion-segment-button>
            </ion-segment>
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="height: 100%" v-if="$route.name == 'PresentationPage'">
        <div size="12" style="height: 100%" class="center center-vertical">
          <InformationComponent />
        </div>
      </div>

      <div v-if="$route.name == 'SkillsPage'">
        <SkillsPage />
      </div>

      <div v-if="$route.name == 'HistoryPage'" class="ion-padding">
        <HistoryPage />
      </div>

      <div v-if="$route.name == 'PortfolioPage'" class="ion-padding">
        <PortfolioPage />
      </div>
    </ion-content>

    <!-- popovers -->
    <ion-popover
      trigger="click-trigger"
      trigger-action="click"
      :mode="isPlatform('ios') ? 'ios' : 'md'"
    >
      <ion-content>
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
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

// interfaces
type MainOptions = "contact" | "skills" | "history" | "portfolio";

// components
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";
import HistoryPage from "../history/HistoryPage.vue";
import PortfolioPage from "../portfolio/PortfolioPage.vue";
import { albumsOutline } from "ionicons/icons";

// vars
const showTitle = ref(true);
const router = useRouter();
const pageTitle = "Presentación";
const menuOptions = ref({
  contact: { title: "Contacto", route: "PresentationPage" },
  skills: { title: "Habilidades", route: "SkillsPage" },
  history: { title: "Historia", route: "HistoryPage" },
  portfolio: { title: "Porfolio", route: "PortfolioPage" },
});

onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });
});

// watch(
//   () => route.fullPath,
//   (newPath, oldPath) => {
//     console.log(newpath, oldPath);
//   }
// );

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
          App.exitApp();
        },
      },
    ],
  });
  await alert.present();
}

function mainSelectHandler(params: { option: MainOptions }) {
  const { option } = params;
  if (option == "contact") {
    router.push({ name: "PresentationPage" });
  }
  if (option == "skills") {
    router.push({ name: "SkillsPage" });
  }
  if (option == "history") {
    router.push({ name: "HistoryPage" });
  }
  if (option == "portfolio") {
    router.push({ name: "PortfolioPage" });
  }
}
</script>
