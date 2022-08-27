<template>
  <ion-page>
    <ion-header collapse="fade" mode="ios" :translucent="true">
      <ion-toolbar>
        <ion-title>Header</ion-title>
        <ion-buttons slot="end">
          <ion-button>sss</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true"> </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },

  data() {
    const rq = 0;
    // console.log(rq);
  },
});
</script>
