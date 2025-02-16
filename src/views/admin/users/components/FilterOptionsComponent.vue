<template>
  <div>
    <ion-row>
      <ion-col size="12">
        <!-- email options -->
        <CardOptionsExpand
          ref="cardEmailOptionRef"
          class="primary-select-border shadow-1"
          :style="{ height: optionsProperties.email.height }"
        >
          <template #header>
            <ion-item button lines="full">
              <ion-label class="truncate-text">
                <span style="font-weight: bold">Email:</span>
                {{ optionsProperties.email.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
          </template>

          <template #content>
            <ion-item
              v-for="option in optionsProperties.email.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.email.value == option"
              button
              @click="
                optionsProperties.email.value = option;
                cardEmailOptionRef?.toggleExpand();
              "
            >
              {{ option.label }}
            </ion-item>
          </template>
        </CardOptionsExpand>

        <!-- user options -->
        <CardOptionsExpand
          ref="cardUserOptionRef"
          class="primary-select-border shadow-1"
          :style="{ height: optionsProperties.user.height }"
        >
          <template #header>
            <ion-item button lines="full">
              <ion-label class="truncate-text">
                <span style="font-weight: bold">Usuario:</span>
                : {{ optionsProperties.user.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
          </template>

          <template #content>
            <ion-item
              v-for="option in optionsProperties.user.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.user.value == option"
              button
              @click="
                optionsProperties.user.value = option;
                cardUserOptionRef?.toggleExpand();
              "
            >
              {{ option.label }}
            </ion-item>
          </template>
        </CardOptionsExpand>

        <!-- user rol options -->
        <CardOptionsExpand
          ref="cardUserRolOptionRef"
          class="primary-select-border shadow-1"
          :style="{ height: optionsProperties.rol.height }"
        >
          <template #header>
            <ion-item button lines="full">
              <ion-label class="truncate-text">
                <span style="font-weight: bold">Rol:</span>
                {{ optionsProperties.rol.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
          </template>

          <template #content>
            <ion-item
              v-for="option in optionsProperties.rol.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.rol.value == option"
              button
              @click="
                optionsProperties.rol.value = option;
                cardUserRolOptionRef?.toggleExpand();
              "
            >
              {{ option.label }}
            </ion-item>
          </template>
        </CardOptionsExpand>
      </ion-col>
    </ion-row>
  </div>
</template>

<script lang="ts" setup>
import { chevronExpandOutline } from "ionicons/icons";
import { onMounted, ref, reactive } from "vue";

// components
import { CardOptionsExpand } from "ionic-extra-components";

const cardEmailOptionRef = ref<typeof CardOptionsExpand | null>(null);
const cardUserOptionRef = ref<typeof CardOptionsExpand | null>(null);
const cardUserRolOptionRef = ref<typeof CardOptionsExpand | null>(null);

// interface
import {
  EmailFilterOption,
  UserFilterOption,
  UserRolFilterOption,
} from "@/utils/types";
import { FilterAdminPanelOptions } from "@/services/interfaces";
interface OptionProperties {
  value: { name: string; label: string };
  values: { name: string; label: string }[];
  collapsedHeight: string;
  expanded: boolean;
  height: string;
}

// vars
const props = defineProps<{
  filters: {
    email: EmailFilterOption;
    user: UserFilterOption;
    rol: UserRolFilterOption;
  };
}>();
const optionsProperties: Record<"email" | "user" | "rol", OptionProperties> =
  reactive({
    email: {
      value: { name: "all", label: "Todos" },
      values: [
        { name: "all", label: "Todos" },
        { name: "verified", label: "Verificados" },
        { name: "unverified", label: "Verificar" },
      ],
      collapsedHeight: "58px",
      expanded: false,
      height: "58px",
    },
    user: {
      value: { name: "all", label: "Todos" },
      values: [
        { name: "all", label: "Todos" },
        { name: "enabled", label: "Habilitados" },
        { name: "disabled", label: "Deshabilitados" },
      ],
      collapsedHeight: "58px",
      expanded: false,
      height: "58px",
    },
    rol: {
      value: { name: "all", label: "Todos" },
      values: [
        { name: "all", label: "Todos" },
        { name: "admin", label: "Administrador" },
      ],
      collapsedHeight: "58px",
      expanded: false,
      height: "58px",
    },
  });

onMounted(async () => {
  applyInitialFilters();
});

defineExpose({
  getFiltersSelected,
  resetFilters,
});

// functions
function getFiltersSelected(): FilterAdminPanelOptions {
  return {
    email: optionsProperties.email.value.name as EmailFilterOption,
    user: optionsProperties.user.value.name as UserFilterOption,
    rol: optionsProperties.rol.value.name as UserRolFilterOption,
  };
}

function resetFilters() {
  optionsProperties.email.value = optionsProperties.email.values[0];
  optionsProperties.user.value = optionsProperties.user.values[0];
  optionsProperties.rol.value = optionsProperties.rol.values[0];
}

function applyInitialFilters() {
  if (props.filters.email !== optionsProperties.email.value.name) {
    optionsProperties.email.value = optionsProperties.email.values.find(
      (option) => option.name === props.filters.email,
    )!;
  }
  if (props.filters.user !== optionsProperties.user.value.name) {
    optionsProperties.user.value = optionsProperties.user.values.find(
      (option) => option.name === props.filters.user,
    )!;
  }
  if (props.filters.rol !== optionsProperties.rol.value.name) {
    optionsProperties.rol.value = optionsProperties.rol.values.find(
      (option) => option.name === props.filters.rol,
    )!;
  }
}
</script>

<style scoped>
.truncate-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
