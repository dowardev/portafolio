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
      message="Nueva actualización disponible, más detalles en la sección de novedades"
      :is-open="openToastUpdateApp"
      :buttons="toastButtons"
      :duration="7000"
      @did-dismiss="updateApp($event)"
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
  toastController,
  isPlatform,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import { computed, onMounted, ref, watch } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import { useRouter, useRoute } from "vue-router";
import { Storage } from "@ionic/storage";
import { wb } from "./main";

// interface
import { DesignMode } from "./utils/types";

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
const toastButtons = [
  {
    text: "Actualizar",
    role: "update",
  },
];
const designMode = ref<DesignMode>(isPlatform("ios") ? "ios" : "md");
// end vars

// watch
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath) {
      previousRoute.value = oldPath;
    }
  },
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
  systemController.setDesignMode({ mode: designMode.value });
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
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

function updateApp(e: any) {
  if (e.detail.role == "update") systemController.updateApp();
}

function updateScreenSize(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let preset = "xxl";

  if (width < 576) preset = "xs";
  else if (width < 768) preset = "sm";
  else if (width < 992) preset = "md";
  else if (width < 1200) preset = "lg";
  else if (width < 1400) preset = "xl";
  systemController.updateScreenSize({ width, height, preset });
}
</script>

<style scoped>
.hideInstallPWA {
  display: none !important;
}
</style>
