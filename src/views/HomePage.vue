<template>
  <ion-page>
    <div id="main-content" class="div-main-content">
      <HomePresentationPage />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

// components
import HomePresentationPage from "../../src/views/presentation/HomePresentationPage.vue";
</script>

<style scoped>
.div-main-content {
  height: 97%;
  background-color: var(--ion-background-light-color);
  margin: 10px;
  border-radius: 4px;
}
</style>
