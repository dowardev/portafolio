<template>
  <ion-page class="icon-selector-root">
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button id="type-trigger">
            <ion-icon slot="icon-only" :icon="filterOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar..."
        ></ion-searchbar>
      </ion-toolbar>

      <ion-popover
        trigger="type-trigger"
        side="bottom"
        alignment="center"
        :mode="designMode"
      >
        <ion-content>
          <ion-list>
            <ion-item button @click="selectedType = 'all'">
              <ion-label :color="selectedType === 'all' ? 'primary' : ''"
                >Todos</ion-label
              >
            </ion-item>
            <ion-item button @click="selectedType = 'social'">
              <ion-label :color="selectedType === 'social' ? 'primary' : ''"
                >Sociales</ion-label
              >
            </ion-item>
            <ion-item button @click="selectedType = 'tech'">
              <ion-label :color="selectedType === 'tech' ? 'primary' : ''"
                >Tecnologías</ion-label
              >
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>

      <ion-toolbar style="--background: var(--ion-background-color)">
        <div class="ion-padding-start ion-padding-end">
          <ion-segment v-model="selectedSource" :mode="designMode">
            <ion-segment-button value="all">
              <ion-label>Todos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="ionicons">
              <ion-label>IonIcons</ion-label>
            </ion-segment-button>
            <ion-segment-button value="lineicons">
              <ion-label>LineIcons</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-card class="shadow1">
          <ion-item
            v-for="icon in filteredIcons"
            :key="icon.name"
            lines="full"
            button
            :color="selectedIconName === icon.name ? 'light' : ''"
            @click="$emit('select', icon.name)"
          >
            <template v-if="icon.source === 'lineicons'">
              <Lineicons
                slot="start"
                :icon="icon.icon"
                :color="icon.color"
                :size="24"
              />
            </template>
            <ion-icon
              v-else
              slot="start"
              :icon="icon.icon"
              :style="{ color: icon.color, fontSize: '24px' }"
            />
            <ion-label>{{ icon.label }}</ion-label>
            <ion-note v-if="selectedSource === 'all'" slot="end"
              >({{ icon.source }})</ion-note
            >
          </ion-item>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonPopover,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { closeOutline, filterOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import { getIconsBySourceAndType } from "@/utils/iconsIndex";
import SystemController from "@/controllers/systemController";
import { DesignMode } from "@/utils/types";

const props = withDefaults(
  defineProps<{
    selectedIconName: string;
    type?: "social" | "tech" | "all";
    source?: "ionicons" | "lineicons" | "all";
    title?: string;
  }>(),
  {
    type: "all",
    source: "all",
    title: "Seleccionar icono",
  },
);

defineEmits<{
  (e: "select", name: string): void;
  (e: "close"): void;
}>();

const systemController = new SystemController();
const designMode = ref<DesignMode>(systemController.getdesignMode());

const searchText = ref("");
const selectedSource = ref<string>(props.source || "all");
const selectedType = ref<string>(props.type || "all");

const icons = computed(() =>
  getIconsBySourceAndType(
    selectedSource.value as "ionicons" | "lineicons" | "all",
    selectedType.value as "social" | "tech" | "all",
  ),
);

const filteredIcons = computed(() => {
  const list = searchText.value
    ? icons.value.filter(
        (icon) =>
          icon.label.toLowerCase().includes(searchText.value.toLowerCase()) ||
          icon.name.toLowerCase().includes(searchText.value.toLowerCase()),
      )
    : icons.value;
  return [...list].sort((a, b) => a.label.localeCompare(b.label, "es"));
});
</script>

<style scoped>
.icon-selector-root {
  height: 100%;
  width: 100%;
}
</style>
