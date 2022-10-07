<template>
  <ion-page>
    <ion-content>
      <ion-toolbar>
        <img
          src="@/assets/portafolio/dowar.png"
          style="max-width: 230px; margin-left: 14px"
        />
      </ion-toolbar>

      <ion-toolbar class="menu-color">
        <!-- no logged -->
        <ion-item
          v-if="useUser.isLogged.value == false"
          lines="none"
          class="transparent"
        >
          <ion-label style="color: white !important">Bienvenido</ion-label>

          <ion-button
            :disabled="spinners.buttonLogin"
            fill="clear"
            @click="login()"
          >
            <ion-icon
              v-if="spinners.buttonLogin == false"
              :icon="logInOutline"
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonLogin"
              name="crescent"
              color="primary"
            >
            </ion-spinner>
          </ion-button>

          <ion-button
            :disabled="spinners.buttonSignup"
            fill="clear"
            @click="signup()"
          >
            <ion-icon
              v-if="spinners.buttonSignup == false"
              :icon="personAddOutline"
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonSignup"
              name="crescent"
              color="primary"
            >
            </ion-spinner>
          </ion-button>
        </ion-item>

        <!-- logged -->
        <ion-item
          v-if="useUser.isLogged.value == true"
          lines="none"
          class="transparent"
        >
          <ion-avatar slot="start">
            <img :src="useUser.imageProfile.value.toString()" />
          </ion-avatar>

          <ion-label style="color: white !important">{{
            useUser.user.value.user
          }}</ion-label>

          <ion-button
            fill="clear"
            @click="setOpenPopOverUserOptions(true, $event)"
          >
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            :is-open="isOpenRefPopOverUserOptions"
            css-class="my-custom-class"
            :event="eventPopOverUserOptions"
            @did-dismiss="setOpenPopOverUserOptions(false)"
          >
            <ion-content>
              <!-- admin panel -->
              <ion-item
                v-if="useUser.user.value.isAdmin"
                button
                :disabled="spinners.buttonAdminPanel"
                lines="none"
                @click="goToAdminPanel()"
              >
                <ion-icon
                  v-if="spinners.buttonAdminPanel == false"
                  slot="start"
                  :icon="cogOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.buttonAdminPanel"
                  slot="start"
                  color="primary"
                  name="crescent"
                >
                </ion-spinner>
                <ion-label>Panel administrador</ion-label>
              </ion-item>

              <!-- user panel -->
              <ion-item
                :disabled="spinners.buttonUserPanel"
                button
                lines="none"
                @click="goToUserPanel()"
              >
                <ion-icon
                  v-if="spinners.buttonUserPanel == false"
                  slot="start"
                  :icon="personOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.buttonUserPanel"
                  slot="start"
                  color="primary"
                  name="crescent"
                >
                </ion-spinner>
                <ion-label>Panel usuario</ion-label>
              </ion-item>

              <!-- logout -->
              <ion-item
                :disabled="spinners.buttonLogout"
                button
                lines="none"
                @click="logout()"
              >
                <ion-icon
                  v-if="spinners.buttonLogout == false"
                  slot="start"
                  :icon="logOutOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.buttonLogout"
                  slot="start"
                  color="primary"
                  name="crescent"
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
        class="transparent"
        button
        @click="openRoute('/presentation')"
      >
        <ion-icon
          slot="start"
          :icon="personOutline"
          :class="{
            optionSelected: $route.path == '/presentation',
            optionNoSelected: $route.path != '/presentation',
          }"
        ></ion-icon>
        <ion-label
          :class="{
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
        class="transparent"
        @click="openRoute('/history')"
      >
        <ion-icon
          slot="start"
          :icon="bookOutline"
          :class="{
            optionSelected: $route.path == '/history',
            optionNoSelected: $route.path != '/history',
          }"
        ></ion-icon>
        <ion-label
          :class="{
            optionSelected: $route.path == '/history',
            optionNoSelected: $route.path != '/history',
          }"
        >
          Historia
        </ion-label>
      </ion-item>

      <ion-item
        class="transparent"
        lines="none"
        button
        @click="openRoute('/skills')"
      >
        <ion-icon
          slot="start"
          :icon="constructOutline"
          :class="{
            optionSelected: $route.path == '/skills',
            optionNoSelected: $route.path != '/skills',
          }"
        ></ion-icon>
        <ion-label
          :class="{
            optionSelected: $route.path == '/skills',
            optionNoSelected: $route.path != '/skills',
          }"
        >
          Habilidades</ion-label
        >
      </ion-item>

      <ion-item
        lines="none"
        class="transparent"
        button
        @click="openRoute('/portfolio')"
      >
        <ion-icon
          slot="start"
          :icon="fileTrayOutline"
          :class="{
            optionSelected: $route.path == '/portfolio',
            optionNoSelected: $route.path != '/portfolio',
          }"
        ></ion-icon>
        <ion-label
          :class="{
            optionSelected: $route.path == '/portfolio',
            optionNoSelected: $route.path != '/portfolio',
          }"
        >
          Portfolio
        </ion-label>
      </ion-item>

      <ion-item
        lines="none"
        class="transparent"
        button
        @click="openRoute('/blog')"
      >
        <ion-icon
          slot="start"
          :icon="libraryOutline"
          :class="{
            optionSelected: $route.path == '/blog' || $route.params.date,
            optionNoSelected: $route.path != '/blog' && !$route.params.date,
          }"
        ></ion-icon>
        <ion-label
          :class="{
            optionSelected: $route.path == '/blog' || $route.params.date,
            optionNoSelected: $route.path != '/blog' && !$route.params.date,
          }"
        >
          Blog
        </ion-label>
      </ion-item>
    </ion-content>

    <!-- footer -->
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <!-- more -->
          <ion-button
            fill="clear"
            color="primary"
            @click="openModalDonations()"
          >
            <ion-icon :icon="cashOutline"></ion-icon>
          </ion-button>

          <!-- button source code-->
          <ion-button id="trigger-button-source-code" color="primary">
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
          <ion-button color="primary" @click="openModalFeedback">
            <ion-icon :icon="thumbsUpOutline"></ion-icon>
          </ion-button>

          <!-- dark button -->
          <ion-button
            v-if="!isAndroidPlatform && !isIosPlatform"
            fill="clear"
            color="primary"
            @click="openModalThemeDesktop()"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>

          <ion-button
            v-if="isAndroidPlatform || isIosPlatform"
            fill="clear"
            color="primary"
            @click="openModalThemeMobile()"
          >
            <ion-icon :icon="brushOutline"></ion-icon>
          </ion-button>

          <!-- more -->
          <ion-button fill="clear" color="primary" @click="openModalApps()">
            <ion-icon :icon="appsOutline"></ion-icon>
          </ion-button>

          <!-- policies -->
          <ion-button fill="clear" color="primary" @click="goToPoliciesPage()">
            <ion-icon :icon="documentsOutline"></ion-icon>
          </ion-button>

          <!-- collapse menu -->
          <ion-button
            v-if="windowSize.width >= 767"
            fill="clear"
            color="primary"
            @click="changeMenuCollapse({ option: true })"
          >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  cashOutline,
  bookOutline,
  constructOutline,
  fileTrayOutline,
  libraryOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import DarkMode from "../darkmode/DarkMode.vue";
import { logout } from "../../../services/session";
import AppsComponent from "../apps/Apps.vue";
import DonationsComponent from "../donations/Donations.vue";
import { useUser } from "../../../composables/useUser";
import { USER_MENU } from "../../../services/graphql";
import { useSystem } from "../../../composables/useSystem";

export default defineComponent({
  name: "DefaultMenuComponent",
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
      cashOutline,
      useUser: useUser(),
      reportFeedback: useSystem().reportError,
      bookOutline,
      constructOutline,
      fileTrayOutline,
      libraryOutline,
      chevronBackOutline,
      chevronForwardOutline,
      changeMenuCollapse: useSystem().changeMenuCollapse,
    };
  },

  data() {
    return {
      spinners: {
        buttonLogin: false,
        buttonSignup: false,
        buttonLogout: false,
        buttonUserPanel: false,
        buttonAdminPanel: false,
      },
        windowSize: {
          width: window.innerWidth,
        },
    };
  },

  mounted() {
    this.getUser();
    window.addEventListener("resize", () => {
      this.windowSize.width = window.innerWidth;
    });
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
      this.useUser.loadUser({
        graphql: { name: USER_MENU, fragment: "UserMenu" },
      });
    },

    async openModalFeedback() {
      this.reportFeedback({ type: "feedback" });
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
      await this.useUser.logout();
      this.spinners.buttonLogout = false;
      location.reload();
    },

    async openModalApps() {
      const modal = await modalController.create({
        component: AppsComponent,
        cssClass: "my-custom-class",
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

    async openModalDonations() {
      const modal = await modalController.create({
        cssClass: "my-custom-class",
        component: DonationsComponent,
      });
      menuController.close();
      return modal.present();
    },
  },
});
</script>

<style scoped>
.optionSelected {
  color: var(--ion-color-primary) !important;
}
.optionNoSelected {
  color: white !important;
}
ion-content,
ion-toolbar {
  --background: #2e3440;
}
</style>
