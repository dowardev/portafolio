<template>
  <ion-header :translucent="true" class="ion-no-border" mode="ios">
    <!-- progress bar -->
    <ion-progress-bar
      v-if="load.status"
      :class="{
        'primary-progress-bar': load.color == 'primary' || '',
        'danger-progress-bar': load.color == 'danger',
      }"
      type="indeterminate"
    ></ion-progress-bar>

    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end" :mode="designPlatform">
        <ion-segment v-model="mainSegment" scrollable>
          <ion-segment-button value="profile">
            <ion-label> Perfil </ion-label>
          </ion-segment-button>

          <ion-segment-button value="security">
            <ion-label>Seguridad</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true">
    <ion-row>
      <ion-col size-lg="12">
        <section v-if="mainSegment == 'profile'">
          <UserProfileComponent
            @content-loaded="load.status = false"
          ></UserProfileComponent>
        </section>

        <section v-if="mainSegment == 'security'">
          <UserSecurityComponent></UserSecurityComponent>
        </section>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  isPlatform,
  IonItemDivider,
} from "@ionic/vue";
import { ref } from "vue";
import UserProfileComponent from "./profile/UserProfileComponent.vue";
import UserSecurityComponent from "./security/UserSecurityComponent.vue";

const pageTitle = ref("Panel de Usuario");
const mainSegment = ref("profile");
const designPlatform = isPlatform("ios") ? "ios" : "md";
const load = ref({ status: true, color: "" });
</script>

<style scoped>
.div-main-content {
  max-height: 82vh;
  overflow: auto;
}
</style>
