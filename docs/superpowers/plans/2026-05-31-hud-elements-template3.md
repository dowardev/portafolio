# HUD Elements for Template3 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add LED dot indicators, dot grid background, metrics stat bar, and glitch hover effects to the cyberpunk-light Template3 homepage.

**Architecture:** All changes are CSS-only (LED dot, dot grid, glitch hover) plus one new Vue component (MetricsBar3) with mock data. No backend, no new deps.

**Tech Stack:** Vue 3 (Composition API), Ionic 8, CSS custom properties

---

### Task 1: LED Dot + Dot Grid (HomeTemplate3.vue CSS)

**Files:**
- Modify: `frontend/src/templates/HomeTemplate3.vue`

- [ ] **Step 1: Add LED dot animation keyframes**

Add after the scoped `<style>` section, before `.projects-header`:

```css
@keyframes led-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

- [ ] **Step 2: Add LED dot `::before` on section headings**

Replace `.projects-heading` block:

```css
.projects-heading {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.projects-heading::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ion-color-primary, #1a1a1a);
  flex-shrink: 0;
  animation: led-pulse 2s ease-in-out infinite;
}
```

- [ ] **Step 3: Add dot grid background to sections**

Add after `.bp-section` block:

```css
.bp-section {
  position: relative;
}

.bp-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #d4d4d4 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}
```

Add to ensure content stays above grid:

```css
.projects-inner,
.projects-header,
.projects-grid,
.platforms-row {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 4: Verify lint**

Run: `cd frontend && npx oxlint --fix src/templates/HomeTemplate3.vue`
Expected: 0 errors

---

### Task 2: MetricsBar3 Component

**Files:**
- Create: `frontend/src/components/common/MetricsBar3.vue`
- Modify: `frontend/src/templates/HomeTemplate3.vue`

- [ ] **Step 1: Create MetricsBar3.vue**

```vue
<template>
  <div class="metrics-bar">
    <div class="metrics-grid">
      <div v-for="m in metrics" :key="m.label" class="metric-item">
        <span class="metric-label">{{ m.label }}</span>
        <span class="metric-value">{{ m.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const metrics = [
  { label: "PROJECTS", value: "12" },
  { label: "UPTIME", value: "99.8%" },
  { label: "CLIENTS", value: "08" },
  { label: "EXPERIENCE", value: "6yr" },
]
</script>

<style scoped>
.metrics-bar {
  display: flex;
  justify-content: center;
}

.metrics-grid {
  display: flex;
  gap: 1px;
  background: #d4d4d4;
  border: 1px solid #d4d4d4;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 1.25rem;
  background: #fff;
  gap: 0.2rem;
}

.metric-label {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  color: #999;
  text-transform: uppercase;
}

.metric-value {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
}
</style>
```

- [ ] **Step 2: Import and add MetricsBar3 to HomeTemplate3**

Add import:
```ts
import MetricsBar3 from "@/components/common/MetricsBar3.vue"
```

Add after the hero section, before `SectionDivider3`:
```html
<div class="metrics-wrapper">
  <MetricsBar3 />
</div>
```

Add CSS:
```css
.metrics-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 2rem 3rem;
}

@media (max-width: 768px) {
  .metrics-wrapper {
    padding: 0 1rem 2rem;
  }
}
```

- [ ] **Step 3: Verify lint**

Run: `cd frontend && npx oxlint --fix src/components/common/MetricsBar3.vue src/templates/HomeTemplate3.vue`
Expected: 0 errors

---

### Task 3: Glitch Hover on ProjectCard3

**Files:**
- Modify: `frontend/src/components/projects/ProjectCard3.vue`

- [ ] **Step 1: Add glitch hover keyframes and effect**

Add after the scoped `<style>` section (before any media queries):

```css
@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(-1deg); }
  40% { transform: skew(0.5deg); }
  60% { transform: skew(-0.3deg); }
  80% { transform: skew(0.8deg); }
  100% { transform: skew(0deg); }
}

.project-card:hover {
  animation: glitch-skew 0.3s ease-in-out 2;
}
```

Add subtle glitch on badge hover:

```css
.project-badge {
  transition: transform 0.15s ease;
}

.project-card:hover .project-badge {
  transform: translateX(2px);
}
```

- [ ] **Step 2: Verify lint**

Run: `cd frontend && npx oxlint --fix src/components/projects/ProjectCard3.vue`
Expected: 0 errors

---

### Task 4: Final verification

- [ ] **Step 1: Run full frontend lint**

Run: `cd frontend && npx oxlint --fix src/`
Expected: 0 errors

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-05-31-hud-elements-template3-design.md \
  frontend/src/components/common/MetricsBar3.vue \
  frontend/src/components/projects/ProjectCard3.vue \
  frontend/src/templates/HomeTemplate3.vue
git commit -m "feat: add HUD elements to Template3 — LED dot, dot grid, metrics bar, glitch hover"
```

- [ ] **Step 3: Push**

```bash
git push
```
