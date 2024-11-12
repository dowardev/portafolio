<template>
  <ion-page class="menu-container">
    <ion-content>
      <div>
        <ion-row>
          <ion-col>
            <!-- user logged -->
            <ion-item
              v-if="Object.keys(useUser().user.value).length > 0"
              lines="none"
              class="transparent"
              @click="setOpenPopOverUserOptions(true, $event)"
            >
              <ion-label>{{ useUser().user.value.name }}</ion-label>

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
              v-if="Object.keys(useUser().user.value).length == 0"
              class="transparent"
              lines="none"
            >
              <ion-button
                fill="clear"
                @click="openRoute({ name: 'LoginPage' })"
              >
                Iniciar sesión
              </ion-button>
              <ion-button
                fill="clear"
                @click="openRoute({ name: 'SignUpPage' })"
                >Registrar</ion-button
              >
            </ion-item>

            <!-- navigation -->
            <section>
              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute({ name: 'PresentationPage' })"
                >
                  <div slot="start">
                    <ion-icon
                      :icon="personOutline"
                      :class="{
                        iconOptionSelected:
                          $route.name == 'PresentationPage' ||
                          $route.name == 'SkillsPage' ||
                          $route.name == 'HistoryPage' ||
                          $route.name == 'PortfolioPage',

                        iconOptionNoSelected:
                          $route.name != 'PresentationPage' &&
                          $route.name != 'SkillsPage' &&
                          $route.name != 'HistoryPage' &&
                          $route.name != 'PortfolioPage',
                      }"
                    ></ion-icon>
                  </div>

                  <ion-label
                    :class="{
                      labelOptionMenu:
                        $route.name == 'PresentationPage' ||
                        $route.name == 'SkillsPage' ||
                        $route.name == 'HistoryPage' ||
                        $route.name == 'PortfolioPage',
                    }"
                  >
                    Presentación
                  </ion-label>
                </ion-item>
              </div>

              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute({ name: 'PostsPage' })"
                >
                  <div slot="start">
                    <ion-icon
                      :icon="libraryOutline"
                      :class="{
                        iconOptionSelected: $route.name == 'PostsPage',
                        iconOptionNoSelected: $route.name != 'PostsPage',
                      }"
                    ></ion-icon>
                  </div>

                  <ion-label
                    :class="{ labelOptionMenu: $route.name == 'PostsPage' }"
                  >
                    Blog
                  </ion-label>
                </ion-item>
              </div>

              <!-- policies -->
              <div>
                <ion-item
                  lines="none"
                  class="transparent"
                  button
                  @click="openRoute({ name: 'PoliciesPage' })"
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
                  <ion-label
                    :class="{ labelOptionMenu: $route.name == 'PoliciesPage' }"
                    >Políticas</ion-label
                  >
                </ion-item>
              </div>
            </section>

            <!-- more options -->
            <section>
              <div>
                <ion-accordion-group value="first">
                  <ion-accordion
                    value="first"
                    style="background: var(--ion-color-dark-contrast)"
                  >
                    <ion-item
                      slot="header"
                      style="background: var(--ion-color-dark-contrast)"
                    >
                      <ion-label>Mas opciones</ion-label>
                    </ion-item>

                    <!-- contribute -->
                    <div slot="content">
                      <ion-item
                        lines="none"
                        button
                        @click="modalContribute.open = true"
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
                      <ion-item
                        lines="none"
                        button
                        @click="modalComments.open = true"
                      >
                        <ion-icon
                          slot="start"
                          :icon="thumbsUpOutline"
                        ></ion-icon>
                        <ion-label>Comentarios</ion-label>
                      </ion-item>

                      <!-- dark button desktop-->
                      <!-- <ion-item
                        id="open-modal-theme-component"
                        lines="none"
                        button
                      >
                        <ion-icon slot="start" :icon="brushOutline"></ion-icon>
                        <ion-label>Tema</ion-label>
                      </ion-item> -->

                      <!-- new features -->
                      <ion-item
                        id="open-modal-new-features"
                        lines="none"
                        button
                      >
                        <ion-icon
                          slot="start"
                          :icon="newspaperOutline"
                        ></ion-icon>
                        <ion-label>Novedades</ion-label>

                        <ion-chip
                          slot="end"
                          color="primary"
                          v-if="systemComposable.getUpdateStatus() == true"
                          >Novedad</ion-chip
                        >
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
          </ion-col>
        </ion-row>
      </div>

      <!-- popovers -->
      <!-- popover user options -->
      <ion-popover
        :is-open="isOpenRefPopOverUserOptions"
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
            class="transparent"
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
            class="transparent"
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
            class="transparent"
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
            <ion-label>Cerrar sesión</ion-label>
          </ion-item>
        </ion-content>
      </ion-popover>

      <!-- modals -->
      <!-- modal theme -->
      <ion-modal trigger="open-modal-theme-component">
        <ThemeComponente />
      </ion-modal>

      <!-- modal new features -->
      <ion-modal trigger="open-modal-new-features">
        <NewFeaturesComponent />
      </ion-modal>

      <!-- modal contribute -->
      <ion-modal :is-open="modalContribute.open">
        <DonationsComponent />
      </ion-modal>

      <!-- modal comments -->
      <ion-modal :is-open="modalComments.open">
        <FeedbackPage :data="{ type: 'feedback' }" />
      </ion-modal>
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
  IonIcon,
  IonSpinner,
  IonModal,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  brushOutline,
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
  newspaperOutline,
} from "ionicons/icons";
import AppsComponent from "./apps/Apps.vue";
import DonationsComponent from "./donations/Donations.vue";
import { useUser } from "./../../composables/useUser";
import { useRouter } from "vue-router";

// components
import ThemeComponente from "@/components/theme/ThemeComponente.vue";
import NewFeaturesComponent from "@/components/new-features/NewFeaturesComponente.vue";
import FeedbackPage from "../feedback/FeedbackPage.vue";

// composables
import { useSystem } from "../../composables/useSystem";
import ServerConfig from "@/composables/serverConfig";
const systemComposable = useSystem();
const serverConfig = new ServerConfig();

const router = useRouter();
const isOpenRefPopOverUserOptions = ref(false);
const eventPopOverUserOptions = ref();
const setOpenPopOverUserOptions = (state: boolean, ev?: Event): void => {
  eventPopOverUserOptions.value = ev;
  isOpenRefPopOverUserOptions.value = state;
};
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
const modalContribute = ref({ open: false });
const modalComments = ref({ open: false });

// mounted
onMounted(() => {
  getUser();
  window.addEventListener("resize", () => {
    windowSize.value.width = window.innerWidth;
  });
});

// functions
function openRoute(params: { route?: string; name?: string }) {
  const { route, name } = params;
  if (route) router.push(route);
  if (name) router.push({ name });
  menuController.close();
}

async function getUser() {
  try {
    useUser().loadUser();
  } catch (error) {}
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
  try {
    spinners.value.buttonLogout = true;
    await serverConfig.clearData();
    location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    spinners.value.buttonLogout = false;
  }
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
</style>
