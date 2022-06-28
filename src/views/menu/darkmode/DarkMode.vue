<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="close-button" @click="closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Tema</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-radio-group v-model="theme" @ionChange="setTheme()">
        <ion-item>
          <ion-label>Dia luminoso</ion-label>
          <ion-radio slot="start" value="light"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Noche oscura</ion-label>
          <ion-radio slot="start" value="dark"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Automático</ion-label>
          <ion-radio slot="start" value="aut"></ion-radio>
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
  IonItem,
  IonLabel,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  openToastErrror,
  getTheme,
  setTheme,
  saveTheme,
} from "../../../services/system";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
  },
  setup() {
    return { closeOutline };
  },
  data() {
    return {
      theme: "aut" as "aut" | "light" | "dark",
    };
  },
  mounted() {
    this.getTheme();
  },
  methods: {
    async getTheme() {
      try {
        const response = await getTheme();
        this.theme = response == null ? "aut" : response;
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
      }
    },

    setTheme() {
      setTheme({ theme: this.theme });
      saveTheme({ theme: this.theme });
    },
    closeModal() {
      modalController.dismiss();
    },
  },
});
</script>

<style scoped>
@media only screen and (max-width: 768px) {
  .close-button {
    display: none;
  }
}
</style>
