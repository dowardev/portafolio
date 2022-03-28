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
        systemService().setTheme(response);
      });
    this.getUser();
  },
  methods: {
    getUser() {
      userService()
        .getUser()
        .then((response) => {
          if (response.user) {
            const data = response.user;
            data["is_admin"] = data.admin;
            userService().setUserData(data);
          }
        })
        .catch((e) => {
          //
        });
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
