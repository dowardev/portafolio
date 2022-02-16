<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-title>Modo oscuro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-radio-group v-model="darkMode" @ionChange="setTheme()">
        <ion-item>
          <ion-label>Activado</ion-label>
          <ion-radio slot="start" :value="true"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Desactivado</ion-label>
          <ion-radio slot="start" :value="false"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Automático</ion-label>
          <ion-radio slot="start" :value="null"></ion-radio>
        </ion-item>
      </ion-radio-group>
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
  IonRadioGroup,
  IonRadio,
} from "@ionic/vue";
import { defineComponent } from "vue";
import systemService from "../../../services/system.vue";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRadioGroup,
    IonRadio,
  },
  data() {
    const darkMode = null as boolean | null;
    return {
      darkMode,
    };
  },
  mounted() {
    this.getTheme();
  },
  methods: {
    getTheme() {
      systemService()
        .getTheme()
        .then((response) => {
          this.darkMode = response;
        });
    },
    setTheme() {
      if ((this.darkMode as null) == null) {
        systemService().setTheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );
      }
      systemService().setTheme(this.darkMode);
    },
  },
});
</script>
