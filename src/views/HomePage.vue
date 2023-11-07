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

import { reactive, ref } from "vue";
import { usePost } from "@/composables/usePost";

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

// refs
const postsContentComponent = ref();
const postContentComponent = ref();
</script>

<style scoped>
.card-main-content {
  height: 97%;
}
</style>
