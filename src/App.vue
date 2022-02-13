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
          <ion-toolbar class="menu-color">
            <img src="../public/assets/portafolio/dowar.png" />
          </ion-toolbar>
        </ion-header>
        <ion-content class="menu-color">
          <ion-item lines="none" button @click="$router.push('/presentation')">
            <ion-label
              v-bind:class="{
                optionSelected: $route.path == '/presentation',
                optionNoSelected: $route.path != '/presentation',
              }"
            >
              Presentación
            </ion-label>
          </ion-item>
          <ion-item lines="none" button @click="$router.push('/history')">
            <ion-label
              v-bind:class="{
                optionSelected: $route.path == '/history',
                optionNoSelected: $route.path != '/history',
              }"
            >
              Historia
            </ion-label>
          </ion-item>
          <ion-item lines="none" button @click="$router.push('/skills')">
            <ion-label
              v-bind:class="{
                optionSelected: $route.path == '/skills',
                optionNoSelected: $route.path != '/skills',
              }"
            >
              Habilidades</ion-label
            >
          </ion-item>
          <ion-item lines="none" button @click="$router.push('/portfolio')">
            <ion-label
              v-bind:class="{
                optionSelected: $route.path == '/portfolio',
                optionNoSelected: $route.path != '/portfolio',
              }"
            >
              Portfolio
            </ion-label>
          </ion-item>
          <ion-item lines="none" button @click="$router.push('/blog')">
            <ion-label
              v-bind:class="{
                optionSelected: $route.path == '/blog',
                optionNoSelected: $route.path != '/blog',
              }"
            >
              Blog
            </ion-label>
          </ion-item>
        </ion-content>

        <ion-footer class="ion-no-border">
          <ion-toolbar class="menu-color">
            <ion-buttons slot="end">
              <ion-button id="trigger-button-session">
                <ion-icon :icon="personCircleOutline"></ion-icon>
              </ion-button>
              <ion-popover
                trigger="trigger-button-session"
                dismiss-on-select="true"
              >
                <ion-content>
                  <ion-item button lines="none" @click="$router.push('login')">
                    <ion-label>Iniciar sesión</ion-label>
                  </ion-item>
                  <ion-item button lines="none" @click="$router.push('signup')">
                    <ion-label>Registrar</ion-label>
                  </ion-item>
                </ion-content>
              </ion-popover>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      </ion-menu>
      <ion-router-outlet Id="menu-content" />
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonPopover } from "@ionic/vue";
import { defineComponent } from "vue";
import { personCircleOutline } from "ionicons/icons";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    return { personCircleOutline };
  },
});
</script>

<style scoped>
.optionSelected {
  color: var(--accent-color);
}
.optionNoSelected {
  color: var(--secondary-text-color);
}
.menu-color,
ion-item {
  --background: var(--secondary-color);
}
</style>
