<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="md">
      <div v-if="$route.path == '/'">
        <PresentationHeaderComponent
          :main-segment="presentationPage.mainSegment"
          :show-title="presentationPage.showTitle"
          :page-title="presentationPage.pageTitle"
          @mainsegment="presentationPage.mainSegment = $event"
        />
      </div>

      <div v-if="$route.path == '/blog'">
        <PostsHeaderComponent
          :show-title="blogPage.showTitle"
          :page-title="blogPage.pageTitle"
          @current-date-change="
            postsContentComponent.loadPosts({
              currentPage: usePost().getCurrentPage(),
            })
          "
        />
      </div>
    </ion-header>

    <ion-content>
      <ion-card class="card-main-content">
        <!-- presentation -->
        <div v-if="$route.path == '/'">
          <PresentationComponent
            :main-segment="presentationPage.mainSegment"
            :page-title="presentationPage.pageTitle"
            @show-title="presentationPage.showTitle = $event"
          />
        </div>

        <!-- blog -->
        <div v-if="$route.path == '/blog'">
          <PostsContentComponent
            ref="postsContentComponent"
            :page-title="blogPage.pageTitle"
            @show-title="blogPage.showTitle = $event"
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
import { reactive, ref } from "vue";
import { usePost } from "@/composables/usePost";

const presentationPage = reactive({
  mainSegment: "skills",
  showTitle: false,
  pageTitle: "Inicio",
});

const blogPage = reactive({
  showTitle: false,
  pageTitle: "Blog",
});

// refs
const postsContentComponent = ref();
</script>

<style scoped>
.card-main-content {
  height: 97%;
}
</style>
