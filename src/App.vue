<template>
  <ion-app>
    <MqResponsive target="lg+">
      <ion-split-pane when="lg" content-id="main" type="overlay">
        <ion-menu
          content-id="main"
          :style="changeSizeMenu"
          menu-id="mainMenu"
          style="--side-max-width: 200px; border-right-width: 0px"
        >
          <MenuComponent></MenuComponent>
        </ion-menu>

        <div id="main" class="ion-page">
          <ion-content class="ion-padding">
            <ion-router-outlet />
          </ion-content>
        </div>
      </ion-split-pane>
    </MqResponsive>

    <MqResponsive target="md-">
      <ion-menu content-id="main" menu-id="mainMenu">
        <MenuComponent></MenuComponent>
      </ion-menu>

      <div id="main" class="ion-page">
        <ion-content class="ion-padding">
          <ion-router-outlet />
        </ion-content>
      </div>
    </MqResponsive>
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
import { getUserToken } from "./services/user";
import { useSystem } from "./composables/useSystem";
import { Storage } from "@ionic/storage";
import { useRouter } from "vue-router";
import { createFirstCookie as createFirstCookieService } from "./services/system";
import { MqResponsive } from "vue3-mq";

const store = new Storage();
store.create();

const router = useRouter();

// computed
const changeSizeMenu = computed(() => {
  const option = useSystem().detectMenuCollapse().value;

  let size = {
    min: "280px",
    max: "280px",
  };
  if (window.innerWidth <= 992) {
    size = {
      min: "100%",
      max: "100%",
    };
  }
  if (option == true && window.innerWidth >= 768)
    size = {
      min: "88px",
      max: "88px",
    };
  return { "min-width": size.min, "max-width": size.max };
});

// mounted
onMounted(() => {
  createFirstCookie();
  getTheme().then((response) => {
    const theme = response;
    setTheme({ theme: theme });
  });
  loadUserProps();
  loadMenuCollapsedOption();

  if (isPlatform("desktop")) {
    nextTick(() => {
      const elementos = document.querySelectorAll(".split-pane-main .ion-page");

      elementos.forEach(function (elemento) {
        elemento.classList.add("component-container");
      });
    });
  }
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

async function loadMenuCollapsedOption() {
  let option = await store.get("menu-collapsed");
  if (option == null) option = false;
  useSystem().changeMenuCollapse({ option });
}
</script>

<style scoped>
.hideInstallPWA {
  display: none !important;
}
</style>
