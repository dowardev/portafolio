<template>
  <div :class="{ 'menu-option-selected': isActive }">
    <ion-item
      :disabled="disabled"
      button
      lines="none"
      :class="transparent ? 'transparent' : ''"
      @click="handleClick"
    >
      <ion-icon
        v-if="!loading"
        slot="start"
        color="primary"
        :icon="isActive ? iconFilled : iconOutline"
      ></ion-icon>

      <ion-spinner
        v-if="loading"
        slot="start"
        color="primary"
        name="crescent"
      >
      </ion-spinner>
      <ion-label>{{ label }}</ion-label>
    </ion-item>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonIcon, IonLabel, IonSpinner } from "@ionic/vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { menuController } from "@ionic/vue";

interface Props {
  targetRoute?: string;
  targetRouteName?: string;
  activeRoutes: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconOutline: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconFilled: any;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  transparent?: boolean;
  closeMenuOnClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  targetRoute: undefined,
  targetRouteName: undefined,
  disabled: false,
  loading: false,
  transparent: false,
  closeMenuOnClick: true,
});

const emit = defineEmits<{
  click: [];
}>();

const route = useRoute();
const router = useRouter();

const isActive = computed(() => {
  return props.activeRoutes.includes(route.name as string);
});

function handleClick() {
  if (props.targetRoute) {
    router.push(props.targetRoute);
  } else if (props.targetRouteName) {
    router.push({ name: props.targetRouteName });
  }
  emit("click");
  if (props.closeMenuOnClick) {
    menuController.close();
  }
}
</script>

<style scoped>
.menu-option-selected {
  border-left: 6px solid var(--ion-color-primary);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  transition: border-left 0.4s ease-in-out;
}

.menu-option-selected > ion-item {
  --background: var(--ion-color-primary-background-hover);
  transition: background 0.4s ease-in-out;
}

.menu-option-selected > ion-item > ion-label {
  color: var(--ion-color-primary);
  transition: color 0.4s ease-in-out;
}
</style>