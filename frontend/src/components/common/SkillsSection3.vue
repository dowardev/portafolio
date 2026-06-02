<template>
  <div class="skills-section">
    <div class="skills-grid">
      <div
        v-for="(cat, i) in categories"
        :key="i"
        class="skill-card"
      >
        <div class="card-number">// {{ String(i + 1).padStart(2, '0') }}</div>
        <div class="card-category">{{ cat.name }}</div>
        <div class="card-tags">
          <span
            v-for="skill in cat.skills"
            :key="skill"
            class="card-tag"
          >{{ skill }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SkillsCategory {
  name: string
  skills: string[]
}

interface SkillsSection3Props {
  categories?: SkillsCategory[]
}

const props = defineProps<SkillsSection3Props>()

const categories = props.categories ?? []
</script>

<style scoped>
.skills-section {
  width: 100%;
  max-width: 900px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.skill-card {
  position: relative;
  background: #fff;
  border: 1px solid #d0d5dd;
  padding: 1.25rem;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.skill-card::before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  width: 14px;
  height: 14px;
  border-top: 2px solid #111;
  border-left: 2px solid #111;
  transition: transform 0.25s ease;
}

.skill-card:hover::before {
  transform: translate(-4px, -4px);
}

.skill-card::after {
  content: "";
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 14px;
  height: 14px;
  border-bottom: 2px solid #111;
  border-right: 2px solid #111;
  transition: transform 0.25s ease;
}

.skill-card:hover::after {
  transform: translate(4px, 4px);
}

.card-number {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.75rem;
  font-weight: 700;
  color: #0097a7;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.card-category {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.7rem;
  font-weight: 600;
  color: #5a5a5a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: auto;
}

.card-tag {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.65rem;
  color: #555;
  background: #e8e8e8;
  padding: 0.2rem 0.5rem;
  letter-spacing: 0.02em;
}

.skill-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  justify-self: center;
  max-width: 50%;
}

@media (prefers-reduced-motion: reduce) {
  .skill-card {
    transition: none;
  }

  .skill-card:hover {
    transform: none;
    box-shadow: none;
  }

  .skill-card::before,
  .skill-card::after {
    transition: none;
  }

  .skill-card:hover::before,
  .skill-card:hover::after {
    transform: none;
  }
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-card:last-child:nth-child(odd) {
    max-width: 100%;
  }

  .skill-card {
    padding: 1rem;
  }

  .card-number {
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
  }

  .card-category {
    font-size: 0.6rem;
  }

  .card-tag {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
  }
}
</style>
