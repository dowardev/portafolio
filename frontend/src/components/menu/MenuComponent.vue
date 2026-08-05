<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
<!-- user logged -->
<ion-item
  v-if="user?.id"
  lines="none"
  class="transparent"
>
  <ion-label>{{ user?.name }}</ion-label>
</ion-item>

        <!-- no logged -->
        <ion-item
          v-if="!user?.id"
          class="transparent"
          lines="none"
        >
          <!-- login -->
          <ion-button @click="redirectToSSO('login')">
            Iniciar sesión
          </ion-button>
          <!-- sign up -->
          <ion-button fill="clear" @click="redirectToSSO('register')"
            >Registrar</ion-button
          >
        </ion-item>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="display: flex; flex-direction: column; height: 100%">
        <div>
          <ion-item-group>
            <section v-if="user?.id">
              <ion-item-divider>
                <ion-label> Administración </ion-label>
              </ion-item-divider>

              <div class="ion-padding-bottom">
                <MenuItem
                  v-if="userController.isAdmin"
                  target-route-name="PanelAdminPage"
                  :active-routes="ADMIN_PAGES"
                  :icon-outline="cogOutline"
                  :icon-filled="cog"
                  label="Panel administrador"
                  :disabled="spinners.buttonAdminPanel"
                  :loading="spinners.buttonAdminPanel"
                  transparent
                />

                <MenuItem
                  v-if="user?.id"
                  target-route-name="UsersPage"
                  :active-routes="['UsersPage']"
                  :icon-outline="peopleOutline"
                  :icon-filled="people"
                  label="Usuarios"
                  :disabled="spinners.buttonUserPanel"
                  :loading="spinners.buttonUserPanel"
                  transparent
                />

                <!-- <MenuItem -->
                <!--   v-if="user?.id" -->
                <!--   target-route-name="UserPanelPage" -->
                <!--   :active-routes="['UserPanelPage']" -->
                <!--   :icon-outline="documentsOutline" -->
                <!--   :icon-filled="documents" -->
                <!--   label="Posts" -->
                <!--   :loading="spinners.buttonUserPanel" -->
                <!--   :disabled="spinners.buttonUserPanel" -->
                <!--   transparent -->
                <!-- /> -->
              </div>
            </section>

            <section v-if="user?.id">
              <ion-item-divider>
                <ion-label> Usuario </ion-label>
              </ion-item-divider>

<div class="ion-padding-bottom">
<MenuItem
  v-if="user?.id"
  :active-routes="['UserPanelPage']"
  :icon-outline="personOutline"
  :icon-filled="person"
  label="Panel usuario"
  :disabled="spinners.buttonUserPanel"
  :loading="spinners.buttonUserPanel"
  transparent
  @click="overrideSSOProfile"
/>
</div>
            </section>

            <ion-item-divider>
              <ion-label> Navegación </ion-label>
            </ion-item-divider>

            <div class="ion-padding-bottom">
              <MenuItem
                target-route-name="PresentationPage"
                :active-routes="PRESENTATION_PAGES"
                :icon-outline="homeOutline"
                :icon-filled="home"
                label="Presentación"
              />

              <MenuItem
                target-route-name="PostsPage"
                :active-routes="BLOG_PAGES"
                :icon-outline="libraryOutline"
                :icon-filled="library"
                label="Blog"
              />

              <MenuItem
                target-route-name="PoliciesPage"
                :active-routes="['PoliciesPage']"
                :icon-outline="documentsOutline"
                :icon-filled="documents"
                label="Políticas"
              />
            </div>
          </ion-item-group>

          <div>
            <ion-row>
              <ion-col>
                <div>
                  <div>
                    <!-- more options -->
                    <section>
                      <div>
                        <ion-accordion-group value="">
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
                                <ion-icon
                                  slot="start"
                                  color="primary"
                                  :icon="cashOutline"
                                ></ion-icon>
                                <ion-label>Contribuir</ion-label>
                              </ion-item>

                              <!-- source code options -->
                              <ion-item
                                id="trigger-button-source-code"
                                lines="none"
                                button
                              >
                                <ion-icon
                                  slot="start"
                                  color="primary"
                                  :icon="logoGitlab"
                                ></ion-icon>
                                <ion-label>Código fuente</ion-label>
                              </ion-item>

                              <ion-popover trigger="trigger-button-source-code">
                                <ion-content>
                                  <ion-item
                                    button
                                    lines="none"
                                    href="https://www.gitlab.com/dowardev/portafolio"
                                    target="_blank"
                                  >
                                    <ion-label>FrontEnd</ion-label>
                                  </ion-item>

                                  <ion-item
                                    button
                                    href="https://gitlab.com/dowardev/portfolio-backend"
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
                                  color="primary"
                                  :icon="thumbsUpOutline"
                                ></ion-icon>
                                <ion-label>Comentarios</ion-label>
                              </ion-item>

                              <!-- dark button desktop-->
                              <ion-item
                                id="open-modal-theme-component"
                                lines="none"
                                button
                              >
                                <ion-icon slot="start" :icon="brushOutline"></ion-icon>
                                <ion-label>Tema</ion-label>
                              </ion-item>

                              <!-- new features -->
                              <div
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  align-items: center;
                                "
                              >
                                <div style="width: 100%">
                                  <ion-item
                                    href="https://gitlab.com/dowardev/portafolio/-/blob/master/CHANGELOG.md?ref_type=heads"
                                    target="_blank"
                                    lines="none"
                                    button
                                  >
                                    <ion-icon
                                      slot="start"
                                      color="primary"
                                      :icon="newspaperOutline"
                                    ></ion-icon>
                                    <ion-label>Novedades</ion-label>
                                  </ion-item>
                                </div>

                                <div>
                                  <ion-button
                                    v-if="
                                      systemController.getUpdateStatus() == true
                                    "
                                    color="primary"
                                    size="small"
                                    @click="updateApp()"
                                    >Actualizar</ion-button
                                  >
                                </div>
                              </div>
                              <!-- more -->
                              <ion-item
                                lines="none"
                                button
                                @click="openModalApps"
                              >
                                <ion-icon
                                  slot="start"
                                  color="primary"
                                  :icon="appsOutline"
                                ></ion-icon>
                                <ion-label>Mas</ion-label>
                              </ion-item>
                            </div>
                          </ion-accordion>
                        </ion-accordion-group>
                      </div>
                    </section>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </div>
        </div>

        <div style="margin-top: auto">
          <!-- logout -->
          <ion-item
            v-if="user?.id"
            :disabled="spinners.buttonLogout"
            button
            lines="none"
            class="transparent"
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
            <ion-label>Cerrar sesión</ion-label>
          </ion-item>
        </div>
      </div>

      <!-- modals -->
      <!-- modal theme -->
      <ion-modal trigger="open-modal-theme-component">
        <ThemeComponente />
      </ion-modal>

      <!-- modal contribute -->
      <ion-modal :is-open="modalContribute.open">
        <DonationsComponent />
      </ion-modal>

      <!-- modal comments -->
      <ion-modal
        :is-open="modalComments.open"
        @will-dismiss="modalComments.open = false"
      >
        <FeedbackComponent
          :data="{ type: 'feedback' }"
          @dismiss="modalComments.open = false"
        />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonSpinner,
  IonToolbar,
  menuController,
  modalController,
} from "@ionic/vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";
import {
  logOutOutline,
  thumbsUpOutline,
  logoGitlab,
  appsOutline,
  documentsOutline,
  personOutline,
  cogOutline,
  brushOutline,
  cashOutline,
  libraryOutline,
  library,
  newspaperOutline,
  person,
  cog,
  documents,
  homeOutline,
  home,
  peopleOutline,
  people,
} from "ionicons/icons";
import AppsComponent from "./apps/AppsMenu.vue";
import DonationsComponent from "./donations/DonationsMenu.vue";

// components
import ThemeComponente from "@/components/theme/ThemeComponente.vue";
import FeedbackComponent from "../feedback/FeedbackComponent.vue";

// controllers
import UserController from "@/controllers/userController";
import SystemController from "@/controllers/systemController";
import { getSSOClient } from "@/ssoClientAccessor";

import MenuItem from "./MenuItem.vue";

const ADMIN_PAGES = [
  "PanelAdminPage",
  "ProjectsListPage",
  "ProjectNewPage",
  "ProjectEditPage",
  "ExperienceListPage",
  "ExperienceNewPage",
  "ExperienceEditPage",
  "AdminEditorPage",
  "SkillsListPage",
  "SkillsNewPage",
  "SkillsEditPage",
  "CertificatesListPage",
  "CertificateEditPage",
  "CertificateNewPage",
  "FreelancePlatformsListPage",
  "FreelancePlatformEditPage",
  "FreelancePlatformNewPage",
  "FreelanceCommentsListPage",
  "FreelanceCommentEditPage",
  "FreelanceCommentNewPage",
  "UsersPage",
  "PermissionsPage",
  "CreatePostPage",
  "UpdatePostPage",
];

const PRESENTATION_PAGES = [
  "PresentationPage",
  "CategoriesPage",
  "HistoryPage",
  "PortfolioPage",
  "CertificatesPage",
  "ExperiencePage",
];

const BLOG_PAGES = ["PostsPage", "PostPage"];

const userController = new UserController();
const systemController = new SystemController();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

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

window.addEventListener("resize", () => {
  windowSize.value.width = window.innerWidth;
});

// functions
async function redirectToSSO(page: "login" | "register") {
  await getSSOClient().loginWithRedirect({
    screenHint: page,
    redirectUri: `${window.location.origin}/auth/callback`,
  });
}

async function logout() {
  try {
    spinners.value.buttonLogout = true;
    await getSSOClient().logout();
  } catch (error) {
    console.error(error);
    location.reload();
  }
}

function overrideSSOProfile() {
  const ssoFrontendUrl = import.meta.env.VITE_SSO_FRONTEND_URL || 'http://localhost:8101';
  window.open(`${ssoFrontendUrl}/user/profile/limited`, '_blank', 'noopener,noreferrer');
}

async function openModalApps() {
  const modal = await modalController.create({
    component: AppsComponent,
    cssClass: "my-custom-class",
  });
  menuController.close();
  return modal.present();
}

function updateApp() {
  systemController.updateApp();
}
</script>

<style scoped>
.menu-option-selected {
  border-left: 6px solid var(--ion-color-primary);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  transition: border-left 0.4s ease-in-out;
}

.menu-option-selected > ion-item {
  --background: var(--ion-color-primary-background-hover);
  transition: background 0.4s ease-in-out;
}

.menu-option-selected > ion-item > ion-label {
  color: var(--ion-color-primary);
  transition: color 0.4s ease-in-out;
}
</style>
