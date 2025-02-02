<template>
  <ion-button
    :mode="props.designMode"
    :class="config.status ? 'btn-refresh-expanded' : 'btn-refresh-normal'"
    :disabled="config.disabled"
    :fill="config.fill"
    :color="config.color"
    :ripple-effect="false"
    style="--ripple-color: transparent"
  >
    <div
      v-if="$slots['icon-start']"
      :class="{ 'ion-padding-end': config.status }"
    >
      <slot name="icon-start"></slot>
    </div>

    <transition name="fade-refresh">
      <span v-if="config.status">
        <slot name="message"></slot>
      </span>
    </transition>

    <div
      v-if="$slots['icon-end']"
      :class="{ 'ion-padding-start': config.status }"
    >
      <slot name="icon-end"></slot>
    </div>
  </ion-button>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { IonButton } from "@ionic/vue";

// component props
const props = withDefaults(
  defineProps<{
    status?: boolean;
    color?: "primary" | "danger";
    designMode?: "md" | "ios";
    disabled?: boolean;
    fill?: "clear" | "outline" | "solid" | "default";
  }>(),
  {
    status: false,
    color: "primary",
    designMode: "md",
    disabled: false,
    fill: "clear",
  },
);
defineExpose({ updateConfig });
// end component props

// vars
const config = reactive({
  status: props.status,
  fill: props.fill,
  color: props.color,
  designMode: props.designMode,
  disabled: props.disabled,
});
// end vars

// life
watch(
  () => props.status,
  (newValue) => {
    config.status = newValue;
  },
);
watch(
  () => props.fill,
  (newValue) => {
    config.fill = newValue;
  },
);
watch(
  () => props.color,
  (newValue) => {
    config.color = newValue;
  },
);
// end life

// functions
function updateConfig(params: {
  status?: boolean;
  fill?: "clear" | "outline" | "solid" | "default";
  color?: "primary" | "danger";
  designMode?: "md" | "ios";
  disabled?: boolean;
}) {
  const { status, fill, color, designMode, disabled } = params;
  if (status !== undefined) config.status = status;
  if (fill !== undefined) config.fill = fill;
  if (color !== undefined) config.color = color;
  if (designMode !== undefined) config.designMode = designMode;
  if (disabled !== undefined) config.disabled = disabled;
}
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
