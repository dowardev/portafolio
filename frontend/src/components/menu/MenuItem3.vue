<template>
  <div
    class="menu-item3"
    :class="{ active: isActive, 'is-disabled': disabled }"
    :tabindex="disabled ? -1 : 0"
    role="button"
    :aria-disabled="disabled"
    :aria-label="label"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="item3-indicator"></div>

    <span class="item3-label" :class="{ 'is-active': isActive }">{{ label }}</span>

    <span v-if="loading" class="item3-spinner">
      <ion-spinner name="crescent" color="dark" />
    </span>

    <span v-else class="item3-index">{{ paddedIndex }}</span>

    <span class="item3-arrow">&#8250;</span>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner } from "@ionic/vue"
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { menuController } from "@ionic/vue"

interface Props {
  targetRoute?: string
  targetRouteName?: string
  activeRoutes: string[]
  label: string
  index: number
  disabled?: boolean
  loading?: boolean
  closeMenuOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  targetRoute: undefined,
  targetRouteName: undefined,
  disabled: false,
  loading: false,
  closeMenuOnClick: true,
})

const emit = defineEmits<{
  click: []
}>()

const route = useRoute()
const router = useRouter()

const isActive = computed(() => {
  return props.activeRoutes.includes(route.name as string)
})

const paddedIndex = computed(() => {
  return String(props.index).padStart(3, "0")
})

function handleClick() {
  if (props.disabled || props.loading) return

  if (props.targetRoute) {
    router.push(props.targetRoute)
  } else if (props.targetRouteName) {
    router.push({ name: props.targetRouteName })
  }
  emit("click")
  if (props.closeMenuOnClick) {
    menuController.close()
  }
}
</script>

<style scoped>
.menu-item3 {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.2s ease;
  min-height: 48px;
  gap: 0.75rem;
}

.menu-item3:hover {
  background: #f5f5f5;
}

.menu-item3.active {
  background: #f0f0f0;
}

.menu-item3.active .item3-indicator {
  height: 1.25rem;
  background: #1a1a1a;
}

.menu-item3.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.item3-indicator {
  width: 2px;
  height: 0;
  transition: height 0.2s ease;
  flex-shrink: 0;
}

.item3-label {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1a1a1a;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item3-label.is-active {
  font-weight: 700;
}

.item3-spinner {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.item3-index {
  font-family: var(--font-family-mono, "Courier New", Courier, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: #6B7280;
  flex-shrink: 0;
  min-width: 2.5rem;
  text-align: right;
}

.item3-arrow {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.menu-item3:hover .item3-arrow {
  transform: translateX(3px);
}

.menu-item3:active .item3-arrow {
  transform: translateX(5px);
}

.menu-item3:focus-visible {
  outline: 2px solid #111;
  outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
  .menu-item3,
  .item3-arrow {
    transition: none;
  }
}
</style>
