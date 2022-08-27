<template>
  <ion-app>
    <ion-split-pane content-id="menu-content" when="md">
      <ion-menu
        content-id="menu-content"
        menu-id="mainMenu"
        side="start"
        type="overlay"
        style="--side-max-width: 200px"
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
import MenuComponent from "./views/menu/MenuComponent.vue";
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
    return { useUser: useUser() };
  },

  mounted() {
    this.createFirstCookie();
    detectToggleTheme();
    getTheme().then((response) => {
      const theme = response == null ? "aut" : response;
      setTheme({ theme: theme });
    });
    this.loadUserProps();
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
