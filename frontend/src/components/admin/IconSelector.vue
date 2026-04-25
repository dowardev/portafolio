<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ title }}</ion-label>

      <ion-button @click="$emit('add')">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card
      v-for="(item, index) in modelValue"
      :key="index"
      class="shadow1"
    >
      <ion-item button lines="full" @click="openSelector(index)">
        <template v-if="item.iconName">
          <ion-icon
            slot="start"
            :icon="getIcon(item.iconName)"
            :style="{ color: getColor(item.iconName) }"
          ></ion-icon>
          <ion-label :style="{ color: getColor(item.iconName) }">
            {{ getLabel(item.iconName) }}
          </ion-label>
        </template>
        <template v-else>
          <ion-label>{{ placeholder }}</ion-label>
        </template>
      </ion-item>

      <ion-item v-if="showUrlInput" lines="full">
        <ion-input
          v-model="item.url"
          label="URL"
          label-placement="floating"
          placeholder="https://..."
          type="url"
          @ion-input="updateItem(index, { url: $event.detail.value })"
        ></ion-input>
      </ion-item>

      <ion-item v-if="$slots.extra" lines="none">
        <slot name="extra" :item="item" :index="index"></slot>
      </ion-item>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          size="small"
          @click="$emit('remove', index)"
        >
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Eliminar
        </ion-button>
      </ion-item>
    </ion-card>

    <ion-modal :is-open="showSelector" @did-dismiss="showSelector = false">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="showSelector = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            v-model="searchText"
            placeholder="Buscar..."
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item
            button
            :color="!selectedIcon ? 'light' : ''"
            @click="selectIcon('')"
          >
            <ion-label>Ninguno</ion-label>
          </ion-item>
          <ion-item
            v-for="icon in filteredIcons"
            :key="icon.name"
            button
            :color="selectedIcon === icon.name ? 'light' : ''"
            @click="selectIcon(icon.name)"
          >
            <ion-icon
              slot="start"
              :icon="icon.icon"
              :style="{ color: icon.color, fontSize: '24px' }"
            ></ion-icon>
            <ion-label>{{ icon.label }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonCard,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonSearchbar,
  IonInput,
} from "@ionic/vue";
import { addOutline, trashOutline, closeOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { getIconsByType, getIconByName } from "@/composables/iconConfig";

export interface IconItem {
  iconName: string;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: IconItem[];
    type: "social" | "tech";
    title?: string;
    placeholder?: string;
    showUrlInput?: boolean;
  }>(),
  {
    title: "Seleccionar",
    placeholder: "Seleccionar...",
    showUrlInput: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: IconItem[]): void;
  (e: "add"): void;
  (e: "remove", index: number): void;
}>();

const icons = computed(() => getIconsByType(props.type));

const showSelector = ref(false);
const searchText = ref("");
let currentIndex = 0;

const selectedIcon = ref("");

const filteredIcons = computed(() => {
  if (!searchText.value) return icons.value;
  const search = searchText.value.toLowerCase();
  return icons.value.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search) ||
      icon.name.toLowerCase().includes(search)
  );
});

function getIcon(name: string) {
  const icon = getIconByName(name);
  return icon?.icon || closeOutline;
}

function getColor(name: string) {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}

function getLabel(name: string) {
  const icon = getIconByName(name);
  return icon?.label || name;
}

function openSelector(index: number) {
  currentIndex = index;
  selectedIcon.value = props.modelValue[index]?.iconName || "";
  showSelector.value = true;
}

function selectIcon(name: string) {
  updateItem(currentIndex, { iconName: name });
  showSelector.value = false;
}

function updateItem(index: number, updates: Partial<IconItem>) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], ...updates };
  emit("update:modelValue", updated);
}
</script>

<style scoped></style>