<template>
  <ion-app>
    <ion-split-pane content-id="menu-content" when="md">
      <ion-menu
        content-id="menu-content"
        menu-id="mainMenu"
        side="start"
        type="overlay"
        :style="changeSizeMenu"
        class="menu-color"
      >
        <MenuComponent></MenuComponent>
      </ion-menu>
      <ion-router-outlet id="menu-content" />
    </ion-split-pane>

    <div
      style="
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      "
      :class="{ hideInstallPWA: isOpenMenuAddPWA == false }"
    >
      <div
        style="
          background: var(--ion-background-color);
          display: flex;
          justify-content: center;
          border-color: var(--ion-color-primary);
          border-style: solid;
          border-width: 3px;
          border-radius: 4px;
        "
      >
        <ion-item>
          <ion-button fill="clear" @click="installPWA()"
            >Instalar aplicacion</ion-button
          >
          <ion-button slot="end" fill="clear" @click="dismissPWA()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </div>
    </div>

    <!-- <ion-alert -->
    <!--   :is-open="isOpenAlertAddPWA" -->
    <!--   header="Instalar Aplicacion" -->
    <!--   message="¿Añadir Dowar Blog a la pantalla de inicio?" -->
    <!--   :buttons="buttonsAlertPWA" -->
    <!--   @did-dismiss="isOpenAlertAddPWA = false" -->
    <!-- ></ion-alert> -->

    <!-- <ion-alert -->
    <!--   :is-open="isOpenAlertRefreshPWA" -->
    <!--   header="Nueva actualizacion" -->
    <!--   message="¿Actualizar aplicacion?" -->
    <!--   :buttons="buttonsAlertRefreshContent" -->
    <!--   @did-dismiss="isOpenAlertRefreshPWA = false" -->
    <!-- ></ion-alert> -->
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonSplitPane,
  toastController,
  IonAlert,
} from "@ionic/vue";
import { defineComponent } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import {
  detectToggleTheme,
  createFirstCookie,
  getFirstCookie,
  setTheme,
  getTheme,
} from "./services/system";
import {
  closeOutline,
  downloadOutline,
  checkmarkOutline,
} from "ionicons/icons";
import { useUser } from "./composables/useUser";
import { getUserToken } from "./services/user";
import { useSystem } from "./composables/useSystem";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { Storage } from "@ionic/storage";

const store = new Storage();
store.create();

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuComponent,
    IonMenu,
    IonSplitPane,
  },

  setup() {
    const intervalMS = 60 * 60 * 1000;
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
      onRegistered(r) {
        r &&
          setInterval(() => {
            r.update();
          }, intervalMS);
      },
    });

    const close = async () => {
      offlineReady.value = false;
      needRefresh.value = false;
    };
    return {
      useUser: useUser(),
      detectMenuCollapse: useSystem().detectMenuCollapse,
      changeMenuCollapse: useSystem().changeMenuCollapse,
      offlineReady,
      updateServiceWorker,
      downloadOutline,
      isOpenMenuRefreshPWA: needRefresh,
      closeOutline,
    };
  },

  data() {
    return {
      menuSize: {
        min: "280%",
        max: "280%",
      },
      windowSize: {
        min: window.innerWidth,
        max: window.innerWidth,
      },
      isMenuCollapsed: false,
      deferredPrompt: null as any,
      isOpenMenuAddPWA: false,
      buttonsAlertPWA: [
        {
          text: "Instalar",
          icon: checkmarkOutline,
          handler: () => {
            this.installPWA();
          },
        },

        {
          text: "Cancelar",
          icon: closeOutline,
          role: "cancel",
          handler: () => {
            this.dismissPWA();
          },
        },
      ],
      buttonsAlertRefreshContent: [
        {
          text: "Actualizar",
          icon: downloadOutline,
          handler: () => {
            this.updateServiceWorker();
          },
        },
        {
          text: "Cancelar",
          icon: closeOutline,
          role: "cancel",
          handler: () => {
            this.close();
          },
        },
      ],
    };
  },

  computed: {
    changeSizeMenu() {
      const option = this.detectMenuCollapse().value;

      let size = {
        min: "280px",
        max: "280px",
      };
      if (window.innerWidth <= 767) {
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
    },
  },

  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isOpenMenuAddPWA = true;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
      this.isOpenMenuAddPWA = false;
    });
  },

  mounted() {
    this.createFirstCookie();
    detectToggleTheme();
    getTheme().then((response) => {
      const theme = response == null ? "aut" : response;
      setTheme({ theme: theme });
    });
    this.loadUserProps();
    this.loadMenuCollapsedOption();
  },

  methods: {
    createFirstCookie() {
      if (getFirstCookie()) {
        this.openToastOptions();
        createFirstCookie();
      }
    },

    loadUserProps() {
      const userToken = getUserToken();
      if (userToken != "") {
        this.useUser.updateUserLoggedProp(true);
        this.useUser.updateUserToken(userToken);
        this.useUser.updateUserAdminProp({ refetch: true });
      }
    },

    async openToastOptions() {
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
              this.$router.push("/policies");
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
    },

    async loadMenuCollapsedOption() {
      let option = await store.get("menu-collapsed");
      if (option == null) option = false;
      this.changeMenuCollapse({ option });
    },

    installPWA() {
      this.deferredPrompt.prompt();
    },

    dismissPWA() {
      this.deferredPrompt = null;
      this.isOpenMenuAddPWA=false
    },
  },
});
</script>

<style scoped>
@media only screen and (min-width: 768px) {
  .menu-color {
    background-color: var(--secondary-color);
  }
}
.hideInstallPWA {
  display: none !important;
}
</style>
