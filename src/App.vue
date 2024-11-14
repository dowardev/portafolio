<template>
  <ion-app>
    <ion-split-pane when="lg" content-id="main" type="overlay">
      <ion-menu
        content-id="main"
        menu-id="mainMenu"
        style="--side-max-width: 300px; border-right-width: 0px"
      >
        <MenuComponent></MenuComponent>
      </ion-menu>

      <ion-router-outlet id="main" />
    </ion-split-pane>

    <!-- toasts -->
    <ion-toast
      :is-open="openToastUpdateApp"
      message="Nueva actualización disponible, más detalles en la sección de novedades"
      :duration="7000"
    ></ion-toast>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonSplitPane,
  toastController,
  isPlatform,
  IonToast,
} from "@ionic/vue";
import { computed, nextTick, onMounted, ref } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import { getFirstCookie } from "./services/system";
import { closeOutline } from "ionicons/icons";

import { Storage } from "@ionic/storage";
import { useRouter } from "vue-router";
import { createFirstCookie as createFirstCookieService } from "./services/system";
import { wb } from "./main";

// controllers
import SystemController from "./composables/useSystem";
const systemController = new SystemController();

// store
const store = new Storage();
store.create();
const router = useRouter();

// vars
const openToastUpdateApp = ref(false);

// mounted
onMounted(async () => {
  createFirstCookie();

  await systemController.loadThemeSelected();
  const theme = systemController.getTheme();
  systemController.applyTheme({ newTheme: theme, oldTheme: theme });

  if ("serviceWorker" in navigator && wb) {
    wb.addEventListener("waiting", () => {
      systemController.toggleUpdateOption();
      openToastUpdateApp.value = true;
    });
  }
});

function createFirstCookie() {
  if (getFirstCookie()) {
    openToastOptions();
    createFirstCookieService();
  }
}

async function openToastOptions() {
  const toast = await toastController.create({
    header: "Aviso",
    message:
      "Hola nuevo usuario, te invitamos a leer nuestras políticas, si estás de acuerdo con estas puedes seguir navegando e ignorar este mensaje",
    position: "bottom",
    buttons: [
      {
        side: "end",
        text: "Leer",
        handler: () => {
          router.push("/policies");
        },
      },
      {
        side: "end",
        role: "cancel",
        icon: closeOutline,
        handler: () => {
          // console.log("Cancel clicked");
        },
      },
    ],
  });
  await toast.present();
}
</script>

<style scoped>
.hideInstallPWA {
  display: none !important;
}
</style>
