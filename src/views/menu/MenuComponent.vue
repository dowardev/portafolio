<template>
  <ion-page>
    <ion-content class="menu-color">
      <ion-toolbar class="menu-color">
        <img src="../../../public/assets/portafolio/dowar.png" />
      </ion-toolbar>

      <ion-toolbar class="menu-color">
        <ion-item lines="none" v-if="userLogged == false">
          <ion-label style="color: white !important">Bienvenido</ion-label>

          <!-- no logged -->
          <ion-button
            fill="clear"
            @click="login()"
            :disabled="spinners.buttonLogin"
          >
            <ion-icon
              :icon="logInOutline"
              v-if="spinners.buttonLogin == false"
            ></ion-icon>
            <ion-spinner
              name="crescent"
              v-if="spinners.buttonLogin"
              color="primary"
            >
            </ion-spinner>
          </ion-button>

          <ion-button
            fill="clear"
            @click="signup()"
            :disabled="spinners.buttonSignup"
          >
            <ion-icon
              :icon="personAddOutline"
              v-if="spinners.buttonSignup == false"
            ></ion-icon>
            <ion-spinner
              name="crescent"
              v-if="spinners.buttonSignup"
              color="primary"
            >
            </ion-spinner>
          </ion-button>
        </ion-item>

        <!-- logged -->
        <ion-item lines="none" v-if="userLogged == true">
          <ion-avatar slot="start">
            <img :src="user.imageSource" />
          </ion-avatar>

          <ion-label style="color: white !important">{{ user.user }}</ion-label>

          <ion-button
            @click="setOpenPopOverUserOptions(true, $event)"
            fill="clear"
          >
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            :is-open="isOpenRefPopOverUserOptions"
            css-class="my-custom-class"
            :event="eventPopOverUserOptions"
            @didDismiss="setOpenPopOverUserOptions(false)"
          >
            <ion-content>
              <!-- admin panel -->
              <ion-item
                button
                @click="goToAdminPanel()"
                :disabled="spinners.buttonAdminPanel"
                lines="none"
              >
                <ion-icon
                  :icon="cogOutline"
                  v-if="spinners.buttonAdminPanel == false"
                  slot="start"
                ></ion-icon>
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonAdminPanel"
                  color="primary"
                  slot="start"
                >
                </ion-spinner>
                <ion-label>Panel administrador</ion-label>
              </ion-item>

              <!-- user panel -->
              <ion-item
                button
                @click="goToUserPanel()"
                :disabled="spinners.buttonUserPanel"
                lines="none"
              >
                <ion-icon
                  :icon="personOutline"
                  v-if="spinners.buttonUserPanel == false"
                  slot="start"
                ></ion-icon>
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonUserPanel"
                  color="primary"
                  slot="start"
                >
                </ion-spinner>
                <ion-label>Panel usuario</ion-label>
              </ion-item>

              <!-- logout -->
              <ion-item
                button
                @click="logout()"
                :disabled="spinners.buttonLogout"
                lines="none"
              >
                <ion-icon
                  :icon="logOutOutline"
                  v-if="spinners.buttonLogout == false"
                  slot="start"
                ></ion-icon>
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonLogout"
                  color="primary"
                  slot="start"
                >
                </ion-spinner>
                <ion-label>Cerrar sesion</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
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
          <ion-button id="trigger-button-source-code">
            <ion-icon :icon="logoGitlab"></ion-icon>
          </ion-button>
          <ion-popover trigger="trigger-button-source-code">
            <ion-content>
              <ion-item
                button
                lines="none"
                href="https://www.gitlab.com/gonzam4/portafolio"
                target="_blank"
              >
                <ion-label>FrontEnd</ion-label>
              </ion-item>
              <ion-item
                button
                href="https://gitlab.com/gonzam4/portfolio-backend"
                target="_blank"
                lines="none"
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
            v-if="!isAndroidPlatform && !isIosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>
          <ion-button
            fill="clear"
            @click="openModalThemeMobile()"
            v-if="isAndroidPlatform || isIosPlatform"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>

          <!-- more -->
          <ion-button fill="clear" @click="openModalApps()">
            <ion-icon :icon="appsOutline"></ion-icon>
          </ion-button>

          <!-- policies -->
          <ion-button fill="clear" @click="goToPoliciesPage()">
            <ion-icon :icon="documentsOutline"></ion-icon>
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
import { defineComponent, ref } from "vue";
import {
  brushOutline,
  personAddOutline,
  logInOutline,
  logOutOutline,
  thumbsUpOutline,
  logoGitlab,
  appsOutline,
  documentsOutline,
  personOutline,
  cogOutline,
  ellipsisVerticalOutline,
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
    const isOpenRefPopOverUserOptions = ref(false);
    const eventPopOverUserOptions = ref();
    const setOpenPopOverUserOptions = (state: boolean, ev?: Event) => {
      eventPopOverUserOptions.value = ev;
      isOpenRefPopOverUserOptions.value = state;
    };
    return {
      isAndroidPlatform: isPlatform("android"),
      isIosPlatform: isPlatform("ios"),
      brushOutline,
      personAddOutline,
      logInOutline,
      logOutOutline,
      thumbsUpOutline,
      logoGitlab,
      appsOutline,
      documentsOutline,
      personOutline,
      cogOutline,
      ellipsisVerticalOutline,
      isOpenRefPopOverUserOptions,
      setOpenPopOverUserOptions,
      eventPopOverUserOptions,
    };
  },

  data() {
    return {
      userLogged: false,
      user: {
        user: "",
        imageSource: require("../../../public/assets/otros/user.png"),
      },
      spinners: {
        buttonLogin: false,
        buttonSignup: false,
        buttonLogout: false,
        buttonUserPanel: false,
        buttonAdminPanel: false,
      },
    };
  },
  mounted() {
    eventBus().emitter.on("refresh-user-content", () => {
      this.getUser();
    });
    this.getUser();
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

    async getUser() {
      const query = `
          user {
            user 
            image_source
          }
    `;
      try {
        const response = await userService().getUser({ query });
        // eslint-disable-next-line
        this.user.user = response.user!;

        if (response.image_source) {
          this.user.imageSource =
            // eslint-disable-next-line
            "data:image/png;base64," + response.image_source!;
        }
        this.userLogged = true;
      } catch (e: any) {
        if (e.message == "Unauthorized") return;
        else {
          systemService().openToastErrror(e);
          console.error(e);
        }
      }
    },

    async openModalFeedback() {
      systemService().openModalFeedback({ type: "feedback" });
      menuController.close();
    },

    async login() {
      this.spinners.buttonLogin = true;
      await this.$router.push("/login");
      this.spinners.buttonLogin = false;
      menuController.close();
    },

    async signup() {
      this.spinners.buttonSignup = true;
      await this.$router.push("/signup");
      this.spinners.buttonSignup = false;
      menuController.close();
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
      this.isOpenRefPopOverUserOptions = false;
      menuController.close();
    },

    async openModalApps() {
      const modal = await modalController.create({
        component: AppsComponent,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title",
        },
      });
      menuController.close();
      return modal.present();
    },

    goToPoliciesPage() {
      this.$router.push("/policies");
      if (isPlatform("mobile")) menuController.close();
    },

    async goToUserPanel() {
      this.spinners.buttonUserPanel = true;
      await this.$router.push("/user");
      this.spinners.buttonUserPanel = false;
      this.isOpenRefPopOverUserOptions = false;
      if (isPlatform("mobile")) menuController.close();
    },

    async goToAdminPanel() {
      this.spinners.buttonAdminPanel = true;
      await this.$router.push("/admin-panel");
      this.spinners.buttonAdminPanel = false;
      this.isOpenRefPopOverUserOptions = false;
      if (isPlatform("mobile")) menuController.close();
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
