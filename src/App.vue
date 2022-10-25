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
  detectToggleTheme,
  createFirstCookie,
  getFirstCookie,
  setTheme,
  getTheme,
} from "./services/system";
import { closeOutline } from "ionicons/icons";
import { useUser } from "./composables/useUser";
import { getUserToken } from "./services/user";
import { useSystem } from "./composables/useSystem";

import { Storage } from "@ionic/storage";

const store = new Storage();
await store.create();

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
    return {
      useUser: useUser(),
      detectMenuCollapse: useSystem().detectMenuCollapse,
      changeMenuCollapse: useSystem().changeMenuCollapse,
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
  },
});
</script>

<style scoped>
@media only screen and (min-width: 768px) {
  .menu-color {
    background-color: var(--secondary-color);
  }
}
</style>
