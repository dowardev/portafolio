<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="md">
      <!-- presentation -->
      <div v-if="$route.path == '/presentation'">
        <PresentationHeaderComponent
          :main-segment="presentationComponent.mainSegment"
          :show-title="presentationComponent.showTitle"
          :page-title="presentationComponent.pageTitle"
          @mainsegment="presentationComponent.mainSegment = $event"
        />
      </div>

      <!-- posts -->
      <div v-if="$route.path == '/blog'">
        <PostsHeaderComponent
          :show-title="postsComponent.showTitle"
          :page-title="postsComponent.pageTitle"
          @current-date-change="
            postsContentComponent.loadPosts({
              currentPage: usePost().getCurrentPage(),
            })
          "
        />
      </div>

      <!-- post -->
      <div v-if="$route.name == 'PostPage'">
        <PostHeaderComponent
          :show-title="postComponent.showTitle"
          :page-title="postComponent.pageTitle"
          @current-date-change="
            postsContentComponent.loadPosts({
              currentPage: usePost().getCurrentPage(),
            })
          "
          @open-modal-index="postContentComponent.openModalIndexContent()"
        />
      </div>

      <!-- policies -->
      <div v-if="$route.path == '/policies'">
        <PoliciesHeaderComponent
          :show-title="policiesComponent.showTitle"
          :page-title="policiesComponent.pageTitle"
          @current-date-change="
            postsContentComponent.loadPosts({
              currentPage: usePost().getCurrentPage(),
            })
          "
          @open-modal-index="postContentComponent.openModalIndexContent()"
        />
      </div>

      <!-- session -->
      <div
        v-if="
          $route.path == '/session' ||
          $route.path == '/signup' ||
          $route.path == '/login'
        "
      >
        <SessionHeaderComponent
          :show-title="sessionComponent.showTitle"
          :page-title="sessionComponent.pageTitle"
          :main-segment="sessionComponent.mainSegment"
          @current-date-change="
            postsContentComponent.loadPosts({
              currentPage: usePost().getCurrentPage(),
            })
          "
          @open-modal-index="postContentComponent.openModalIndexContent()"
          @main-segment="sessionComponent.mainSegment = $event"
        />
      </div>
    </ion-header>

    <ion-content>
      <ion-card class="card-main-content">
        <!-- presentation -->
        <div v-if="$route.path == '/presentation'">
          <PresentationComponent
            :main-segment="presentationComponent.mainSegment"
            :page-title="presentationComponent.pageTitle"
            @show-title="presentationComponent.showTitle = $event"
          />
        </div>

        <!-- posts -->
        <div v-if="$route.path == '/blog'">
          <PostsContentComponent
            ref="postsContentComponent"
            :page-title="postsComponent.pageTitle"
            @show-title="postsComponent.showTitle = $event"
          />
        </div>

        <!-- post -->
        <div v-if="$route.name == 'PostPage'">
          <PostContentComponent
            ref="postContentComponent"
            :page-title="postComponent.pageTitle"
            @show-title="postComponent.showTitle = $event"
          />
        </div>

        <!-- policies -->
        <div v-if="$route.path == '/policies'">
          <PoliciesContentComponent
            ref="postsContentComponent"
            :page-title="policiesComponent.pageTitle"
            @show-title="policiesComponent.showTitle = $event"
          />
        </div>

        <!-- session -->
        <div
          v-if="
            $route.path == '/session' ||
            $route.path == '/signup' ||
            $route.path == '/login'
          "
        >
          <SessionContentComponent
            ref="postsContentComponent"
            :main-segment="sessionComponent.mainSegment"
            :page-title="sessionComponent.pageTitle"
            @show-title="sessionComponent.showTitle = $event"
          />
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage } from "@ionic/vue";
// presentation components
import PresentationHeaderComponent from "../views/presentation/header/Header.vue";
import PresentationComponent from "../views/presentation/content/PresentationPage.vue";
// posts components
import PostsHeaderComponent from "../views/blog/posts/header/HeaderComponent.vue";
import PostsContentComponent from "../views/blog/posts/content/ContentComponent.vue";
// post components
import PostHeaderComponent from "../views/blog/post/header/PostHeader.vue";
import PostContentComponent from "../views/blog/post/content/PostContent.vue";
// policies components
import PoliciesHeaderComponent from "../views/policies/header/PolicieHeader.vue";
import PoliciesContentComponent from "../views/policies/content/PoliciesContenteComponent.vue";
// session components
import SessionHeaderComponent from "../views/session/header/SessionHeaderComponent.vue";
import SessionContentComponent from "../views/session/content/SessionContentComponent.vue";

import { onMounted, reactive, ref, watch } from "vue";
import { usePost } from "@/composables/usePost";
import { useRoute } from "vue-router";

const route = useRoute();

const presentationComponent = reactive({
  mainSegment: "skills",
  showTitle: false,
  pageTitle: "Inicio",
});

const postsComponent = reactive({
  showTitle: false,
  pageTitle: "Blog",
});

const postComponent = reactive({
  showTitle: false,
  pageTitle: "",
});

const policiesComponent = reactive({
  showTitle: false,
  pageTitle: "Politicas",
});

const sessionComponent = reactive({
  mainSegment:
    route.path == "/session" || route.path == "/login" ? "login" : "signup",
  ohowTitle: false,
  pageTitle: "Iniciar sesión",
});

// hooks
watch(
  () => route.path,
  (nuevaRuta) => {
    sessionComponent.mainSegment == nuevaRuta;
  }
);
onMounted(() => {
  console.log({
    1: route.path,
    2: route.path == "/session" || route.path == "/login" ? "login" : "signup",
  });
});

// refs
const postsContentComponent = ref();
const postContentComponent = ref();
</script>

<style scoped>
.card-main-content {
  height: 97%;
}
</style>
