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
  <ion-row>
    <ion-col size="12">
      <ion-card>
        <ion-item class="transparent">
          <ion-select
            label="Tema"
            interface="popover"
            :value="currentTemplate"
            @ion-change="onTemplateChange({ event: $event })"
          >
            <ion-select-option value="template1">Template 1</ion-select-option>
            <ion-select-option value="template2">Template 2</ion-select-option>
            <ion-select-option value="template3">Template 3</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item class="transparent">
          <ion-select
            label="Variante"
            interface="popover"
            :value="currentSelected"
            :disabled="currentTemplate !== 'template2'"
            @ion-change="onVariantChange({ event: $event })"
          >
            <ion-select-option
              v-for="v in CONCRETE_THEMES"
              :key="v"
              :value="v"
            >{{ v }}</ion-select-option>
            <ion-select-option value="auto">Automático</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-note
          v-if="currentTemplate !== 'template2'"
          color="medium"
          class="ion-padding-horizontal ion-margin-bottom"
        >
          Las variantes de color solo están disponibles en Template 2.
        </ion-note>

        <template v-if="currentTemplate === 'template2' && currentSelected === 'auto'">
          <ion-item class="transparent">
            <ion-select
              label="Modo claro"
              interface="popover"
              :value="currentLightTheme"
              @ion-change="onAutoLightThemeChange({ event: $event })"
            >
              <ion-select-option
                v-for="v in LIGHT_COMPATIBLE_THEMES"
                :key="v"
                :value="v"
              >{{ v }}</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="transparent">
            <ion-select
              label="Modo oscuro"
              interface="popover"
              :value="currentDarkTheme"
              @ion-change="onAutoDarkThemeChange({ event: $event })"
            >
              <ion-select-option
                v-for="v in DARK_COMPATIBLE_THEMES"
                :key="v"
                :value="v"
              >{{ v }}</ion-select-option>
            </ion-select>
          </ion-item>
        </template>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-content>
</template>

<script setup lang="ts">
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
import { ConcreteTheme, HomeTemplate } from "@/utils/types";
import { Theme } from "@/utils/interfaces";
import {
  CONCRETE_THEMES,
  LIGHT_COMPATIBLE_THEMES,
  DARK_COMPATIBLE_THEMES,
} from "@/utils/themeDefaults";
import { computed } from "vue";

import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

const pageTitle = "Selector de tema";
const currentTheme = computed(() => systemController.getTheme());
const currentTemplate = computed(() => currentTheme.value.template);
const currentSelected = computed(() => currentTheme.value.selected);
const currentLightTheme = computed(() => currentTheme.value.options?.lightTheme ?? "light");
const currentDarkTheme = computed(() => currentTheme.value.options?.darkTheme ?? "catppuccin-macchiato");

function closeModal(): void {
  modalController.dismiss();
}

async function onTemplateChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const template = event.detail.value as HomeTemplate;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;

  const newTheme = systemController.buildThemeForTemplate({ currentTheme: oldTheme, template });
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onVariantChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const value = event.detail.value;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;

  const newTheme =
    value === "auto"
      ? systemController.buildThemeForAuto({ currentTheme: oldTheme })
      : systemController.buildThemeForVariant({ currentTheme: oldTheme, variant: value as ConcreteTheme });
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onAutoLightThemeChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const lightTheme = event.detail.value as ConcreteTheme;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;

  const newTheme = systemController.buildThemeForAutoLightTheme({ currentTheme: oldTheme, lightTheme });
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onAutoDarkThemeChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const darkTheme = event.detail.value as ConcreteTheme;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;

  const newTheme = systemController.buildThemeForAutoDarkTheme({ currentTheme: oldTheme, darkTheme });
  await systemController.changeTheme({ newTheme, oldTheme });
}
</script>
