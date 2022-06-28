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
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
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
          <ion-segment-button value="posts">
            <ion-label>Posts</ion-label>
          </ion-segment-button>

          <ion-segment-button value="users">
            <ion-label>Usuarios</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <section v-if="mainSegment == 'users'">
        <UsersComponent />
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { getUser } from "../../services/user";
import UsersComponent from "./users/UsersPage.vue";
import { USER_PERMISSIONS } from "../../services/graphql";

export default defineComponent({
  name: "PanelAdminPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    UsersComponent,
  },

  setup() {
    return {
      pageTitle: "Panel Administrador",
    };
  },
  data() {
    return {
      mainSegment: "users",
    };
  },

  beforeRouteEnter(to, from, next) {
    getUser({
      graphql: { name: USER_PERMISSIONS, fragment: "UserPermissions" },
    })
      .then((response) => {
        if (response.is_admin) {
          next();
        } else {
          next("/");
        }
      })
      .catch(() => {
        next("/");
      });
  },
});
</script>
