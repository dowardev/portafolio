<template>
  <ion-app>
    <ion-split-pane when="lg" content-id="main" type="overlay">
      <ion-menu content-id="main" :style="changeSizeMenu">
        <MenuComponent></MenuComponent>
      </ion-menu>

      <div id="main" class="ion-page">
        <ion-content class="ion-padding">
          <ion-router-outlet />
        </ion-content>
      </div>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonSplitPane,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import MenuComponent from "./components/menu/MenuComponent.vue";
import {
  createFirstCookie,
  getFirstCookie,
  setTheme,
  getTheme,
} from "./services/system";
import { closeOutline, downloadOutline } from "ionicons/icons";
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

  // created() {
  //   window.addEventListener("beforeinstallprompt", (e) => {
  //     e.preventDefault();
  //     this.deferredPrompt = e;
  //     this.isOpenMenuAddPWA = true;
  //   });
  //   window.addEventListener("appinstalled", () => {
  //     this.deferredPrompt = null;
  //     this.isOpenMenuAddPWA = false;
  //   });
  // },

  mounted() {
    this.createFirstCookie();
    getTheme().then((response) => {
      const theme = response;
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
      this.isOpenMenuAddPWA = false;
    },
  },
});
</script>

<style scoped>
.hideInstallPWA {
  display: none !important;
}
</style>
