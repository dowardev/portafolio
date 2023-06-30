<template>
  <ion-page>
    <ion-header mode="ios" class="ion-no-border">
      <ion-toolbar>
        <!-- <img -->
        <!--   src="@/assets/portafolio/dowar.png" -->
        <!--   style="max-width: 230px; margin-left: 14px" -->
        <!-- /> -->
        <ion-label class="center">Dowar Blog</ion-label>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- session -->
      <section class="section-options">
        <ion-row>
          <ion-col size="12">
            <!-- logged -->
            <ion-item
              v-if="useUser().isLogged.value == true"
              lines="none"
              class="transparent"
              @click="setOpenPopOverUserOptions(true, $event)"
            >
              <!-- <ion-avatar slot="start"> -->
              <!--   <img :src="useUser().imageProfile.value.toString()" /> -->
              <!-- </ion-avatar> -->

              <ion-label>{{ useUser().user.value.user }}</ion-label>

              <ion-button
                slot="end"
                fill="clear"
                @click="
                  eventPopOverUserOptions = $event;
                  isOpenRefPopOverUserOptions = true;
                "
              >
                <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- no logged -->
            <ion-item
              v-if="useUser().isLogged.value == false"
              class="transparent"
              lines="none"
            >
              <ion-button fill="clear" @click="openRoute('/login')">
                Iniciar sesión
              </ion-button>
              <ion-button fill="clear" @click="openRoute('/signup')"
                >Registrar</ion-button
              >
            </ion-item>
          </ion-col>
        </ion-row>
      </section>

      <ion-row>
        <ion-col>
          <ion-card class="ion-padding-top ion-padding-bottom">
            <!-- navigation -->
            <section>
              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute('/presentation')"
                >
                  <div slot="start">
                    <ion-icon
                      :icon="personOutline"
                      :class="{
                        iconOptionSelected: $route.path == '/presentation',
                        iconOptionNoSelected: $route.path != '/presentation',
                      }"
                    ></ion-icon>
                  </div>

                  <ion-label class="labelOptionMenu"> Presentación </ion-label>
                </ion-item>
              </div>

              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute('/blog')"
                >
                  <div slot="start">
                    <ion-icon
                      :icon="libraryOutline"
                      :class="{
                        iconOptionSelected:
                          $route.path == '/blog' || $route.params.id,
                        iconOptionNoSelected:
                          $route.path != '/blog' || $route.params.id,
                      }"
                    ></ion-icon>
                  </div>

                  <ion-label class="labelOptionMenu"> Blog </ion-label>
                </ion-item>
              </div>

              <!-- policies -->
              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute('/policies')"
                >
                  <div slot="start">
                    <ion-icon
                      :icon="documentsOutline"
                      :class="{
                        iconOptionSelected: $route.path == '/policies',
                        iconOptionNoSelected: $route.path != '/policies',
                      }"
                    ></ion-icon>
                  </div>
                  <ion-label>Politicas</ion-label>
                </ion-item>
              </div>
            </section>

            <!-- more options -->
            <section>
              <div>
                <ion-accordion-group>
                  <ion-accordion value="first">
                    <ion-item
                      slot="header"
                      class="accordion-more-options-background-color"
                    >
                      <ion-label>Mas opciones</ion-label>
                    </ion-item>

                    <!-- contribute -->
                    <div slot="content">
                      <ion-item
                        lines="none"
                        button
                        @click="openModalDonations()"
                      >
                        <ion-icon slot="start" :icon="cashOutline"></ion-icon>
                        <ion-label>Contribuir</ion-label>
                      </ion-item>

                      <!-- source code options -->
                      <ion-item
                        id="trigger-button-source-code"
                        lines="none"
                        button
                      >
                        <ion-icon slot="start" :icon="logoGitlab"></ion-icon>
                        <ion-label>Codigo fuente</ion-label>
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

                      <!-- button feedback -->
                      <ion-item lines="none" button @click="openModalFeedback">
                        <ion-icon
                          slot="start"
                          :icon="thumbsUpOutline"
                        ></ion-icon>
                        <ion-label>Comentarios</ion-label>
                      </ion-item>

                      <!-- dark button desktop-->
                      <ion-item
                        v-if="isPlatform('desktop')"
                        lines="none"
                        button
                        @click="openModalThemeDesktop"
                      >
                        <ion-icon slot="start" :icon="brushOutline"></ion-icon>
                        <ion-label>Tema</ion-label>
                      </ion-item>

                      <!-- dark button mobile -->
                      <ion-item
                        v-if="!isPlatform('desktop')"
                        lines="none"
                        button
                        @click="openModalThemeDesktop"
                      >
                        <ion-icon slot="start" :icon="brushOutline"></ion-icon>
                        <ion-label>Tema</ion-label>
                      </ion-item>

                      <!-- more -->
                      <ion-item lines="none" button @click="openModalApps">
                        <ion-icon slot="start" :icon="appsOutline"></ion-icon>
                        <ion-label>Mas</ion-label>
                      </ion-item>
                    </div>
                  </ion-accordion>
                </ion-accordion-group>
              </div>
            </section>
          </ion-card>
        </ion-col>
      </ion-row>

      <!-- popovers -->
      <!-- popover user options -->
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
    </ion-content>
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
import { onMounted, ref } from "vue";
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
  libraryOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import AppsComponent from "../apps/Apps.vue";
import DonationsComponent from "../donations/Donations.vue";
import { useUser } from "../../../composables/useUser";
import { USER_MENU } from "../../../services/graphql";
import { useSystem } from "../../../composables/useSystem";
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

const spinners = ref({
  buttonLogin: false,
  buttonSignup: false,
  buttonLogout: false,
  buttonUserPanel: false,
  buttonAdminPanel: false,
});
const windowSize = ref({
  width: window.innerWidth,
});

// mounted
onMounted(() => {
  getUser();
  window.addEventListener("resize", () => {
    windowSize.value.width = window.innerWidth;
  });
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

function openRoute(route: string) {
  router.push(route);
  menuController.close();
}

async function getUser() {
  try {
    useUser().loadUser({
      graphql: { name: USER_MENU, fragment: "UserMenu", refetch: true },
    });
  } catch (error) {}
}

async function openModalFeedback() {
  useSystem().reportError({ type: "feedback" });
  menuController.close();
}

async function login() {
  spinners.value.buttonLogin = true;
  await router.push("/login");
  spinners.value.buttonLogin = false;
  menuController.close();
}

async function signup() {
  spinners.value.buttonSignup = true;
  await router.push("/signup");
  spinners.value.buttonSignup = false;
  menuController.close();
}

async function logout() {
  spinners.value.buttonLogout = true;
  await useUser().logout();
  spinners.value.buttonLogout = false;
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

async function goToUserPanel() {
  spinners.value.buttonUserPanel = true;
  await router.push("/user");
  spinners.value.buttonUserPanel = false;
  isOpenRefPopOverUserOptions.value = false;
  if (isPlatform("mobile")) menuController.close();
}

async function goToAdminPanel() {
  spinners.value.buttonAdminPanel = true;
  await router.push("/admin-panel");
  spinners.value.buttonAdminPanel = false;
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
.iconOptionSelected {
  background: var(--ion-color-primary);
  border-radius: 6px;
  padding: 8px;
  color: white;
}

.iconOptionNoSelected {
  padding: 8px;
}

.labelOptionMenu {
  color: var(--ion-color-primary);
}

@media only screen and (min-width: 992px) {
  .menu {
    height: 85%;
    display: flex;
    padding-left: 16px;
    justify-content: center;
  }
}

.menu-container {
  width: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>
