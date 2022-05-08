<template>
  <ion-page>
    <ion-content class="menu-color">
      <ion-toolbar class="menu-color">
        <img src="../../../public/assets/portafolio/dowar.png" />
      </ion-toolbar>

      <ion-toolbar class="menu-color">
        <ion-item lines="none" v-if="userLogged == false">
          <ion-label style="color: white !important">Bienvenido</ion-label>
          <ion-spinner name="crescent" v-if="spinners.buttonLogin">
          </ion-spinner>
          <ion-spinner name="crescent" v-if="spinners.buttonSignup">
          </ion-spinner>
          <ion-button fill="clear" @click="login()">
            <ion-icon :icon="logInOutline"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="signup()">
            <ion-icon :icon="personAddOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item lines="none" v-if="userLogged == true">
          <ion-label style="color: white !important">{{ userName }}</ion-label>
          <ion-spinner name="crescent" v-if="spinners.buttonLogout">
          </ion-spinner>
          <ion-button fill="clear" @click="logout()">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-toolbar>

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
            optionSelected: $route.path == '/blog' || $route.params.date,
            optionNoSelected: $route.path != '/blog' && !$route.params.date,
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
          <!-- button source code-->
          <ion-button id="trigger-button">
            <ion-icon :icon="logoGitlab"></ion-icon>
          </ion-button>
          <ion-popover trigger="trigger-button">
            <ion-content>
              <ion-item
                button
                lines="full"
                href="https://www.gitlab.com/gonzam4/portafolio"
                target="_blank"
              >
                <ion-label>FrontEnd</ion-label>
              </ion-item>
              <ion-item
                button
                href="https://gitlab.com/gonzam4/portfolio-backend"
                target="_blank"
              >
                <ion-label>Backend</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>

          <!-- button feedback -->
          <ion-button @click="openModalFeedback">
            <ion-icon :icon="thumbsUpOutline"></ion-icon>
          </ion-button>

          <!-- dark button -->
          <ion-button
            fill="clear"
            @click="openModalThemeDesktop()"
            v-if="!androidPlatform && !iosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>
          <ion-button
            fill="clear"
            @click="openModalThemeMobile()"
            v-if="androidPlatform || iosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>

          <!-- more-->
          <ion-button fill="clear" @click="openModalAppsDesktop()">
            <ion-icon :icon="appsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
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
  IonSpinner,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  brushOutline,
  personAddOutline,
  logInOutline,
  logOutOutline,
  thumbsUpOutline,
  logoGitlab,
  appsOutline,
} from "ionicons/icons";
import DarkMode from "./darkmode/DarkMode.vue";
import sessionService from "../../services/session.vue";
import eventBus from "../../EventBus";
import systemService from "../../services/system.vue";
import userService from "../../services/user.vue";
import AppsComponent from "./apps/Apps.vue";

export default defineComponent({
  name: "MenuComponent",
  components: {
    IonContent,
    IonPage,
    IonToolbar,
    IonLabel,
    IonItem,
    IonButton,
    IonFooter,
    IonButtons,
    IonIcon,
    IonSpinner,
  },
  setup() {
    return {
      androidPlatform: isPlatform("android"),
      iosPlatform: isPlatform("ios"),
      brushOutline,
      personAddOutline,
      logInOutline,
      logOutOutline,
      thumbsUpOutline,
      logoGitlab,
      appsOutline,
    };
  },
  data() {
    return {
      userLogged: false,
      userName: null as null | string,
      spinners: {
        buttonLogin: false,
        buttonSignup: false,
        buttonLogout: false,
      },
    };
  },
  mounted() {
    eventBus().emitter.on("refresh-user-content", () => {
      this.getUserName();
    });
    this.getUserName();
  },
  methods: {
    async openModalThemeDesktop() {
      const modal = await modalController.create({
        component: DarkMode,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title",
        },
      });
      return modal.present();
    },

    async openModalThemeMobile() {
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

    async getUserName() {
      try {
        const response = await userService().getUserName();
        this.userLogged = true;
        this.userName = response;
      } catch (e: any) {
        this.userLogged = false;
        if (e.message == "Unauthorized") return;
        else {
          systemService().openToastErrror(e);
          console.error(e);
        }
      }
    },

    async openModalFeedback() {
      systemService().openModalFeedback({ type: "feedback" });
    },

    async login() {
      this.spinners.buttonLogin = true;
      await this.$router.push("/login");
      this.spinners.buttonLogin = false;
    },

    async signup() {
      this.spinners.buttonSignup = true;
      await this.$router.push("/signup");
      this.spinners.buttonSignup = false;
    },

    async logout() {
      this.spinners.buttonLogout = true;

      try {
        await sessionService().logout();
        this.spinners.buttonLogout = false;
        const token = (document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
        userService().setUserToken({ token });
        this.userLogged = false;
        sessionService().removeUserCached();
        location.reload();
      } catch (e: any) {
        this.spinners.buttonLogout = false;
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    async openModalAppsDesktop() {
      const modal = await modalController.create({
        component: AppsComponent,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title",
        },
      });
      return modal.present();
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
.ion-item-menu {
  --detail-icon-color: white;
}
</style>
