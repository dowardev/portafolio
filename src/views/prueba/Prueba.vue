<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-title>ss</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="primary-select-animated">s</ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage } from "@ionic/vue";
</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  height: 400px;
  width: 400px;
  border: 4px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(var(--ion-background-color), var(--ion-background-color))
      padding-box,
    linear-gradient(
        var(--angle),
        #f0f9fe,
        #d1edfb,
        #a7ddf7,
        #7ccbf3,
        #51b9ef,
        #3dade9
      )
      border-box;
  animation: 8s rotate linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
</style>
