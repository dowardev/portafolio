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
            :value="currentVariant"
            :disabled="currentTemplate !== 'template2'"
            @ion-change="onVariantChange({ event: $event })"
          >
            <ion-select-option
              v-for="v in availableVariants"
              :key="v"
              :value="v"
            >{{ v }}</ion-select-option>
          </ion-select>
        </ion-item>
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
import { computed, ref } from "vue";

import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

const availableVariants: ConcreteTheme[] = ["light", "nord", "gruvbox", "catppuccin-latte", "catppuccin-macchiato"];
const pageTitle = "Selector de tema";
const currentTheme = computed(() => systemController.getTheme());
const currentTemplate = computed(() => currentTheme.value.template);
const currentVariant = computed(() => currentTheme.value.variant);

const savedVariant = ref<ConcreteTheme>(currentTheme.value.variant);

function closeModal(): void {
  modalController.dismiss();
}

async function onTemplateChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const template = event.detail.value as HomeTemplate;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;

  let variant = oldTheme.variant;
  if (template !== "template2") {
    savedVariant.value = variant;
    variant = "light";
  } else {
    variant = savedVariant.value !== "light" ? savedVariant.value : variant;
  }

  const newTheme: Theme = {
    ...oldTheme,
    selected: variant,
    template,
    variant,
  };
  await systemController.changeTheme({ newTheme, oldTheme });
}

async function onVariantChange(params: { event: CustomEvent }): Promise<void> {
  const { event } = params;
  const variant = event.detail.value as ConcreteTheme;
  const oldTheme = JSON.parse(JSON.stringify(currentTheme.value)) as Theme;
  savedVariant.value = variant;

  const newTheme: Theme = {
    ...oldTheme,
    selected: variant,
    variant,
  };
  await systemController.changeTheme({ newTheme, oldTheme });
}
</script>
