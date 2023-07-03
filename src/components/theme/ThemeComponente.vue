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
    <ion-row>
      <ion-col size="12">
        <ion-card>
          <ion-item
            v-for="(theme, index) in availableThemes"
            :key="index"
            class="transparent"
            button
            lines="none"
            @click="applyTheme({ name: theme as Theme })"
            ><ion-label>{{ theme }}</ion-label>
          </ion-item>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
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
import { ref } from "vue";
import {
  checkmarkOutline,
  chevronBackOutline,
  eyeOutline,
} from "ionicons/icons";
import { Theme } from "../../services/types";
import { saveTheme, setTheme } from "../../services/system";
import { useSystem } from "@/composables/useSystem";

const availableThemes: Theme[] = ["light", "nord", "gruvbox"];

const pageTitle = "Selector de tema";
const themeSelected = ref("");

// functions
function closeModal() {
  modalController.dismiss();
}

function previewTheme(params: { name: Theme }) {
  const theme = params.name;
  themeSelected.value = theme;

  document.body.classList.add(theme);
  themeSelected.value = theme;
  if (themeSelected.value != "")
    document
      .getElementsByTagName("body")[0]
      .classList.remove(themeSelected.value);
}

// async function applyTheme(params: { name: Theme }) {
//   const theme = params.name;
//   await setTheme({ theme });
//   saveTheme({ theme });
// }
async function applyTheme(params: { name: Theme }) {
  const theme = params.name;
  useSystem().applyTheme({ theme });
  useSystem().updateThemeSelected({ theme });
}
</script>
