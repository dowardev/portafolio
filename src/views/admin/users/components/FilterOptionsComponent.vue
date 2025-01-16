<template>
  <div>
    <ion-row>
      <ion-col size="12">
        <!-- email options -->
        <ion-card
          ref="cardEmailOptionRef"
          class="primary-select-border"
          :style="{ height: optionsProperties.email.height }"
        >
          <div class="card-content">
            <ion-item
              button
              lines="full"
              @click="handleCardOptionAnimation('email')"
            >
              <ion-label
                >Email: {{ optionsProperties.email.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
            <!-- options -->
            <ion-item
              v-for="option in optionsProperties.email.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.email.value == option"
              button
              @click="
                optionsProperties.email.value = option;
                handleCardOptionAnimation('email');
              "
            >
              {{ option.label }}
            </ion-item>
          </div>
        </ion-card>

        <!-- user options -->
        <ion-card
          ref="cardUserOptionRef"
          class="primary-select-border"
          :style="{ height: optionsProperties.user.height }"
        >
          <div class="card-content">
            <ion-item
              button
              lines="full"
              @click="handleCardOptionAnimation('user')"
            >
              <ion-label
                >Usuario: {{ optionsProperties.user.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
            <!-- options -->
            <ion-item
              v-for="option in optionsProperties.user.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.user.value == option"
              button
              @click="
                optionsProperties.user.value = option;
                handleCardOptionAnimation('user');
              "
            >
              {{ option.label }}
            </ion-item>
          </div>
        </ion-card>

        <!-- user rol options -->
        <ion-card
          ref="cardUserRolOptionRef"
          class="primary-select-border"
          :style="{ height: optionsProperties.rol.height }"
        >
          <div class="card-content">
            <ion-item
              button
              lines="full"
              @click="handleCardOptionAnimation('rol')"
            >
              <ion-label
                >Rol: {{ optionsProperties.rol.value.label }}</ion-label
              >
              <ion-icon :icon="chevronExpandOutline"></ion-icon>
            </ion-item>
            <!-- options -->
            <ion-item
              v-for="option in optionsProperties.rol.values"
              :key="option.name"
              :value="option.name"
              :disabled="optionsProperties.rol.value == option"
              button
              @click="
                optionsProperties.rol.value = option;
                handleCardOptionAnimation('rol');
              "
            >
              {{ option.label }}
            </ion-item>
          </div>
        </ion-card>
      </ion-col>
    </ion-row>
  </div>
</template>

<script lang="ts" setup>
import { Animation, createAnimation } from "@ionic/vue";
import { chevronExpandOutline } from "ionicons/icons";
import { onMounted, ref, reactive } from "vue";

const cardEmailOptionRef = ref<HTMLElement | null>(null);
const cardUserOptionRef = ref<HTMLElement | null>(null);
const cardUserRolOptionRef = ref<HTMLElement | null>(null);

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
  expandAnimation?: Animation;
  contractAnimation?: Animation;
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
  initAnimations();
  applyInitialFilters();
});

defineExpose({
  getFiltersSelected,
  resetFilters,
});

// functions
async function handleCardOptionAnimation(optionType: "email" | "user" | "rol") {
  const cardRef =
    optionType === "email"
      ? cardEmailOptionRef
      : optionType === "user"
        ? cardUserOptionRef
        : cardUserRolOptionRef;
  const option = optionsProperties[optionType];

  if (!cardRef.value) {
    return;
  }
  initAnimations();
  if (option.expanded) {
    option.contractAnimation?.stop();
    await option.contractAnimation?.play();
    option.height = option.collapsedHeight;
  } else {
    option.expandAnimation?.stop();
    await option.expandAnimation?.play();
    option.height = cardRef.value.scrollHeight + "px";
  }
  option.expanded = !option.expanded;
}

function initAnimations() {
  (["email", "user", "rol"] as const).forEach((optionType) => {
    const cardRef =
      optionType === "email"
        ? cardEmailOptionRef
        : optionType === "user"
          ? cardUserOptionRef
          : cardUserRolOptionRef;
    const option = optionsProperties[optionType];

    if (cardRef.value) {
      const cardElement = cardRef.value;
      const expandedHeight = cardElement.scrollHeight + "px";

      option.expandAnimation = createAnimation()
        .addElement(cardElement)
        .duration(200)
        .keyframes([
          { offset: 0, height: option.collapsedHeight },
          { offset: 1, height: expandedHeight },
        ]);

      option.contractAnimation = createAnimation()
        .addElement(cardElement)
        .duration(200)
        .keyframes([
          { offset: 0, height: expandedHeight },
          { offset: 1, height: option.collapsedHeight },
        ]);
    }
  });
}

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
