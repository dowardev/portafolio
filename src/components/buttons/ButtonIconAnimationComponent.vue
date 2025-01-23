<template>
  <ion-button
    :mode="props.designMode"
    :class="status ? 'btn-refresh-expanded' : 'btn-refresh-normal'"
    :disabled="props.disabled"
    :fill="props.fill"
    :color="props.color"
    :ripple-effect="false"
    style="--ripple-color: transparent"
  >
    <ion-icon
      :class="{ 'ion-padding-end': active }"
      :icon="props.icon"
    ></ion-icon>
    <transition name="fade-refresh">
      <span v-if="status">{{ props.message }}</span>
    </transition>
  </ion-button>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IonButton } from "@ionic/vue";

const props = withDefaults(
  defineProps<{
    active?: boolean;
    color?: "primary" | "danger";
    designMode?: "md" | "ios";
    disabled?: boolean;
    fill?: "clear" | "outline" | "solid" | "default";
    icon: string;
    message: string;
  }>(),
  {
    active: false,
    color: "primary",
    designMode: "md",
    disabled: false,
    fill: "clear",
  },
);
const status = ref(props.active);

watch(
  () => props.active,
  (newValue) => {
    status.value = newValue;
  },
);

// functions
</script>

<style scoped>
.btn-refresh-normal {
  width: 50px;
  transition: all 0.4s ease;
}

.btn-refresh-expanded {
  width: 150px;
  transition: all 0.4s ease;
}

.fade-refresh-enter-active,
.fade-refresh-leave-active {
  transition: opacity 0.3s ease;
}
.fade-refresh-enter,
.fade-refresh-leave-to {
  opacity: 0;
}
</style>
