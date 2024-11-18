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

      <ion-router-outlet id="main" :animated="!disableAnimation" />
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
  IonToast,
} from "@ionic/vue";
import { computed, onMounted, ref, watch } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import { useRouter, useRoute } from "vue-router";
import { Storage } from "@ionic/storage";
import { wb } from "./main";

// controllers
import SystemController from "./controllers/systemController";
const systemController = new SystemController();

// store
const store = new Storage();
store.create();
const router = useRouter();
const route = useRoute();

// vars
const openToastUpdateApp = ref(false);
const previousRoute = ref("");

// watch
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath) {
      previousRoute.value = oldPath;
    }
  }
);

// computed
const disableAnimation = computed(() => {
  const currentPath = route.path;
  const routes = ["/home/presentation", "/home/skills", "/home/portfolio"];
  const isTargetRoute = routes.includes(currentPath);
  const wasOnTargetRoute = routes.includes(previousRoute.value);

  return isTargetRoute && wasOnTargetRoute;
});

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
  if (systemController.getFirstCookie()) {
    openToastOptions();
    systemController.createFirstCookie();
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
