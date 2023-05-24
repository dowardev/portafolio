<template>
  <ion-header mode="ios" class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeModal()">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <p class="ion-padding-start">Elije el que mas te guste</p>

    <!-- theme selector -->
    <ion-row v-for="(theme, index) in availableThemes" :key="index">
      <ion-col size="12">
        <ion-item lines="none"
          ><ion-label>{{ theme }}</ion-label>
          <ion-button
            fill="clear"
            @click="previewTheme({ name: theme as Theme })"
            ><ion-icon :icon="eyeOutline"></ion-icon
          ></ion-button>

          <ion-button fill="clear" @click="applyTheme({ name: theme as Theme })"
            ><ion-icon :icon="checkmarkOutline"></ion-icon></ion-button
        ></ion-item>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  checkmarkOutline,
  chevronBackOutline,
  eyeOutline,
} from "ionicons/icons";
import { Theme } from "../../services/types";
import { getTheme, saveTheme, setTheme } from "../../services/system";

export default defineComponent({
  name: "ThemeComponent",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
  },

  setup() {
    return {
      chevronBackOutline,
      eyeOutline,
      checkmarkOutline,
      availableThemes: ["light", "nord", "gruvbox"],
    };
  },

  data() {
    return {
      pageTitle: "Selector de tema",
      themeSelected: "",
    };
  },

  methods: {
    closeModal() {
      modalController.dismiss();
    },

    previewTheme(params: { name: Theme }) {
      const theme = params.name;
      const themeSelected = this.themeSelected;

      document.body.classList.add(theme);
      this.themeSelected = theme;
      if (themeSelected != "")
        document
          .getElementsByTagName("body")[0]
          .classList.remove(themeSelected);
    },

    async applyTheme(params: { name: Theme }) {
      const theme = params.name;
      await setTheme({ theme });
      saveTheme({ theme });
    },
  },
});
</script>
