<template>
  <section class="hero-root">
    <div class="hero-content">
      <h1 class="hero-title">
        Hola, soy <span class="hero-name">{{ name }}</span>
      </h1>

      <div v-if="bottomLinks.length > 0" class="hero-links">
        <a
          v-for="link in linkTags"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="hero-link"
        >
          {{ link.label }}
        </a>
        <span
          v-for="link in textTags"
          :key="link.label"
          class="hero-link hero-link--text"
        >
          {{ link.label }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface NavLink {
  label: string
  href: string | null
}

interface HeroSection3Props {
  name: string
  navLinks?: NavLink[]
}

const props = defineProps<HeroSection3Props>()

const bottomLinks = computed<NavLink[]>(() => {
  if (props.navLinks && props.navLinks.length > 0) {
    return props.navLinks
  }
  return []
})

const linkTags = computed(() => bottomLinks.value.filter((l): l is NavLink & { href: string } => !!l.href))
const textTags = computed(() => bottomLinks.value.filter((l): l is NavLink & { href: null } => !l.href))
</script>

<style scoped>
.hero-root {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem 2rem;
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
  text-wrap: balance;
}

.hero-name {
  font-weight: 700;
  color: #111;
}

.hero-links {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-link {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #444;
  text-decoration: none;
  padding-bottom: 0.25rem;
  border-bottom: 1.5px solid transparent;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.hero-link:hover {
  border-bottom-color: #111;
  color: #111;
}

.hero-link:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.hero-link--text {
  cursor: default;
  border-bottom-color: transparent;
  color: #888;
}

.hero-link--text:hover {
  border-bottom-color: transparent;
  color: #888;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .hero-root {
    padding: 3rem 1.5rem 1.5rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-links {
    gap: 1.5rem;
  }

  .hero-link {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 1.25rem;
  }
}
</style>
