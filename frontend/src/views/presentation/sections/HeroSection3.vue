<template>
  <section class="hero-root">
    <div class="hero-content">
      <h1 class="hero-title">
        Hi, I'm <span class="hero-name">{{ name }}</span>. I'm a
        <span class="role-wrapper" :style="{ minWidth: `${maxRoleChars}ch` }">
          <Transition name="role-fade" mode="out-in">
            <span :key="currentRole" class="role-text">{{ currentRole }}</span>
          </Transition>
        </span>.
      </h1>

      <div class="hero-links">
        <a
          v-for="link in bottomLinks"
          :key="link.label"
          :href="link.href"
          class="hero-link"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"

interface HeroSection3Props {
  name: string
  roles: string[]
}

const props = defineProps<HeroSection3Props>()

const activeRoleIndex = ref(0)
let roleInterval: ReturnType<typeof setInterval> | null = null

function advanceRole() {
  activeRoleIndex.value = (activeRoleIndex.value + 1) % props.roles.length
}

onMounted(() => {
  roleInterval = setInterval(advanceRole, 2800)
})

onUnmounted(() => {
  if (roleInterval) clearInterval(roleInterval)
})

const currentRole = computed(() => props.roles[activeRoleIndex.value])

const maxRoleChars = computed(() => {
  return Math.max(...props.roles.map((r: string) => r.length)) + 1
})

const bottomLinks = computed(() => [
  { label: "E-COMM REDESIGN CASE STUDY", href: "#projects" },
  { label: "UI SNAPSHOTS", href: "#snapshots" },
])
</script>

<style scoped>
.hero-root {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 4rem;
  box-sizing: border-box;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 900px;
  width: 100%;
  gap: 3rem;
}

.hero-title {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 4.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-name {
  font-weight: 700;
  color: #111;
}

.role-wrapper {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.role-text {
  display: inline-block;
  white-space: nowrap;
}

.role-fade-enter-active,
.role-fade-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.role-fade-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.role-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.hero-links {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-link {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  text-decoration: none;
  padding-bottom: 0.25rem;
  border-bottom: 1.5px solid transparent;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.hero-link:hover {
  border-bottom-color: #111;
  color: #111;
}

@media (max-width: 768px) {
  .hero-root {
    padding: 5rem 1.5rem 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-links {
    gap: 1.5rem;
  }

  .hero-link {
    font-size: 0.65rem;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 2rem;
  }
}
</style>
