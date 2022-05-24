<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesignElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item-divider sticky>
        <ion-segment v-model="mainSegment" scrollable>
          <ion-segment-button value="profile">
            <ion-label> Perfil </ion-label>
          </ion-segment-button>

          <ion-segment-button value="security">
            <ion-label> Seguridad</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <section v-if="mainSegment == 'profile'">
        <UserProfileComponent></UserProfileComponent>
      </section>

      <section v-if="mainSegment == 'security'">
        <UserSecurityComponent></UserSecurityComponent>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
import { defineComponent } from "vue";
import userService from "../../services/user.vue";
import UserProfileComponent from "./profile/UserProfilePage.vue";
import UserSecurityComponent from "./security/UserSecurityPage.vue";

export default defineComponent({
  name: "UserPanelPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    UserProfileComponent,
    UserSecurityComponent,
    IonItemDivider,
  },
  data() {
    const modeDesignElements = isPlatform("ios") ? "ios" : "md";

    return {
      pageTitle: "Panel de Usurio",
      mainSegment: "profile",
      modeDesignElements,
    };
  },

  beforeRouteEnter(to, from, next) {
    userService()
      .getUserName()
      .then(() => {
        next();
      })
      .catch(() => {
        next("/login");
      });
  },
});
</script>
