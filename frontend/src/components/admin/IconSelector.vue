<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ title }}</ion-label>

      <ion-button @click="openNewSelector">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card v-for="(item, index) in modelValue" :key="index" class="shadow1">
      <ion-item button lines="full" @click="openSelector(index)">
        <template v-if="item.iconName">
          <template v-if="isLineIconName(item.iconName)">
            <Lineicons
              slot="start"
              :icon="getIconComponent(item.iconName)"
              :color="getColor(item.iconName)"
              :size="24"
            />
          </template>

          <ion-icon
            v-else
            slot="start"
            :icon="getIconSvg(item.iconName)"
            :style="{ color: getColor(item.iconName) }"
          />

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
          @ion-input="
            updateItem(index, { url: $event.detail.value || undefined })
          "
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
        <ion-toolbar style="--background: var(--ion-background-color)">
          <ion-buttons slot="start">
            <ion-button @click="showSelector = false">
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
          :trigger="'type-trigger'"
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

      <ion-content :scroll-y="false">
        <div style="display: flex; flex-direction: column; height: 100%">
          <ion-list style="overflow: hidden">
            <ion-card
              class="shadow1"
              style="overflow: auto; height: 96%"
            >
              <ion-item
                v-for="icon in filteredIcons"
                :key="icon.name"
                lines="full"
                button
                :color="selectedIcon === icon.name ? 'light' : ''"
                @click="selectIcon(icon.name)"
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

                <ion-label>
                  {{ icon.label }}
                </ion-label>

                <ion-note v-if="selectedSource === 'all'" slot="end">
                  ({{ icon.source }})
                </ion-note>
              </ion-item>
            </ion-card>
          </ion-list>
        </div>
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
  IonSegment,
  IonSegmentButton,
  IonPopover,
} from "@ionic/vue";
import {
  addOutline,
  trashOutline,
  closeOutline,
  filterOutline,
} from "ionicons/icons";
import { computed, ref } from "vue";
import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";
import {
  getIconsBySourceAndType,
  getIconByName,
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/composables/iconsIndex";
import { Lineicons } from "@lineiconshq/vue-lineicons";

const systemController = new SystemController();

export interface IconItem {
  iconName: string;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: IconItem[];
    type?: "social" | "tech" | "all";
    source?: string;
    title?: string;
    placeholder?: string;
    showUrlInput?: boolean;
  }>(),
  {
    type: "all",
    title: "Seleccionar",
    placeholder: "Seleccionar...",
    showUrlInput: false,
    source: "all",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: IconItem[]): void;
  (e: "add"): void;
  (e: "remove", index: number): void;
}>();

const selectedSource = ref<string>(props.source || "all");
const selectedType = ref<string>(props.type || "all");
const designMode = ref<DesignMode>(systemController.getdesignMode());

const icons = computed(() =>
  getIconsBySourceAndType(
    selectedSource.value as "ionicons" | "lineicons" | "all",
    selectedType.value as "social" | "tech" | "all",
  ),
);

const showSelector = ref(false);

function openSelector(index: number) {
  currentIndex = index;
  selectedIcon.value = props.modelValue[index]?.iconName || "";
  showSelector.value = true;
}

function openNewSelector() {
  currentIndex = props.modelValue.length;
  selectedIcon.value = "";
  showSelector.value = true;
}
const searchText = ref("");
let currentIndex = 0;

const selectedIcon = ref("");

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

function isLineIconName(name: string): boolean {
  return isLineIcon(name);
}

function getIconSvg(name: string): string | undefined {
  return getIonIconSvg(name);
}

function getIconComponent(name: string): object | undefined {
  return getLineIconComponent(name);
}

function getColor(name: string) {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}

function getLabel(name: string) {
  const icon = getIconByName(name);
  return icon?.label || name;
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

<style scoped>
.icon-source {
  font-size: 0.75em;
  opacity: 0.7;
  font-weight: normal;
}
</style>
