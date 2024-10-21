<template>
  <ion-page>
    <div id="main-content" class="div-main-content">
      <HomePresentationPage
        v-if="
          $route.name == 'PresentationPage' ||
          $route.name == 'SkillsPage' ||
          $route.name == 'HistoryPage' ||
          $route.name == 'PortfolioPage'
        "
      />

      <PostsPage v-if="$route.name == 'PostsPage'" />
      <PostPage v-if="$route.name == 'PostPage'" />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

// components
import HomePresentationPage from "../../src/views/presentation/HomePresentationPage.vue";
import PostsPage from "../../src/views/blog/posts/PostsPage.vue";
import PostPage from "../../src/views/blog/post/PostPage.vue";
</script>

<style scoped>
.div-main-content {
  height: 97%;
  background-color: var(--ion-background-light-color);
  margin: 10px;
  border-radius: 4px;
}
</style>
