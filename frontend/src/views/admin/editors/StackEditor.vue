<template>
  <ion-list>
    <ion-list-header>
      <ion-button :disabled="!allValid" @click="addStackItem">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Añadir
      </ion-button>
    </ion-list-header>

    <ion-card v-for="(item, index) in modelValue" :key="index" class="shadow1">
      <ion-item lines="full">
        <ion-input
          label="Nombre"
          label-placement="floating"
          :value="item.name"
          placeholder="Ej: Vue.js"
          :error-text="getError({ index, field: 'name' })"
          :class="{
            'ion-invalid': hasError({ index, field: 'name' }),
            'ion-touched': touched[index]?.name,
          }"
          @ion-input="
            updateStackItem({ index, field: 'name', value: $event.detail.value! })
          "
          @ion-blur="touchField({ index, field: 'name' })"
        ></ion-input>
      </ion-item>

      <ion-item button lines="full" @click="openIconSelector({ index })">
        <template v-if="item.iconName">
          <template v-if="isLineIconName(item.iconName)">
            <Lineicons
              slot="start"
              :icon="getIconComponent(item.iconName)"
              :color="getIconColor(item.iconName)"
              :size="24"
            />
          </template>

          <ion-icon
            v-else
            slot="start"
            :icon="getIconSvg(item.iconName)"
            :style="{ color: getIconColor(item.iconName), fontSize: '24px' }"
          />

          <ion-label :style="{ color: getIconColor(item.iconName) }">
            {{ getIconLabel(item.iconName) }}
          </ion-label>
        </template>

        <template v-else>
          <ion-label>Seleccionar icono</ion-label>
        </template>

        <ion-note v-if="item.iconName" slot="end">Cambiar</ion-note>
        <ion-note v-else slot="end">Seleccionar</ion-note>
      </ion-item>

      <span v-if="hasError({ index, field: 'iconName' })" class="error">
        {{ getError({ index, field: "iconName" }) }}
      </span>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          @click="removeStackItem({ index })"
        >
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Eliminar
        </ion-button>
      </ion-item>
    </ion-card>
  </ion-list>

  <ion-modal :is-open="showSelector" @did-dismiss="showSelector = false">
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-button @click="showSelector = false">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Seleccionar icono</ion-title>

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
              :color="selectedIconName === icon.name ? 'light' : ''"
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
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonPopover,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import {
  addOutline,
  closeOutline,
  trashOutline,
  filterOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { StackItem } from "@/services/types";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import {
  getIconsBySourceAndType,
  getIconByName,
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/composables/iconsIndex";
import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";

const systemController = new SystemController();

const props = defineProps<{
  modelValue: StackItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: StackItem[]): void;
}>();

const touched = reactive<Record<number, Record<string, boolean>>>({});

const rules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      iconName: {
        required: helpers.withMessage("Icono es requerido", required),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { items: computed(() => props.modelValue) });

const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return !v$.value.$invalid;
});

function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addStackItem() {
  emit("update:modelValue", [...props.modelValue, { name: "", iconName: "" }]);
}

function updateStackItem(params: {
  index: number;
  field: keyof StackItem;
  value: string;
}) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeStackItem(params: { index: number }) {
  const { index } = params;
  delete touched[index];
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}

const showSelector = ref(false);
const searchText = ref("");
const selectedSource = ref<string>("all");
const selectedType = ref<string>("all");
const selectedIconName = ref("");
const designMode = ref<DesignMode>(systemController.getdesignMode());
let currentIndex = -1;

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

function openIconSelector(params: { index: number }) {
  const { index } = params;
  currentIndex = index;
  selectedIconName.value = props.modelValue[index]?.iconName || "";
  showSelector.value = true;
}

function selectIcon(name: string) {
  if (currentIndex >= 0) {
    const updated = [...props.modelValue];
    updated[currentIndex] = { ...updated[currentIndex], iconName: name };
    emit("update:modelValue", updated);
    touchField({ index: currentIndex, field: "iconName" });
  }
  showSelector.value = false;
}

function isLineIconName(name: string): boolean {
  return isLineIcon(name);
}

function getIconSvg(name: string): string | undefined {
  return getIonIconSvg(name);
}

function getIconComponent(name: string): object | undefined {
  return getLineIconComponent(name);
}

function getIconColor(name: string): string {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}

function getIconLabel(name: string): string {
  const icon = getIconByName(name);
  return icon?.label || name;
}
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}
</style>
