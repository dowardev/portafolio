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
          <ion-button @click="openPopover">
            <ion-icon :icon="personCircleOutline"></ion-icon>
          </ion-button>
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
  IonLabel,
  IonItem,
  IonButton,
  IonFooter,
  IonButtons,
  IonIcon,
  popoverController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { personCircleOutline, brushOutline } from "ionicons/icons";
import userService from "../../services/user.vue";
import sessionService from "../../services/session.vue";
import DarkMode from "./darkmode/DarkMode.vue";
import PopoverSession from "./OptionsSession.vue";

export default defineComponent({
  name: "MenuComponent",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonLabel,
    IonItem,
    IonButton,
    IonFooter,
    IonButtons,
    IonIcon,
  },
  setup() {
    return {
      personCircleOutline,
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
    async openPopover(ev: Event) {
      const popover = await popoverController.create({
        component: PopoverSession,
        cssClass: "my-custom-class",
        event: ev,
        translucent: true,
      });
      await popover.present();

      const { role } = await popover.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
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
