<template>
  <ion-item button :color="props.background" :lines="props.lines">
    <ion-icon
      v-if="props.icon"
      slot="start"
      :color="props.color"
      :icon="props.icon"
    ></ion-icon>

    <ion-label :color="props.color" class="roller">
      <span id="rolltext">{{ getCurrentText }}</span>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, computed, ref, watch } from "vue";
import { IonItem } from "@ionic/vue";

// vars
defineExpose({ setStep });
const props = withDefaults(
  defineProps<{
    background?: string;
    color?: string;
    icon?: string;
    lines?: "none" | "full" | "inset";
    texts: string[];
    step?: number;
  }>(),
  {
    background: "",
    color: "",
    icon: "",
    lines: "inset",
    step: 1,
  },
);
const localStep = ref(props.step);
// end vars

// computed
const getCurrentText = computed(() => {
  return props.texts[localStep.value - 1] || "";
});
// end computed

// watch
watch(
  () => props.step,
  (newStep) => {
    console.log(newStep);
    localStep.value = newStep;
  },
);
// end watch

// functions
function setStep(step: number) {
  localStep.value = step;
}
</script>

<style scoped>
.roller {
  height: 1.5rem;
  line-height: 1.5rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
}

.roller #rolltext {
  position: absolute;
  top: 0;
  animation: slide 0.5s forwards;
}

@keyframes slide {
  0% {
    top: 1.5rem;
  }
  100% {
    top: 0;
  }
}
</style>
