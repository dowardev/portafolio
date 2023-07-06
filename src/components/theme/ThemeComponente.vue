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
        <ion-item button>
          <ion-toggle
            label-placement="start"
            :checked="themeSelected.options?.blur ?? false"
            @ion-change="setBlurEffect({ value: $event.detail.checked })"
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
            @click="
              themeSelected.selected = themeName;
              applyTheme();
            "
            ><ion-label>{{ themeName }}</ion-label>
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
import { chevronBackOutline } from "ionicons/icons";
import { Theme as ThemeType } from "../../services/types";
import { useSystem } from "@/composables/useSystem";
import { Theme } from "@/services/interfaces";

const availableThemes: ThemeType[] = ["light", "nord", "gruvbox"];
const pageTitle = "Selector de tema";
let themeSelected = reactive({} as Theme);
const systemComposable = useSystem();

onMounted(() => {
  themeSelected = JSON.parse(JSON.stringify(systemComposable.getTheme()));
});

// functions
function closeModal(): void {
  modalController.dismiss();
}

async function applyTheme(): Promise<void> {
  const theme = themeSelected;
  systemComposable.updateStoreTheme({ theme });
}

async function setBlurEffect(params: { value: boolean }): Promise<void> {
  const { value } = params;
  console.log(value);
  if (!themeSelected.options) {
    themeSelected.options = {};
  }
  themeSelected.options.blur = value;
  await applyTheme();
}
</script>
