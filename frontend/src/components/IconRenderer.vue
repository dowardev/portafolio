<script setup lang="ts">
import { computed } from "vue";
import { IonIcon } from "@ionic/vue";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import { getIconByName } from "@/composables/iconsIndex";

const props = defineProps<{
  name: string;
  color?: string;
  size?: string;
}>();

const iconData = computed(() => getIconByName(props.name));

const isLineIcon = computed(() => iconData.value?.source === "lineicons");

const iconColor = computed(() => props.color || iconData.value?.color || "#666666");
const iconSize = computed(() => props.size || "24px");
</script>

<template>
  <Lineicons
    v-if="isLineIcon && iconData"
    :icon="iconData.icon"
    :color="iconColor"
    :size="iconSize"
  />
  <ion-icon
    v-else-if="iconData"
    :icon="iconData.icon"
    :color="iconColor"
    :style="{ width: iconSize, height: iconSize, fontSize: iconSize }"
  />
</template>