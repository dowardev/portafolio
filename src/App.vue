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
import { IonApp, IonRouterOutlet, IonMenu, IonSplitPane } from "@ionic/vue";
import { defineComponent } from "vue";
import Menu from "./views/menu/MenuComponent.vue";
import systemService from "./services/system.vue";
import userService from "./services/user.vue";
import eventBus from "./EventBus";

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
        systemService().setTheme(response);
      });
    // this.getUser();
  },
  methods: {
    async getUser() {
      await userService().setUserUploaded(null);
      userService()
        .getUserLogged()
        .then(async (response: any) => {
          if (response?.data) {
            await userService().setUserData(response.data);
          }
          userService().setUserUploaded(true);
        })
        .catch(async (e) => {
          await userService().setUserData(null);
          userService().setUserUploaded(true);
        });
    },
  },
});
</script>
