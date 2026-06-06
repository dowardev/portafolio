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
