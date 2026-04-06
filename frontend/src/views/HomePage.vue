<template>
  <!-- TODO:remove all -->
  <ion-page class="page-container">
    <!-- progress bar -->
    <ion-progress-bar
      v-if="systemController.getLoader().status"
      :class="{
        'primary-progress-bar': systemController.getLoader().color == 'primary',
        'danger-progress-bar': systemController.getLoader().color == 'danger',
      }"
      type="indeterminate"
    ></ion-progress-bar>

    <!-- pages -->
    <HomePresentationPage v-if="$route.name == 'PresentationPage'" />
    <PostsPage v-if="$route.name == 'PostsPage'" />
    <PostPage v-if="$route.name == 'PostPage'" />
    <CreatePostPage v-if="$route.name == 'CreatePostPage'" />
    <UpdatePostPage v-if="$route.name == 'UpdatePostPage'" />
    <LoginPage v-if="$route.name == 'LoginPage'" />
    <SignUpPage v-if="$route.name == 'SignUpPage'" />
    <PoliciesPage v-if="$route.name == 'PoliciesPage'" />
    <UserPanelPage v-if="$route.name == 'UserPanelPage'" />
    <PanelAdminPage v-if="$route.name == 'PanelAdminPage'" />
    <AdminInfoPage
      v-if="
        $route.name == 'AdminEditorPage' && $route.params.section === 'info'
      "
    />
    <AdminStackPage
      v-if="
        $route.name == 'AdminEditorPage' && $route.params.section === 'stack'
      "
    />
    <AdminSkillsPage
      v-if="
        $route.name == 'AdminEditorPage' && $route.params.section === 'skills'
      "
    />
    <AdminExperiencePage
      v-if="
        $route.name == 'AdminEditorPage' &&
        $route.params.section === 'experience'
      "
    />
    <AdminProjectsPage
      v-if="
        $route.name == 'AdminEditorPage' && $route.params.section === 'projects'
      "
    />
    <AdminCertificatesPage
      v-if="
        $route.name == 'AdminEditorPage' &&
        $route.params.section === 'certificates'
      "
    />
    <AdminFreelancePage
      v-if="
        $route.name == 'AdminEditorPage' &&
        $route.params.section === 'freelance'
      "
    />
    <PortfolioPage v-if="$route.name == 'PortfolioPage'" />
    <CertificatesPage v-if="$route.name == 'CertificatesPage'" />
    <ExperiencePage v-if="$route.name == 'ExperiencePage'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

// components
import HomePresentationPage from "./presentation/HomePresentationPage.vue";
import PostsPage from "./blog/posts/PostsPage.vue";
import PostPage from "./blog/post/PostPage.vue";
import CreatePostPage from "./blog/editor/CreatePostPage.vue";
import UpdatePostPage from "./blog/editor/UpdatePostPage.vue";
import LoginPage from "./session/login/LoginPage.vue";
import SignUpPage from "./session/signup/SignUpPage.vue";
import PoliciesPage from "./policies/PoliciesPage.vue";
import UserPanelPage from "./user/UserPanelPage.vue";
import PanelAdminPage from "./admin/PanelAdminPage.vue";
import AdminInfoPage from "./admin/sections/AdminInfoPage.vue";
import AdminStackPage from "./admin/sections/AdminStackPage.vue";
import AdminSkillsPage from "./admin/sections/AdminSkillsPage.vue";
import AdminExperiencePage from "./admin/sections/AdminExperiencePage.vue";
import AdminProjectsPage from "./admin/sections/AdminProjectsPage.vue";
import AdminCertificatesPage from "./admin/sections/AdminCertificatesPage.vue";
import AdminFreelancePage from "./admin/sections/AdminFreelancePage.vue";
import PortfolioPage from "./portfolio/PortfolioPage.vue";
import CertificatesPage from "./certificates/CertificatesPage.vue";
import ExperiencePage from "./experience/ExperiencePage.vue";

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

import { watch } from "vue";
import { useRoute } from "vue-router";

// vars
const route = useRoute();

watch(
  () => route.name,
  (newName, oldName) => {
    systemController.enableLoader({ color: "primary" });
    setTimeout(() => {
      systemController.disableLoader();
    }, 2000);
  },
);
</script>
