<template>
  <ion-page class="menu3-page">
    <ion-header class="ion-no-border">
      <ion-toolbar class="menu3-toolbar">
<div class="menu3-header-content">
  <span class="menu3-title">{{ user?.name?.toUpperCase() || 'SYSTEM' }}</span>
</div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="menu3-content-area">
      <div class="menu3-scroll">
        <!-- Login/Register -->
        <div v-if="!user" class="menu3-login-area">
          <button class="menu3-login-btn" @click="redirectToSSO('login')">
            INICIAR SESIÓN
          </button>
          <button class="menu3-register-btn" @click="redirectToSSO('register')">
            REGISTRAR
          </button>
        </div>

        <div class="menu3-divider-line"></div>

        <!-- Nav items -->
        <div class="menu3-items-section">
          <MenuItem3
            target-route-name="PresentationPage"
            :active-routes="PRESENTATION_PAGES"
            label="PRESENTACIÓN"
            :index="1"
          />

          <MenuItem3
            target-route-name="PostsPage"
            :active-routes="BLOG_PAGES"
            label="BLOG"
            :index="2"
          />

          <MenuItem3
            target-route-name="PoliciesPage"
            :active-routes="['PoliciesPage']"
            label="POLÍTICAS"
            :index="3"
          />
        </div>

        <!-- User section -->
        <template v-if="user">
          <div class="menu3-section-title">
            <span class="section-text">USUARIO</span>
          </div>

<MenuItem3
  :active-routes="['UserPanelPage']"
  label="PANEL USUARIO"
  :index="4"
  @click="overrideSSOProfile"
/>
        </template>

        <!-- Admin section -->
        <template v-if="isAdmin">
          <div class="menu3-section-title">
            <span class="section-text">ADMIN</span>
          </div>

          <MenuItem3
            target-route-name="PanelAdminPage"
            :active-routes="ADMIN_PAGES"
            label="PANEL ADMIN"
            :index="5"
          />

          <MenuItem3
            target-route-name="UsersPage"
            :active-routes="['UsersPage']"
            label="USUARIOS"
            :index="6"
          />
        </template>

        <!-- Bottom section: accordion + logout -->
        <div class="menu3-bottom-section">
          <div class="menu3-accordion-wrapper">
            <ion-accordion-group @ion-change="onAccordionChange">
              <ion-accordion value="more">
                <ion-item slot="header" lines="none" class="menu3-accordion-trigger">
                  <span class="item3-label">MÁS OPCIONES</span>
                  <span class="item3-index">—</span>
                  <span class="item3-arrow" :class="{ rotated: accordionOpen }">&#8250;</span>
                </ion-item>

                <div slot="content" class="menu3-accordion-inner">
                  <MenuItem3
                    label="TEMA"
                    :index="7"
                    :active-routes="[]"
                    @click="systemController.openThemeModal()"
                  />

                  <MenuItem3
                    label="CONTRIBUIR"
                    :index="8"
                    :active-routes="[]"
                    @click="modalContribute.open = true"
                  />

                  <MenuItem3
                    label="CÓDIGO FUENTE"
                    :index="9"
                    :active-routes="[]"
                    :close-menu-on-click="false"
                    @click="sourcePopoverOpen = true"
                  />

                  <MenuItem3
                    label="COMENTARIOS"
                    :index="10"
                    :active-routes="[]"
                    @click="modalComments.open = true"
                  />

                  <MenuItem3
                    label="NOVEDADES"
                    :index="11"
                    :active-routes="[]"
                    @click="openChangelog()"
                  />

                  <MenuItem3
                    label="MÁS APPS"
                    :index="12"
                    :active-routes="[]"
                    @click="openModalApps()"
                  />
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </div>

          <!-- Logout -->
          <div v-if="user" class="menu3-logout-area">
            <div class="menu3-divider-line"></div>

            <div
              class="menu3-logout-btn"
              :class="{ disabled: spinners.buttonLogout }"
              @click="logout()"
            >
              <span v-if="spinners.buttonLogout" class="logout-spinner">
                <ion-spinner name="crescent" color="dark" />
              </span>
              <span v-else class="logout-icon">
                <ion-icon :icon="logOutOutline" />
              </span>
              <span class="logout-label">CERRAR SESIÓN</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Popover source code -->
      <ion-popover
        :is-open="sourcePopoverOpen"
        @did-dismiss="sourcePopoverOpen = false"
      >
        <ion-content>
          <ion-item
            button
            href="https://www.gitlab.com/dowardev/portafolio"
            target="_blank"
            lines="none"
            class="menu3-popover-item"
            @click="sourcePopoverOpen = false"
          >
            <ion-label>FrontEnd</ion-label>
          </ion-item>

          <ion-item
            button
            href="https://gitlab.com/dowardev/portfolio-backend"
            target="_blank"
            lines="none"
            class="menu3-popover-item"
            @click="sourcePopoverOpen = false"
          >
            <ion-label>Backend</ion-label>
          </ion-item>
        </ion-content>
      </ion-popover>

      <!-- Modals -->
      <ion-modal
        :is-open="modalContribute.open"
        @did-dismiss="modalContribute.open = false"
      >
        <DonationsComponent />
      </ion-modal>

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
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonSpinner,
  IonToolbar,
  menuController,
  modalController,
} from "@ionic/vue"
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/store/userStore"
import { logOutOutline } from "ionicons/icons"

import MenuItem3 from "./MenuItem3.vue"
import DonationsComponent from "@/components/menu/donations/DonationsMenu.vue"
import FeedbackComponent from "@/components/feedback/FeedbackComponent.vue"
import AppsComponent from "@/components/menu/apps/AppsMenu.vue"

import { getSSOClient } from "@/ssoClientAccessor"

// controllers
import SystemController from "@/controllers/systemController"
const systemController = new SystemController()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isAdmin = computed(() => userStore.roles.includes('admin'))

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
]

const PRESENTATION_PAGES = [
  "PresentationPage",
  "CategoriesPage",
  "HistoryPage",
  "PortfolioPage",
  "CertificatesPage",
  "ExperiencePage",
]

const BLOG_PAGES = ["PostsPage", "PostPage"]

const spinners = ref({
  buttonLogout: false,
})

const sourcePopoverOpen = ref(false)
const accordionOpen = ref(false)

const modalContribute = ref({ open: false })
const modalComments = ref({ open: false })

async function redirectToSSO(page: "login" | "register") {
  await getSSOClient().loginWithRedirect({
    screenHint: page,
    redirectUri: `${window.location.origin}/auth/callback`,
  })
}

async function logout() {
  try {
    spinners.value.buttonLogout = true
    await getSSOClient().logout()
  } catch {
    location.reload()
  }
}

function overrideSSOProfile() {
  const ssoFrontendUrl = import.meta.env.VITE_SSO_FRONTEND_URL || 'http://localhost:8101';
  window.open(`${ssoFrontendUrl}/user/profile/limited`, '_blank', 'noopener,noreferrer');
}

function onAccordionChange(event: CustomEvent) {
  accordionOpen.value = event.detail.value === "more"
}

function openChangelog() {
  window.open(
    "https://gitlab.com/dowardev/portafolio/-/blob/master/CHANGELOG.md?ref_type=heads",
    "_blank",
  )
}

async function openModalApps() {
  menuController.close()
  const modal = await modalController.create({
    component: AppsComponent,
    cssClass: "my-custom-class",
  })
  return modal.present()
}
</script>

<style scoped>
.menu3-page {
  --background: #ffffff;
}

.menu3-toolbar {
  --background: #ffffff;
  --border-width: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --min-height: 56px;
}

.menu3-header-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
}

.menu3-title {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1a1a1a;
}

.menu3-content-area {
  --background: #ffffff;
}

.menu3-scroll {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.menu3-login-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
}

.menu3-login-btn,
.menu3-register-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #1a1a1a;
  transition: background 0.2s ease;
}

.menu3-login-btn:hover,
.menu3-register-btn:hover {
  background: #f5f5f5;
}

.menu3-divider-line {
  height: 0;
  border-top: 1px dashed #d4d4d4;
  margin: 0 1.25rem;
}

.menu3-items-section {
  padding-top: 0.25rem;
}

.menu3-item-sep {
  height: 0;
  border-top: 1px dashed #d4d4d4;
  margin: 0 1.25rem;
}

.menu3-section-title {
  padding: 0.5rem 1.25rem 0.15rem;
}

.section-text {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: #6B7280;
  text-transform: uppercase;
}

.menu3-bottom-section {
  margin-top: auto;
  border-top: 1px dashed #d4d4d4;
}

.menu3-accordion-wrapper {
}

.menu3-accordion-trigger {
  --background: #ffffff;
  --background-hover: #f5f5f5;
  --background-activated: #f0f0f0;
  --min-height: 48px;
  --padding-start: 1.25rem;
  --padding-end: 1.25rem;
  --border-color: transparent;
  --inner-padding-end: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menu3-accordion-trigger .item3-label {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1a1a1a;
  flex: 1;
}

.menu3-accordion-trigger .item3-index {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: #6B7280;
  flex-shrink: 0;
  min-width: 2.5rem;
  text-align: right;
}

.menu3-accordion-trigger .item3-arrow {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.menu3-accordion-trigger .item3-arrow.rotated {
  transform: rotate(90deg);
}

.menu3-accordion-inner {
  background: #ffffff;
}

.menu3-logout-area {
  padding-bottom: 1rem;
}

.menu3-logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.2s ease;
  border-left: 2px solid transparent;
}

.menu3-logout-btn:hover {
  background: #f5f5f5;
}

.menu3-logout-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.logout-icon,
.logout-spinner {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  color: #1a1a1a;
}

.logout-label {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1a1a1a;
}

.menu3-popover-item {
  --background: #ffffff;
  --background-hover: #f5f5f5;
}

.menu3-accordion-trigger:focus-visible,
.menu3-logout-btn:focus-visible,
.menu3-login-btn:focus-visible,
.menu3-register-btn:focus-visible {
  outline: 2px solid #111;
  outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
  .menu3-accordion-trigger .item3-arrow,
  .menu3-logout-btn,
  .menu3-login-btn,
  .menu3-register-btn {
    transition: none;
  }
}
</style>
