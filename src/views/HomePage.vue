<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <div v-if="$route.path == '/' || $route.path == ''">
        <PresentationHeader
          :main-segment="presentationPage.mainSegment"
          :show-title="presentationPage.showTitle"
          :page-title="presentationPage.pageTitle"
          @mainsegment="presentationPage.mainSegment = $event"
        />
      </div>
    </ion-header>

    <ion-content>
      <ion-card class="card-main-content">
        <div v-if="$route.path == '/' || $route.path == ''">
          <PresentationContent
            :main-segment="presentationPage.mainSegment"
            :page-title="presentationPage.pageTitle"
            @show-title="presentationPage.showTitle = $event"
          />
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage } from "@ionic/vue";
import PresentationHeader from "../views/presentation/header/Header.vue";
import PresentationContent from "../views/presentation/content/PresentationPage.vue";
import { reactive } from "vue";

const presentationPage = reactive({
  mainSegment: "skills",
  showTitle: false,
  pageTitle: "Inicio",
});
</script>

<style scoped>
.card-main-content {
  height: 97%;
}
</style>
