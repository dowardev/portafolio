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
      <ion-card>
        <ion-item class="transparent">
          <ion-select
            label="Tema"
            interface="popover"
            :value="currentTheme.selected"
            @ion-change="onMainThemeChange({ event: $event })"
          >
            <ion-select-option value="auto">Automático</ion-select-option>
            <ion-select-option
              v-for="themeName in availableThemes"
              :key="themeName"
              :value="themeName"
            >{{ themeName }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="currentTheme.selected === 'auto'" class="transparent">
          <ion-select
            label="Tema claro"
            interface="popover"
            :value="currentTheme.options?.lightTheme ?? 'light'"
            @ion-change="onLightThemeChange({ event: $event })"
          >
            <ion-select-option
              v-for="themeName in availableThemes"
              :key="themeName"
              :value="themeName"
            >{{ themeName }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="currentTheme.selected === 'auto'" class="transparent">
          <ion-select
            label="Tema oscuro"
            interface="popover"
            :value="currentTheme.options?.darkTheme ?? 'catppuccin-macchiato'"
            @ion-change="onDarkThemeChange({ event: $event })"
          >
            <ion-select-option
              v-for="themeName in availableThemes"
              :key="themeName"
              :value="themeName"
            >{{ themeName }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-content>
</template>

<script setup lang="ts">
// imports
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { ConcreteTheme } from "../../services/types";
import { Theme } from "@/utils/interfaces";
import { computed } from "vue";
// end imports

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end controllers

// interface and types imports
// end interface and types imports

// main
// end main

// vars and const
const availableThemes: ConcreteTheme[] = ["light", "nord", "gruvbox", "catppuccin-latte", "catppuccin-macchiato", "cyberpunk-light"];
const pageTitle = "Selector de tema";
const currentTheme = computed(() => systemController.getTheme());
// end vars and const

// watch
// end

// computed
// end computed

// onmounted
// end onmounted

// functions
function closeModal(): void {
  modalController.dismiss();
}

async function onMainThemeChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const value = event.detail.value;
  const oldTheme = JSON.parse(
    JSON.stringify(systemController.getTheme()),
  ) as Theme;
  const newTheme: Theme = {
    ...oldTheme,
    selected: value,
  };
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onLightThemeChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const value = event.detail.value;
  const oldTheme = JSON.parse(
    JSON.stringify(systemController.getTheme()),
  ) as Theme;
  const newTheme: Theme = {
    ...oldTheme,
    options: { ...oldTheme.options, lightTheme: value },
  };
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onDarkThemeChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const value = event.detail.value;
  const oldTheme = JSON.parse(
    JSON.stringify(systemController.getTheme()),
  ) as Theme;
  const newTheme: Theme = {
    ...oldTheme,
    options: { ...oldTheme.options, darkTheme: value },
  };
  await systemController.changeTheme({ newTheme, oldTheme });
}
// end functions
</script>
