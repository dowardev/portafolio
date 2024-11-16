<template>
  <ion-page>
    <ion-content>
      <ion-toolbar>
        <div class="center">
          <img
            src="@/assets/portafolio/logo_dowar_2.1.png"
            style="max-width: 4vw; margin: 1rem"
          />
        </div>
      </ion-toolbar>

      <ion-toolbar>
        <!-- no logged -->
        <section>
          <ion-item
            v-if="useUser().isLogged.value == false"
            button
            lines="none"
            class="transparent"
            @click="login()"
          >
            <ion-icon
              v-if="spinners.buttonLogin == false"
              :icon="logInOutline"
              class="item-icon-center"
              color="primary"
            ></ion-icon>
            <ion-spinner
              v-if="spinners.buttonLogin"
              name="crescent"
              color="primary"
            >
            </ion-spinner>
          </ion-item>

          <ion-item
            v-if="useUser().isLogged.value == false"
            button
            lines="none"
            class="transparent"
            @click="signup()"
          >
            <ion-icon
              v-if="spinners.buttonSignup == false"
              :icon="personAddOutline"
              class="item-icon-center"
              color="primary"
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
          v-if="useUser().isLogged.value == true"
          lines="none"
          class="transparent"
          button
          @click="setOpenPopOverUserOptions(true, $event)"
        >
          <ion-avatar style="width: 100%">
            <div class="center">
              <img
                :src="useUser().imageProfile.value.toString()"
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
              v-if="useUser().user.value.isAdmin"
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
              optionSelected: $route.path == '/blog' || $route.params.id,
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
        <div class="center">
          <ion-button
            fill="clear"
            color="primary"
            @click="useSystem().changeMenuCollapse({ option: false })"
          >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
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
import { defineComponent, onMounted, ref } from "vue";
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
import AppsComponent from "../apps/Apps.vue";
import DonationsComponent from "../donations/Donations.vue";
import { useUser } from "../../../controllers/userController";
import { USER_MENU } from "../../../services/graphql";
import { useSystem } from "../../../controllers/systemController";
import ThemeComponente from "@/components/theme/ThemeComponente.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isOpenRefPopOverUserOptions = ref(false);
const eventPopOverUserOptions = ref();
const setOpenPopOverUserOptions = (state: boolean, ev?: Event) => {
  eventPopOverUserOptions.value = ev;
  isOpenRefPopOverUserOptions.value = state;
};
const isAndroidPlatform = isPlatform("android");
const isIosPlatform = isPlatform("ios");

const spinners = {
  buttonLogin: false,
  buttonSignup: false,
  buttonLogout: false,
  buttonUserPanel: false,
  buttonAdminPanel: false,
};

// mounted
onMounted(() => {
  getUser();
});

// functions
async function openModalThemeDesktop() {
  const modal = await modalController.create({
    component: ThemeComponente,
    cssClass: "my-custom-class",
    componentProps: {
      title: "New Title",
    },
  });
  return modal.present();
}

async function openModalThemeMobile() {
  const modal = await modalController.create({
    component: ThemeComponente,
    initialBreakpoint: 0.5,
    breakpoints: [0, 0.5, 1],
  });
  modal.present();
  menuController.close();
}

function openRoute(route: string) {
  router.push(route);
  menuController.close();
}

async function getUser() {
  useUser().loadUser({
    graphql: { name: USER_MENU, fragment: "UserMenu" },
  });
}

async function openModalFeedback() {
  useSystem().reportError({ type: "feedback" });
  menuController.close();
}

async function login() {
  spinners.buttonLogin = true;
  await router.push("/login");
  spinners.buttonLogin = false;
  menuController.close();
}

async function signup() {
  spinners.buttonSignup = true;
  await router.push("/signup");
  spinners.buttonSignup = false;
  menuController.close();
}

async function logout() {
  spinners.buttonLogout = true;
  await useUser().logout();
  spinners.buttonLogout = false;
  location.reload();
}

async function openModalApps() {
  const modal = await modalController.create({
    component: AppsComponent,
    cssClass: "my-custom-class",
  });
  menuController.close();
  return modal.present();
}

function goToPoliciesPage() {
  router.push("/policies");
  if (isPlatform("mobile")) menuController.close();
}

async function goToUserPanel() {
  spinners.buttonUserPanel = true;
  await router.push("/user");
  spinners.buttonUserPanel = false;
  isOpenRefPopOverUserOptions.value = false;
  if (isPlatform("mobile")) menuController.close();
}

async function goToAdminPanel() {
  spinners.buttonAdminPanel = true;
  await router.push("/admin-panel");
  spinners.buttonAdminPanel = false;
  isOpenRefPopOverUserOptions.value = false;
  if (isPlatform("mobile")) menuController.close();
}

async function openModalDonations() {
  const modal = await modalController.create({
    cssClass: "my-custom-class",
    component: DonationsComponent,
  });
  menuController.close();
  return modal.present();
}
</script>

<style scoped>
.optionSelected {
  background: var(--ion-color-primary);
  border-radius: 6px;
  padding: 8px;
  color: white;
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
</style>
