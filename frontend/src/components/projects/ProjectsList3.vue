<template>
  <div class="project-list">
    <template v-if="rating != null">
      <span class="list-source">{{ source }}</span>
      <strong class="list-name">{{ name }}</strong>
      <p class="list-desc">{{ description }}</p>
      <div class="list-stars">
        <ion-icon v-for="n in rating" :key="'f' + n" :icon="star" class="star-filled" />
        <ion-icon v-for="n in (5 - rating)" :key="'e' + n" :icon="starOutline" class="star-empty" />
      </div>
      <a :href="url || '#'" class="list-arrow">&rarr;</a>
    </template>

    <template v-else-if="startDate">
      <span class="list-source">{{ source }} &middot; {{ dateRange }}</span>
      <strong class="list-name">{{ name }}</strong>
      <p class="list-desc">{{ description }}</p>
      <div class="list-techs">
        <span v-for="t in technologies" :key="t.name" class="list-tech">{{ t.name }}</span>
      </div>
      <a :href="url || '#'" class="list-arrow">&rarr;</a>
    </template>

    <template v-else>
      <span class="list-source">{{ source }}</span>
      <strong class="list-name">{{ name }}</strong>
      <p class="list-desc">{{ description }}</p>
      <div class="list-techs">
        <span v-for="t in technologies" :key="t.name" class="list-tech">{{ t.name }}</span>
      </div>
      <a :href="url || '#'" class="list-arrow">&rarr;</a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IonIcon } from "@ionic/vue"
import { star, starOutline } from "ionicons/icons"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"

interface Technology {
  iconName: string
  name: string
}

interface ProjectsList3Props {
  source: string
  name: string
  iconName?: string
  description: string
  url?: string
  technologies?: Technology[]
  startDate?: string
  endDate?: string
  rating?: number
}

const props = defineProps<ProjectsList3Props>()

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s

const dateRange = computed(() => {
  if (!props.startDate) return ""

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
.project-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff;
}

.list-source {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.5rem;
  font-weight: 600;
  color: #999;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-shrink: 0;
  width: 80px;
}

.list-name {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: #111;
  flex-shrink: 0;
  width: 150px;
}

.list-desc {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.7rem;
  color: #888;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-techs {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}

.list-tech {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.5rem;
  color: #aaa;
  border: 1px solid #d4d4d4;
  padding: 0.1rem 0.35rem;
  letter-spacing: 0.04em;
}

.list-stars {
  display: flex;
  gap: 0.15rem;
  flex-shrink: 0;
}

.star-filled {
  font-size: 0.8rem;
  color: var(--ion-color-primary);
}

.star-empty {
  font-size: 0.8rem;
  color: #d4d4d4;
}

.list-arrow {
  font-size: 1.1rem;
  color: #333;
  text-decoration: none;
  flex-shrink: 0;
  width: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .project-list {
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.6rem 0.75rem;
  }

  .list-source,
  .list-name {
    width: auto;
  }

  .list-desc {
    white-space: normal;
    width: 100%;
  }

  .list-techs {
    flex-wrap: wrap;
  }

  .list-arrow {
    font-size: 1rem;
    width: 24px;
  }
}
</style>
