<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="menu-color">
        <img src="../../../public/assets/portafolio/dowar.png" />
      </ion-toolbar>
    </ion-header>
    <ion-content class="menu-color">
      <ion-item
        lines="none"
        button
        @click="openRoute('/presentation')"
        class="ion-item-menu"
      >
        <ion-label
          v-bind:class="{
            optionSelected: $route.path == '/presentation',
            optionNoSelected: $route.path != '/presentation',
          }"
        >
          Presentación
        </ion-label>
      </ion-item>
      <ion-item
        lines="none"
        button
        @click="openRoute('/history')"
        class="ion-item-menu"
      >
        <ion-label
          v-bind:class="{
            optionSelected: $route.path == '/history',
            optionNoSelected: $route.path != '/history',
          }"
        >
          Historia
        </ion-label>
      </ion-item>
      <ion-item
        lines="none"
        button
        @click="openRoute('/skills')"
        class="ion-item-menu"
      >
        <ion-label
          v-bind:class="{
            optionSelected: $route.path == '/skills',
            optionNoSelected: $route.path != '/skills',
          }"
        >
          Habilidades</ion-label
        >
      </ion-item>
      <ion-item
        lines="none"
        button
        @click="openRoute('/portfolio')"
        class="ion-item-menu"
      >
        <ion-label
          v-bind:class="{
            optionSelected: $route.path == '/portfolio',
            optionNoSelected: $route.path != '/portfolio',
          }"
        >
          Portfolio
        </ion-label>
      </ion-item>
      <ion-item
        lines="none"
        button
        @click="openRoute('/blog')"
        class="ion-item-menu"
        disabled
      >
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
          <ion-button
            fill="clear"
            @click="openModalDesktop()"
            v-if="!androidPlatform && !iosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>
          <ion-button
            fill="clear"
            @click="openModalMobile()"
            v-if="androidPlatform || iosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>
          <ion-button id="trigger-button-session">
            <ion-icon :icon="personCircleOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="trigger-button-session"
            dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="openRoute('login')"
                v-if="!userLogged"
              >
                <ion-icon :icon="logInOutline" slot="start"></ion-icon>
                <ion-label>Iniciar sesión</ion-label>
              </ion-item>
              <ion-item
                button
                lines="none"
                @click="openRoute('signup')"
                v-if="!userLogged"
                disabled
              >
                <ion-icon :icon="personAddOutline" slot="start"></ion-icon>
                <ion-label>Registrar</ion-label>
              </ion-item>
              <ion-item
                button
                lines="none"
                @click="userLogout()"
                v-if="userLogged"
              >
                <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
                <ion-label>Salir</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  modalController,
  isPlatform,
  menuController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  personCircleOutline,
  personAddOutline,
  logInOutline,
  logOutOutline,
  brushOutline,
} from "ionicons/icons";
import userService from "../../services/user.vue";
import sessionService from "../../services/session.vue";
import DarkMode from "./darkmode/DarkMode.vue";

export default defineComponent({
  name: "MenuComponent",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
  },
  setup() {
    return {
      personCircleOutline,
      personAddOutline,
      logInOutline,
      logOutOutline,
      androidPlatform: isPlatform("android"),
      iosPlatform: isPlatform("ios"),
      brushOutline,
    };
  },
  data() {
    return { userLogged: false };
  },
  mounted() {
    this.getUserLogged();
  },
  methods: {
    async getUserLogged() {
      const user = await userService().getUserLogged();
      if (user?.data) {
        this.userLogged = true;
      }
    },
    userLogout() {
      sessionService()
        .logout()
        .then(() => {
          userService().setUserToken("");
          this.userLogged = false;
        });
    },
    async openModalDesktop() {
      const modal = await modalController.create({
        component: DarkMode,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title",
        },
      });
      return modal.present();
    },
    async openModalMobile() {
      const modal = await modalController.create({
        component: DarkMode,
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5, 1],
      });
      modal.present();
      menuController.close();
    },
    openRoute(route: string) {
      this.$router.push(route);
      menuController.close();
    },
  },
});
</script>

<style scoped>
.optionSelected {
  color: var(--accent-color) !important;
}
.optionNoSelected {
  color: white !important;
}
.menu-color,
.ion-item-menu {
  --background: var(--secondary-color);
}
</style>
