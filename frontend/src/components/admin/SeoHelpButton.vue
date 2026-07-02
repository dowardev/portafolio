<template>
  <ion-button fill="clear" size="small" @click="openPopover">
    <ion-icon :icon="helpCircleOutline" />
  </ion-button>
  <ion-popover
    :is-open="open"
    :event="popoverEvent"
    side="top"
    alignment="start"
    @did-dismiss="open = false"
  >
    <ion-content class="ion-padding">{{ message }}</ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonPopover } from "@ionic/vue";
import { helpCircleOutline } from "ionicons/icons";
import { ref } from "vue";

defineProps<{
  message: string;
}>();

const open = ref(false);
const popoverEvent = ref(null);

function openPopover(event: MouseEvent) {
  popoverEvent.value = event;
  open.value = true;
}
</script>