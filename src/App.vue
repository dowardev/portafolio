<template>
  <ion-app>
    <ion-split-pane when="md" contentId="menu-content">
      <ion-menu
        contentId="menu-content"
        menuId="mainMenu"
        side="start"
        type="overlay"
        style="--side-max-width: 200px"
        class="menu-color"
      >
        <Menu></Menu>
      </ion-menu>
      <ion-router-outlet Id="menu-content" />
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
import Menu from "./views/menu/MenuComponent.vue";
import systemService from "./services/system.vue";
import userService from "./services/user.vue";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Menu,
    IonMenu,
    IonSplitPane,
  },

  mounted() {
    this.createFirstCookie();
    systemService().detectToggleTheme();
    systemService()
      .getTheme()
      .then((response) => {
        const theme = response == null ? "aut" : response;
        systemService().setTheme({ theme: theme });
      });
    this.getUser();
  },

  methods: {
    async getUser() {
      const query = `
            user {
              id
              name
              email
              is_admin
              rol
        }
      `;
      try {
        const response = await userService().getUser({ query });
        const name = response.name;
        const email = response.email;
        const rol = response.rol;
        const is_admin = response.is_admin;
        userService().setUserData({ name, email, rol, is_admin });
      } catch (e: any) {
        if (e.message == "Unauthorized") return;
        else {
          systemService().openToastErrror(e);
          console.error(e);
        }
      }
    },

    createFirstCookie() {
      if (systemService().getFirstCookie()) {
        this.openToastOptions();
        systemService().createFirstCookie();
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
