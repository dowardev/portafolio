<template>
  <div class="project-card">
    <div class="project-badge">{{ badgeText }}</div>

      <!-- Modo comentario -->
    <template v-if="rating != null">
      <div class="project-main project-main--comment">
        <div class="project-visual comment-visual">
          <div class="project-icon-wrapper">
            <ion-icon :icon="projectIcon" class="project-icon" />
          </div>
          <span class="project-name">{{ name }}</span>
        </div>
        <p class="comment-text">{{ description }}</p>
      </div>

      <div class="tech-grid tech-grid--stars">
        <div class="stars-item">
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

        <a
          :href="url"
          target="_blank"
          class="project-link"
          rel="noopener noreferrer"
        >
          <ion-icon :icon="arrowForward" />
        </a>
      </div>
    </template>

    <!-- Modo proyecto -->
    <template v-else>
      <div class="project-main">
        <div class="project-visual">
          <div class="project-icon-wrapper">
            <ion-icon :icon="projectIcon" class="project-icon" />
          </div>
          <span class="project-name">{{ name }}</span>
        </div>
        <p class="project-description">{{ description }}</p>
      </div>

      <div class="tech-grid">
        <div
          v-for="tech in technologies"
          :key="tech.name"
          class="tech-item"
        >
          <ion-icon :icon="getIcon(tech.iconName)" class="tech-icon" />
          <span class="tech-label">{{ tech.name }}</span>
        </div>

        <a
          :href="url"
          target="_blank"
          class="project-link"
          rel="noopener noreferrer"
        >
          <ion-icon :icon="arrowForward" />
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IonIcon } from "@ionic/vue"
import { arrowForward, chatbubblesOutline, star, starOutline } from "ionicons/icons"
import { getIconByName } from "@/composables/iconsIndex"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"

interface Technology {
  iconName: string
  name: string
}

interface ProjectCard3Props {
  source: string
  name: string
  iconName: string
  description: string
  url: string
  technologies: Technology[]
  startDate?: string
  endDate?: string
  rating?: number
}

const props = defineProps<ProjectCard3Props>()

const starIcon = computed(() => star)
const starOutlineIcon = computed(() => starOutline)

const projectIcon = computed(() => {
  if (props.rating != null) return chatbubblesOutline
  const found = getIconByName(props.iconName)
  return found?.icon || arrowForward
})

const badgeText = computed(() => {
  if (!props.startDate) return props.source

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : s

  let dateRange: string

  const startDate = parseISO(props.startDate)
  const startFormatted = isValid(startDate)
    ? capitalize(format(startDate, "MMM yyyy", { locale: es }))
    : props.startDate

  if (!props.endDate) {
    dateRange = `${startFormatted} - Actual`
  } else {
    const endDate = parseISO(props.endDate)
    const endFormatted = isValid(endDate)
      ? capitalize(format(endDate, "MMM yyyy", { locale: es }))
      : props.endDate
    dateRange = `${startFormatted} - ${endFormatted}`
  }

  return `${props.source} · ${dateRange}`
})

function getIcon(iconName: string) {
  const found = getIconByName(iconName)
  return found?.icon || arrowForward
}
</script>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  aspect-ratio: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 0;
}

.project-badge {
  flex-shrink: 0;
  align-self: flex-start;
  background: #111;
  color: #fff;
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
  border-radius: 0;
  line-height: 1.2;
  transition: transform 0.15s ease;
}

.project-card:hover .project-badge {
  transform: translateX(2px);
}

.project-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  position: relative;
}

.project-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.25s ease;
}

.project-description {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.8rem;
  line-height: 1.6;
  color: #555;
  text-align: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.project-main:hover .project-visual {
  opacity: 0;
}

.project-main--comment:hover .project-visual {
  opacity: 1;
}

.project-main:hover .project-description {
  opacity: 1;
}

.comment-text {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.8rem;
  line-height: 1.6;
  color: #555;
  text-align: center;
  margin: 0.75rem 0 0;
  padding: 0;
}

.project-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-icon {
  font-size: 1.6rem;
  color: #333;
}

.project-name {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 1.15rem;
  font-weight: 700;
  color: #111;
  text-align: center;
  line-height: 1.3;
}

.tech-grid {
  flex-shrink: 0;
  display: flex;
  border-top: 1px solid #e5e5e5;
}

.tech-grid--stars {
  display: flex;
}

.tech-grid--stars .stars-item {
  flex: 1;
  border-right: none;
}

.tech-grid--stars .project-link {
  flex: 0 0 60px;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex: 1 1 0;
  padding: 0.5rem;
  border-left: 1px solid #e5e5e5;
}

.tech-item:first-child {
  border-left: none;
}

.tech-icon {
  font-size: 1.1rem;
  color: #444;
}

.tech-label {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.55rem;
  font-weight: 500;
  color: #777;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.project-link {
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #e5e5e5;
  color: #333;
  text-decoration: none;
  font-size: 1.6rem;
  transition: background 0.25s ease, color 0.25s ease;
}

.project-link:hover {
  background: #111;
  color: #fff;
}

.stars-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: fit-content;
  padding: 0.5rem;
  border-right: 1px solid #e5e5e5;
}

.star-filled {
  font-size: 1rem;
  color: var(--ion-color-primary);
}

.star-empty {
  font-size: 1rem;
  color: #d4d4d4;
}

@keyframes ht3-glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(-1deg); }
  40% { transform: skew(0.5deg); }
  60% { transform: skew(-0.3deg); }
  80% { transform: skew(0.8deg); }
  100% { transform: skew(0deg); }
}

.project-card:hover {
  animation: ht3-glitch-skew 0.3s ease-in-out 2;
}

@media (max-width: 768px) {
  .project-badge {
    font-size: 0.5rem;
    padding: 0.25rem 0.6rem;
  }

  .project-icon-wrapper {
    width: 44px;
    height: 44px;
  }

  .project-icon {
    font-size: 1.3rem;
  }

  .project-name {
    font-size: 1rem;
  }

  .project-main {
    padding: 0.75rem 1rem;
  }

  .project-description {
    font-size: 0.7rem;
    padding: 1rem;
  }

  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)) 50px;
  }

  .tech-item {
    padding: 0.4rem;
  }

  .tech-icon {
    font-size: 0.95rem;
  }

  .tech-label {
    font-size: 0.5rem;
  }

  .project-link {
    font-size: 1.4rem;
  }
}
</style>
