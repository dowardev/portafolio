<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-title>ss</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="primary-select-animated">
        <ion-progress-bar
          class="danger-progress-bar"
          type="indeterminate"
        ></ion-progress-bar>

        <ion-card-content> sss </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage } from "@ionic/vue";
</script>

<style scoped>
.gradient-progress-bar {
  --progress-background: linear-gradient(
    90deg,
    rgba(var(--ion-color-primary-rgb), 0%),
    rgba(var(--ion-color-primary-rgb), 20%),
    rgba(var(--ion-color-primary-rgb), 40%),
    rgba(var(--ion-color-primary-rgb), 60%),
    rgba(var(--ion-color-primary-rgb), 80%),
    rgba(var(--ion-color-primary-rgb), 100%)
  );
}
</style>
