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
import { IonApp, IonRouterOutlet, IonMenu, IonSplitPane } from "@ionic/vue";
import { defineComponent } from "vue";
import Menu from "./views/menu/MenuComponent.vue";
import systemService from "./services/system.vue";
import userService from "./services/user.vue";

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
    systemService().detectToggleTheme();
    systemService()
      .getTheme()
      .then((response) => {
        systemService().setTheme({ status: response });
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
        console.error(e);
      }
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
