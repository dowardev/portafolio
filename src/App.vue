<template>
  <ion-app>
    <ion-split-pane when="lg" content-id="main" type="overlay">
      <ion-menu
        content-id="main"
        menu-id="mainMenu"
        style="--side-max-width: 200px; border-right-width: 0px"
      >
        <MenuComponent></MenuComponent>
      </ion-menu>

      <ion-router-outlet id="main" />
    </ion-split-pane>
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
} from "@ionic/vue";
import { computed, nextTick, onMounted } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import { getFirstCookie, setTheme, getTheme } from "./services/system";
import { closeOutline } from "ionicons/icons";
import { useUser } from "./composables/useUser";

// FIX: create function composable
import { getUserToken } from "./services/user";

import { useSystem } from "./composables/useSystem";
import { Storage } from "@ionic/storage";
import { useRouter } from "vue-router";
import { createFirstCookie as createFirstCookieService } from "./services/system";
import { MqResponsive } from "vue3-mq";

const store = new Storage();
store.create();

const router = useRouter();

// mounted
onMounted(async () => {
  createFirstCookie();

  await useSystem().loadThemeSelected();
  const theme = useSystem().getTheme();
  setTheme({ theme: theme, currentTheme: theme });

  loadUserProps();
});

function createFirstCookie() {
  if (getFirstCookie()) {
    openToastOptions();
    createFirstCookieService();
  }
}

function loadUserProps() {
  const userToken = getUserToken();
  if (userToken != "") {
    useUser().updateUserLoggedProp(true);
    useUser().updateUserToken(userToken);
    useUser().updateUserAdminProp({ refetch: true });
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
