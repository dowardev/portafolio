<template>
  <div ref="cardRef" class="container">
    <!-- <ion-item lines="none" class="transparent" button @click="toggleExpand"> -->
    <!--   <slot name="icon"></slot> -->
    <!--   <slot name="label"></slot> -->
    <!-- </ion-item> -->

    <slot name="header" @click="toggleExpand()"></slot>

    <div v-show="isExpanded">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { Animation, createAnimation } from "@ionic/vue";

const cardRef = ref<HTMLElement | null>(null);
const isExpanded = ref(false);
let expandAnimation: Animation;
let contractAnimation: Animation;

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

async function toggleExpand() {
  alert();
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
}
</script>

<style scoped>
.container {
  overflow: hidden;
}

.transparent {
  --background: transparent;
}
</style>
