<template>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ title }}</ion-label>

      <ion-button @click="openNewSelector">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-reorder-group :disabled="false" @ion-item-reorder="handleReorder">
      <ion-card v-for="(item, index) in modelValue" :key="item.iconName || index" class="shadow1">
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
            @ion-input="updateItem(index, { url: $event.detail.value || undefined })"
          ></ion-input>
        </ion-item>

        <ion-item v-if="$slots.extra" lines="none">
          <slot name="extra" :item="item" :index="index"></slot>
        </ion-item>

        <ion-item lines="none">
          <ion-reorder slot="end"></ion-reorder>
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
    </ion-reorder-group>

    <ion-modal :is-open="showSelector" @did-dismiss="showSelector = false">
      <IconSelectorContent
        :key="modalOpenCount"
        :selected-icon-name="selectedIcon"
        :type="type"
        :source="source"
        :title="title"
        @select="selectIcon"
        @close="showSelector = false"
      />
    </ion-modal>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonReorder,
  IonReorderGroup,
} from '@ionic/vue';
import type { ItemReorderEventDetail } from '@ionic/vue';
import { addOutline, trashOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { getIconByName, getIonIconSvg, getLineIconComponent, isLineIcon } from '@/utils/iconsIndex';
import { Lineicons } from '@lineiconshq/vue-lineicons';
import IconSelectorContent from '@/components/common/IconSelectorContent.vue';

export interface IconItem {
  iconName: string;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: IconItem[];
    type?: 'social' | 'tech' | 'all';
    source?: 'ionicons' | 'lineicons' | 'all';
    title?: string;
    placeholder?: string;
    showUrlInput?: boolean;
  }>(),
  {
    type: 'all',
    title: 'Seleccionar',
    placeholder: 'Seleccionar...',
    showUrlInput: false,
    source: 'all',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: IconItem[]): void;
  (e: 'add'): void;
  (e: 'remove', index: number): void;
}>();

const showSelector = ref(false);

// Incremented on every open so IconSelectorContent remounts fresh and its
// search/filters never survive a close-reopen cycle.
const modalOpenCount = ref(0);

function openSelector(index: number) {
  currentIndex = index;
  selectedIcon.value = props.modelValue[index]?.iconName || '';
  modalOpenCount.value += 1;
  showSelector.value = true;
}

function openNewSelector() {
  currentIndex = props.modelValue.length;
  selectedIcon.value = '';
  modalOpenCount.value += 1;
  showSelector.value = true;
}
let currentIndex = 0;

const selectedIcon = ref('');

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
  return icon?.color || '#666666';
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
  emit('update:modelValue', updated);
}

function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
  const { from: originIndex, to: destinationIndex, complete } = event.detail;
  try {
    const reorderResult = complete(props.modelValue);
    if (Array.isArray(reorderResult)) {
      emit('update:modelValue', [...reorderResult]);
    }
  } catch {
    const fallback = [...props.modelValue];
    if (originIndex !== destinationIndex) {
      const [moved] = fallback.splice(originIndex, 1);
      fallback.splice(destinationIndex, 0, moved);
      emit('update:modelValue', fallback);
    }
    try {
      complete(false);
    } catch {
      // ignore
    }
  }
}
</script>

<style scoped>
.icon-source {
  font-size: 0.75em;
  opacity: 0.7;
  font-weight: normal;
}
</style>
