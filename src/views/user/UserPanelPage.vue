<template>
  <ion-page class="page-container">
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
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
            <UserProfileComponent></UserProfileComponent>
          </section>

          <section v-if="mainSegment == 'security'">
            <UserSecurityComponent></UserSecurityComponent>
          </section>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
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

const modeDesignElements = isPlatform("ios") ? "ios" : "md";
const pageTitle = ref("Panel de Usurio");
const mainSegment = ref("profile");
</script>

<style scoped>
.div-main-content {
  max-height: 82vh;
  overflow: auto;
}
</style>
