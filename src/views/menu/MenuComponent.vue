<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="menu-color">
        <img src="../../../public/assets/portafolio/dowar.png" />
      </ion-toolbar>
      <ion-toolbar class="menu-color">
        <ion-item lines="full" v-if="userLogged == false">
          <ion-label style="color: white !important">Bienvenido</ion-label>
          <ion-button fill="clear" @click="openRoute('/login')">
            <ion-icon :icon="logInOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="openRoute('/signup')">
            <ion-icon :icon="personAddOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item lines="full" v-if="userLogged == true">
          <ion-label style="color: white !important">{{ userName }}</ion-label>
          <ion-button fill="clear" @click="userLogout()">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-item>
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
      >
        <ion-label
          v-bind:class="{
            optionSelected: $route.path == '/blog',
            optionNoSelected: $route.path != '/blog',
          }"
        >
          Blog
        </ion-label>
        <ion-chip color="success">BETA</ion-chip>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  brushOutline,
  personAddOutline,
  logInOutline,
  logOutOutline,
} from "ionicons/icons";
import DarkMode from "./darkmode/DarkMode.vue";
import sessionService from "../../services/session.vue";
import eventBus from "../../EventBus";
import systemService from "../../services/system.vue";
import userService from "../../services/user.vue";

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
      androidPlatform: isPlatform("android"),
      iosPlatform: isPlatform("ios"),
      brushOutline,
      personAddOutline,
      logInOutline,
      logOutOutline,
    };
  },
  data() {
    return { userLogged: false, userName: null as null | string };
  },
  mounted() {
    eventBus().emitter.on("refresh-user-content", (response: any) => {
      this.getUserName();
    });
    this.getUserName();
  },
  methods: {
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
    userLogout() {
      sessionService()
        .logout()
        .then((response) => {
          const token = (document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
          userService().setUserToken(token);
          this.userLogged = false;
          systemService().openToast("Hasta pronto", "success");
          sessionService().removeUserCached();
        });
    },
    getUserName() {
      userService()
        .getUserName()
        .then((response) => {
          if (response.name) {
            this.userLogged = true;
            this.userName = response.name;
          }
        });
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
