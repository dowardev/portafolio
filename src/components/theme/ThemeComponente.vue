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
    <!-- theme selector -->
    <ion-row>
      <ion-col size="12">
        <ion-item button lines=none>
          <ion-toggle
            label-placement="start"
            :checked="systemComposable.getTheme().options?.blur ?? false"
            @ion-change="setBlurEffect()"
            >Desenfoque</ion-toggle
          >
        </ion-item>

        <ion-card>
          <ion-item
            v-for="(themeName, index) in availableThemes"
            :key="index"
            class="transparent"
            button
            lines="none"
            @click="applyTheme({ themeName })"
            ><ion-label>{{ themeName }}</ion-label>

            <ion-icon
              v-if="systemComposable.getTheme().selected == themeName"
              :icon="checkmarkOutline"
            ></ion-icon>
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
  IonToggle,
} from "@ionic/vue";
import { onMounted, reactive } from "vue";
import { checkmarkOutline, chevronBackOutline } from "ionicons/icons";
import { Theme as ThemeType } from "../../services/types";
import { useSystem } from "@/composables/useSystem";
import { Theme } from "@/services/interfaces";

const availableThemes: ThemeType[] = ["light", "nord", "gruvbox"];
const pageTitle = "Selector de tema";
const systemComposable = useSystem();

// functions
function closeModal(): void {
  modalController.dismiss();
}

async function applyTheme(params: { themeName: ThemeType }): Promise<void> {
  const { themeName } = params;
  const theme = JSON.parse(
    JSON.stringify(systemComposable.getTheme())
  ) as Theme;
  theme.selected = themeName;
  systemComposable.updateThemeSelected({ theme });
}

async function setBlurEffect(): Promise<void> {
  const theme = JSON.parse(
    JSON.stringify(systemComposable.getTheme())
  ) as Theme;
  if (!theme.options) {
    theme.options = {};
  }
  theme.options.blur = !theme.options.blur;
  systemComposable.updateThemeSelected({ theme });
}
</script>
