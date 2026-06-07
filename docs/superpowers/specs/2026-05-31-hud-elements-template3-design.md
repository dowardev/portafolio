# HUD Elements for Template3 (cyberpunk-light)

## Overview
Add sci-fi/HUD visual elements to the Template3 homepage for the cyberpunk-light theme: LED dot indicators, dot grid background, metric stat cards, and glitch hover effects.

## Selected Elements

### 1. LED Dot — Section Title Indicators
- **What:** Small pulsing circle (8px) next to each section heading (`<h2>`)
- **Behavior:** CSS animation pulse (opacity/keyframe), color matches `--ion-color-primary`
- **Implementation:** CSS `::before` pseudo-element on `.projects-heading`
- **Pulse animation:** `@keyframes led-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`

### 2. Dot Grid — Background Pattern
- **What:** Subtle dot grid pattern on section backgrounds
- **Implementation:** `background-image: radial-gradient(circle, #ccc 1px, transparent 1px); background-size: 24px 24px;`
- **Applied to:** `.bp-section` elements, very low opacity/contrast
- **Z-index:** Behind content, above section background

### 3. Metrics — HUD Stat Cards
- **What:** Row of small stat cards below hero section showing key metrics
- **Data (mock):** "PROJECTS: 12", "UPTIME: 99.8%", "CLIENTS: 8"
- **Style:** Monospace label + large number, border, compact layout
- **Implementation:** New `MetricsBar3.vue` component or inline in HomeTemplate3
- **Placement:** Below hero links, inside `#hero` section

### 4. Glitch Hover — Card Interaction
- **What:** Subtle glitch/distortion effect on hover over cards and badges
- **Implementation:** CSS pseudo-elements + transform/translate on hover, or clip-path animation
- **Applied to:** `.project-card:hover`, `.project-badge:hover`

## Files to Modify

| File | Changes |
|------|---------|
| `HomeTemplate3.vue` | Add LED dot CSS, dot grid background, metrics section, glitch hover |
| `HeroSection3.vue` | Add metrics bar below hero links |
| `ProjectCard3.vue` | Add glitch hover effect to cards |
| `cyberpunk-light.css` | Optional: add global HUD variables |

## Non-Goals
- No new npm packages
- No backend changes (mock data)
- No changes to other themes
- No changes to MenuComponent3 or other navigation
