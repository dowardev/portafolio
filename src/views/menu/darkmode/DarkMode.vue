<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons>
          <ion-button class="close-button" @click="closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
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
  IonItem,
  IonLabel,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import systemService from "../../../services/system.vue";
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
    const darkMode = false as boolean | null;
    return {
      darkMode,
    };
  },
  mounted() {
    this.getTheme();
  },
  methods: {
    async getTheme() {
      try {
        const response = await systemService().getTheme();
        this.darkMode = response;
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
      }
    },
    setTheme() {
      systemService().setTheme({ status: this.darkMode });
    },
    closeModal() {
      modalController.dismiss();
    },
  },
});
</script>

<style scoped>
@media only screen and (max-width: 768px), (orientation: landscape) {
  .close-button {
    display: none;
  }
}
</style>
