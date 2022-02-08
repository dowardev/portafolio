<template>
  <ion-app>
    <ion-split-pane when="md" contentId="menu-content">
      <ion-menu
        contentId="menu-content"
        menuId="firstMenu"
        side="start"
        type="overlay"
        style="--side-max-width: 200px"
      >
        <ion-header class="ion-no-border">
          <ion-toolbar class="ion-no-border">
            <img src="../public/assets/portafolio/dowar.png" />
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-item lines="none" button @click="$router.push('/presentation')"
            >Presentación</ion-item
          >
          <ion-item lines="none" button>Historia</ion-item>
          <ion-item lines="none" button>Habilidades</ion-item>
          <ion-item lines="none" button>Proyectos</ion-item>
        </ion-content>
      </ion-menu>
      <ion-router-outlet Id="menu-content" />
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>

<style scoped>
ion-item,
ion-toolbar {
  --background: #2e3440;
}
</style>
