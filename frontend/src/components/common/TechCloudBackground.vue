<template>
  <section ref="container" class="skills-section">
    <h2 class="section-title">{{ title }}</h2>

    <div class="main-icons">
      <div v-for="icon in mainIcons" :key="icon.name" class="main-icon">
        <img :src="icon.svg" :alt="icon.name" />
        <span class="icon-label">{{ icon.name }}</span>
      </div>
    </div>

    <span
      v-for="tech in techPositions"
      :key="tech.name"
      class="floating-label"
      :style="{
        top: tech.y + 'px',
        left: tech.x + 'px',
        fontSize: tech.size + 'px',
      }"
      >{{ tech.name }}</span
    >
  </section>
</template>

<script lang="ts" setup>
// imports
import { ref, onMounted, nextTick, computed } from "vue";
// end

// types and interfaces
type MainIcon = { name: string; svg: string };
type BackgroundTech = { name: string };
type Position = {
  name: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
};
// end types and interfaces

// props
const props = defineProps<{
  title?: string;
  mainIcons?: MainIcon[];
  backgroundTechs?: BackgroundTech[];
  height?: number;
  bgColor?: string;
  titleColor?: string;
  labelColor?: string;
  iconLabelColor?: string;
}>();
// end props

// main (runtime defaults and derived vars)
const title = props.title ?? "My Skillsets";
const mainIcons = props.mainIcons ?? [];
const backgroundTechs = props.backgroundTechs ?? [];
const height = props.height ?? 340;
const bgColor = props.bgColor ?? "#16161a";
const titleColor = props.titleColor ?? "#ffffff";
const labelColor = props.labelColor ?? "#888888";
const iconLabelColor = props.iconLabelColor ?? "#888888";

const container = ref<HTMLElement | null>(null);
const techPositions = ref<Position[]>([]);
// end main

// computed
const heightPx = computed(() => height + "px");
const iconSize = computed(
  () => Math.max(36, Math.min(72, height * 0.18)) + "px",
);
const iconGap = computed(() => Math.max(20, Math.min(48, height * 0.1)) + "px");
const titleSize = computed(
  () => Math.max(14, Math.min(24, height * 0.055)) + "px",
);
const titleMargin = computed(
  () => Math.max(12, Math.min(32, height * 0.08)) + "px",
);
// end computed

// onMounted
onMounted(async () => {
  await nextTick();

  const calcPositions = () => {
    const el = container.value;
    if (!el) return;

    const iconsEl = el.querySelector<HTMLElement>(".main-icons");
    const titleEl = el.querySelector<HTMLElement>(".section-title");
    if (!iconsEl || !titleEl) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w === 0 || h === 0) return;

    const iconsRect = iconsEl.getBoundingClientRect();
    const titleRect = titleEl.getBoundingClientRect();
    const containerRect = el.getBoundingClientRect();

    const pad = 30;
    const excludeLeft = iconsRect.left - containerRect.left - pad;
    const excludeRight = iconsRect.right - containerRect.left + pad;
    const excludeTop = titleRect.top - containerRect.top - 10;
    const excludeBottom = iconsRect.bottom - containerRect.top + 10;

    const hasLeftSpace = excludeLeft > 80;
    const hasRightSpace = w - excludeRight > 80;
    const hasTopSpace = excludeTop > 20;
    const hasBottomSpace = h - excludeBottom > 20;

    // accepts a lightweight placed array (only x/y required)
    const tooClose = (
      x: number,
      y: number,
      placed: { x: number; y: number }[],
    ) => placed.some((p) => Math.abs(p.x - x) < 110 && Math.abs(p.y - y) < 26);

    const placed: { x: number; y: number }[] = [];

    techPositions.value = backgroundTechs.map((t, i) => {
      const maxTextWidth = t.name.length * 9;
      let x: number | undefined,
        y: number | undefined,
        tries = 0;

      const zones: string[] = [];
      if (hasLeftSpace && hasTopSpace) zones.push("top-left");
      if (hasRightSpace && hasTopSpace) zones.push("top-right");
      if (hasLeftSpace && hasBottomSpace) zones.push("bottom-left");
      if (hasRightSpace && hasBottomSpace) zones.push("bottom-right");
      if (hasTopSpace) zones.push("top-center");
      if (hasBottomSpace) zones.push("bottom-center");

      const zone = zones.length ? zones[i % zones.length] : "top-center";
      // FIX:mejorar
      do {
        switch (zone) {
          case "top-left":
            x =
              10 + Math.random() * Math.max(0, excludeLeft - maxTextWidth - 10);
            y = 10 + Math.random() * Math.max(0, excludeTop - 20);
            break;
          case "top-right":
            x = Math.min(
              excludeRight +
                10 +
                Math.random() *
                  Math.max(0, w - excludeRight - maxTextWidth - 30),
              w - maxTextWidth - 30,
            );
            y = 10 + Math.random() * Math.max(0, excludeTop - 20);
            break;
          case "bottom-left":
            x =
              10 + Math.random() * Math.max(0, excludeLeft - maxTextWidth - 10);
            y =
              excludeBottom +
              10 +
              Math.random() * Math.max(0, h - excludeBottom - 30);
            break;
          case "bottom-right":
            x = Math.min(
              excludeRight +
                10 +
                Math.random() *
                  Math.max(0, w - excludeRight - maxTextWidth - 30),
              w - maxTextWidth - 30,
            );
            y =
              excludeBottom +
              10 +
              Math.random() * Math.max(0, h - excludeBottom - 30);
            break;
          case "top-center":
            x = 10 + Math.random() * Math.max(0, w - maxTextWidth - 20);
            y = 10 + Math.random() * Math.max(0, excludeTop - 20);
            break;
          case "bottom-center":
            x = 10 + Math.random() * Math.max(0, w - maxTextWidth - 20);
            y =
              excludeBottom +
              10 +
              Math.random() * Math.max(0, h - excludeBottom - 30);
            break;
        }
        tries++;
      } while (
        tries < 60 &&
        (x === undefined || y === undefined || tooClose(x, y, placed))
      );

      placed.push({ x: x ?? 0, y: y ?? 0 });
      return {
        name: t.name,
        x: x ?? 0,
        y: y ?? 0,
        size: 11 + Math.random() * 5,
        // Force full opacity for floating labels so they render solid (no faded look)
        opacity: 1,
      } as Position;
    });

    obs.disconnect();
  };

  const obs = new ResizeObserver(calcPositions);
  if (container.value) obs.observe(container.value);
});
// end onMounted
</script>

<style scoped>
.skills-section {
  position: relative;
  width: 100%;
  height: v-bind(heightPx);
  background: v-bind(bgColor);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.section-title {
  color: v-bind(titleColor);
  font-weight: 700;
  font-size: v-bind(titleSize);
  margin: 0 0 v-bind(titleMargin);
  position: relative;
  z-index: 2;
}

.main-icons {
  display: flex;
  gap: v-bind(iconGap);
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.main-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.main-icon img {
  width: v-bind(iconSize);
  height: v-bind(iconSize);
  object-fit: contain;
}

.icon-label {
  color: var(--ion-color-primary);
  font-size: 14px;
  font-weight: 700;
}

.floating-label {
  position: absolute;
  color: v-bind(labelColor);
  font-family: monospace;
  font-weight: 700;
  text-transform: uppercase;
  pointer-events: auto;
  user-select: none;
  z-index: 1;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.skills-section:has(.floating-label:hover) .floating-label:not(:hover) {
  opacity: 0.25;
}
</style>
