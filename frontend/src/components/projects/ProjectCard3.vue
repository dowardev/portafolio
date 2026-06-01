<template>
  <div class="project-card">
    <div class="card-number">// {{ formattedIndex }}</div>

    <template v-if="rating != null">
      <div class="card-content">
        <div class="card-source">{{ source }}</div>
        <div class="card-name">{{ name }}</div>
        <p class="card-desc">{{ description }}</p>
        <div class="card-footer">
          <div class="stars-inline" aria-hidden="true">
            <ion-icon
              v-for="n in rating"
              :key="'f' + n"
              :icon="starIcon"
              class="star-filled"
            />
            <ion-icon
              v-for="n in (5 - rating)"
              :key="'e' + n"
              :icon="starOutlineIcon"
              class="star-empty"
            />
          </div>
          <a :href="url" target="_blank" class="card-arrow" rel="noopener noreferrer" aria-label="Ver proyecto">
            <ion-icon :icon="arrowForward" />
          </a>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="card-content">
        <div class="card-source">{{ source }}</div>
        <div class="card-name">{{ name }}</div>
        <p class="card-desc">{{ description }}</p>
        <div v-if="dateText" class="card-dates">{{ dateText }}</div>
        <div class="card-footer">
          <div class="tags-inline">
            <span v-for="tech in technologies" :key="tech.name" class="card-tag">
              {{ tech.name }}
            </span>
          </div>
          <a :href="url" target="_blank" class="card-arrow" rel="noopener noreferrer" aria-label="Ver proyecto">
            <ion-icon :icon="arrowForward" />
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IonIcon } from "@ionic/vue"
import { arrowForward, star, starOutline } from "ionicons/icons"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"

interface Technology {
  name: string
}

interface ProjectCard3Props {
  source: string
  name: string
  description: string
  url: string
  technologies: Technology[]
  startDate?: string
  endDate?: string
  rating?: number
  index: number
}

const props = defineProps<ProjectCard3Props>()

const starIcon = computed(() => star)
const starOutlineIcon = computed(() => starOutline)

const formattedIndex = computed(() => {
  return String(props.index).padStart(2, '0')
})

const dateText = computed(() => {
  if (!props.startDate) return ''

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s

  const startDate = parseISO(props.startDate)
  const startFormatted = isValid(startDate)
    ? capitalize(format(startDate, "MMM yyyy", { locale: es }))
    : props.startDate

  if (!props.endDate) {
    return `${startFormatted} - Actual`
  }

  const endDate = parseISO(props.endDate)
  const endFormatted = isValid(endDate)
    ? capitalize(format(endDate, "MMM yyyy", { locale: es }))
    : props.endDate

  return `${startFormatted} - ${endFormatted}`
})
</script>

<style scoped>
.project-card {
  position: relative;
  background: #fff;
  border: 1px solid #d0d5dd;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  min-height: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.project-card::before {
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

.project-card:hover::before {
  transform: translate(-6px, -6px);
}

.project-card::after {
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

.project-card:hover::after {
  transform: translate(6px, 6px);
}

.card-number {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.75rem;
  font-weight: 700;
  color: #0097a7;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-source {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.7rem;
  font-weight: 600;
  color: #5a5a5a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.card-name {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
  line-height: 1.3;
  margin-bottom: 0.35rem;
}

.card-desc {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.85rem;
  color: #4a4a4a;
  margin: 0 0 0.5rem;
  line-height: 1.6;
  flex: 1;
}

.card-dates {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.65rem;
  color: #6b6b6b;
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
}

.tags-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.card-tag {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.65rem;
  color: #555;
  background: #e8e8e8;
  padding: 0.2rem 0.5rem;
  letter-spacing: 0.02em;
}

.stars-inline {
  display: flex;
  gap: 0.2rem;
}

.star-filled {
  font-size: 0.85rem;
  color: #111;
}

.star-empty {
  font-size: 0.85rem;
  color: #bbb;
}

.card-arrow {
  flex-shrink: 0;
  font-size: 1.2rem;
  color: #555;
  text-decoration: none;
  line-height: 1;
  transition: color 0.2s ease;
}

.card-arrow:hover {
  color: #111;
}

@media (max-width: 768px) {
  .project-card {
    padding: 1rem;
  }

  .card-number {
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
  }

  .card-name {
    font-size: 0.95rem;
  }

  .card-desc {
    font-size: 0.8rem;
  }

  .card-tag {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
  }
}
</style>
