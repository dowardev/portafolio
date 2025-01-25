<template>
  <div
    ref="cardRef"
    class="container"
    :class="{
      shadow: props.lines,

      'primary-border':
        props.border.active &&
        props.border.color == 'primary' &&
        props.border.mode == 'normal',
      'danger-border':
        props.border.active &&
        props.border.color == 'danger' &&
        props.border.mode == 'normal',

      'primary-border-hover':
        props.border.active &&
        props.border.color == 'primary' &&
        props.border.mode == 'hover',
      'danger-border-hover':
        props.border.active &&
        props.border.color == 'danger' &&
        props.border.mode == 'hover',

      'primary-fill':
        props.background.active && props.background.color == 'primary',
      'danger-fill':
        props.background.active && props.background.color == 'danger',
    }"
  >
    <ion-item
      :lines="props.lines ? 'full' : 'none'"
      class="transparent"
      button
      @click="toggleExpand"
    >
      <ion-icon
        slot="start"
        :color="props.mainMessage.color"
        :icon="props.icon"
      ></ion-icon>
      <ion-label color="danger">{{ props.mainMessage.message }}</ion-label>
    </ion-item>

    <div style="display: flex">
      <ion-button
        v-show="isExpanded"
        :color="props.option1.color"
        style="width: 50%"
        fill="clear"
        @click="emit('click-op1')"
      >
        {{ props.option1.message }}
      </ion-button>

      <ion-button
        v-show="isExpanded"
        :color="props.option2.color"
        style="width: 50%"
        fill="clear"
        @click="emit('click-op2')"
      >
        {{ props.option2.message }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { Animation, createAnimation } from "@ionic/vue";
import { IonButton } from "@ionic/vue";

// Props
const props = withDefaults(
  defineProps<{
    background?: { active: boolean; color?: string };
    border?: { active: boolean; color?: string; mode?: "normal" | "hover" };
    icon: string;
    lines?: boolean;
    mainMessage: { color?: "primary" | "danger"; message: string };
    option1: { color?: "primary" | "danger"; message: string };
    option2: { color?: "primary" | "danger"; message: string };
  }>(),
  {
    background: () => ({ active: false, color: "primary" }),
    border: () => ({ active: false, color: "primary", mode: "normal" }),
    lines: false,
    mainMessage: () => ({ color: "primary", message: "" }),
    option1: () => ({ color: "primary", message: "" }),
    option2: () => ({ color: "primary", message: "" }),
  },
);
const emit = defineEmits(["click-op1", "click-op2"]);
defineExpose({ toggleExpand });
// end props

// compontents refs
const cardRef = ref<HTMLElement | null>(null);
// end compontents refs

// vars
const isExpanded = ref(false);
let expandAnimation: Animation;
let contractAnimation: Animation;
// end vars

// life
onMounted(() => {
  if (cardRef.value) {
    const element = cardRef.value;

    expandAnimation = createAnimation()
      .addElement(element)
      .duration(200)
      .beforeStyles({
        height: `${element.offsetHeight}px`,
        display: "block",
      })
      .afterStyles({
        height: "auto",
        display: "block",
      });

    contractAnimation = createAnimation()
      .addElement(element)
      .duration(200)
      .beforeStyles({
        height: "auto",
        display: "block",
      })
      .afterStyles({
        display: "block",
      });
  }
});
// end life

// functions
async function toggleExpand() {
  try {
    if (isExpanded.value) {
      if (cardRef.value) {
        const height = cardRef.value.offsetHeight;
        contractAnimation.keyframes([
          { offset: 0, height: `${height}px` },
          { offset: 1, height: "55px" },
        ]);
      }
      contractAnimation?.stop();
      isExpanded.value = false;
      await contractAnimation?.play();
    } else {
      if (cardRef.value) {
        isExpanded.value = true;
        await nextTick();
        const finalHeight = cardRef.value.scrollHeight;
        isExpanded.value = false;

        expandAnimation.keyframes([
          { offset: 0, height: "55px" },
          { offset: 1, height: `${finalHeight}px` },
        ]);
      }
      expandAnimation?.stop();
      isExpanded.value = true;
      await expandAnimation?.play();
    }
  } catch (error) {
    console.error("Animation error:", error);
  }
}

// end functions
</script>

<style scoped>
.container {
  --border: 1.5px;
  border-radius: 4px;
  border: var(--border) solid transparent;
}

.shadow {
  box-shadow:
    rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.primary-border {
  border: var(--border) solid var(--ion-color-primary);
}

.danger-border {
  border: var(--border) solid var(--ion-color-danger);
}

.primary-border-hover:hover {
  border: var(--border) solid var(--ion-color-primary);
}

.danger-border-hover:hover {
  border: var(--border) solid var(--ion-color-danger);
}

.primary-fill {
  background: var(--ion-color-primary-background-hover);
}

.danger-fill {
  background: var(--ion-color-danger-background-hover);
}
</style>
