<template>
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
    <PorfolioPage v-if="$route.name == 'PorfolioPage'" />
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
import PortfolioPage from "./portfolio/PortfolioPage.vue";

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
