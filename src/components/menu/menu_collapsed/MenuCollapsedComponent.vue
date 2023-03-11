<template>
  <ion-page>
    <ion-content >
      <ion-toolbar>
        <div class="center">
          <img
            src="@/assets/portafolio/logo_dowar_2.1.png"
            style="max-width: 4vw;margin: 1rem;"
          />
        </div>
      </ion-toolbar>

      <ion-toolbar class="menu-color">
        <!-- no logged -->
        <section>
          <ion-item
            v-if="useUser.isLogged.value == false"
            button
            lines="none"
            class="transparent"
            @click="login()"
          >
            <ion-icon
              v-if="spinners.buttonLogin == false"
              :icon="logInOutline"
              class="item-icon-center"
            color='primary'
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonLogin"
              name="crescent"
              color="primary"
            >
            </ion-spinner>
          </ion-item>

          <ion-item
            v-if="useUser.isLogged.value == false"
            button
            lines="none"
            class="transparent"
            @click="signup()"
          >
            <ion-icon
              v-if="spinners.buttonSignup == false"
              :icon="personAddOutline"
              class="item-icon-center"
            color='primary'
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonSignup"
              name="crescent"
              color="primary"
            >
            </ion-spinner>
          </ion-item>
        </section>
        <hr />

        <!-- logged -->
        <ion-item
          v-if="useUser.isLogged.value == true"
          lines="none"
          class="transparent"
          button
          @click="setOpenPopOverUserOptions(true, $event)"
        >
          <ion-avatar style="width: 100%">
            <div class="center">
              <img
                :src="useUser.imageProfile.value.toString()"
                style="width: 40px"
              />
            </div>
          </ion-avatar>
        </ion-item>
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
      </ion-toolbar>

      <section>
        <ion-item
          lines="none"
          class="transparent"
          button
          @click="openRoute('/presentation')"
        >
          <ion-icon
            :icon="personOutline"
            :class="{
              optionSelected: $route.path == '/presentation',
              optionNoSelected: $route.path != '/presentation',
            }"
            class="item-icon-center"
          ></ion-icon>
        </ion-item>

        <ion-item
          lines="none"
          class="transparent"
          button
          @click="openRoute('/blog')"
        >
          <ion-icon
            :icon="libraryOutline"
            :class="{
              optionSelected: $route.path == '/blog' || $route.params.date,
              optionNoSelected: $route.path != '/blog' && !$route.params.date,
            }"
            class="item-icon-center"
          ></ion-icon>
        </ion-item>
      </section>

      <hr />

      <!-- more -->
      <section>
        <ion-item
          lines="none"
          class="transparent"
          button
          @click="openModalDonations()"
        >
          <ion-icon
            :icon="cashOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-item
          id="trigger-button-source-code"
          lines="none"
          class="transparent"
          button
        >
          <ion-icon
            :icon="logoGitlab"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>
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

        <ion-item
          lines="none"
          class="transparent"
          button
          @click="openModalFeedback()"
        >
          <ion-icon
            :icon="thumbsUpOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-item
          v-if="!isAndroidPlatform && !isIosPlatform"
          lines="none"
          class="transparent"
          button
          @click="openModalThemeDesktop()"
        >
          <ion-icon
            :icon="brushOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-item
          v-if="isAndroidPlatform || isIosPlatform"
          lines="none"
          class="transparent"
          button
          @click="openModalThemeMobile()"
        >
          <ion-icon
            :icon="brushOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-item
          lines="none"
          class="transparent"
          button
          @click="openModalApps()"
        >
          <ion-icon
            :icon="appsOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-item
          lines="none"
          class="transparent"
          button
          @click="goToPoliciesPage()"
        >
          <ion-icon
            :icon="documentsOutline"
            class="item-icon-center"
            color="primary"
          ></ion-icon>
        </ion-item>
      </section>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <!-- button collapse menu -->
        <div class="center" >
          <ion-button
            fill="clear"
            color="primary"
            @click="changeMenuCollapse({ option: false })"
          >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>
        </div>
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
  name: "MenuCollapsedComponent",
  components: {
    IonContent,
    IonPage,
    IonToolbar,
    IonLabel,
    IonItem,
    IonButton,
    IonFooter,
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
    };
  },

  mounted() {
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
.item-icon-center {
  width: 100%;
  text-align: center;
}
hr {
  border-color: #3c424d;
  border-width: 1px;
  border-style: solid;
}
.sticky {
  position: sticky;
  z-index: 3;
  top: 0px;
}
</style>
