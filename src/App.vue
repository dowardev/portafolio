<template>
  <ion-app>
    <ion-split-pane when="md" contentId="menu-content">
      <ion-menu
        contentId="menu-content"
        menuId="mainMenu"
        side="start"
        type="overlay"
        style="--side-max-width: 200px"
      >
        <Menu></Menu>
      </ion-menu>
      <ion-router-outlet Id="menu-content" />
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import Menu from "./views/menu/MenuComponent.vue";
import systemService from "./services/system.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Menu,
  },
  mounted() {
    systemService().detectToggleTheme();
    systemService()
      .getTheme()
      .then((response) => {
        systemService().setTheme(response);
      });
  },
});
</script>
