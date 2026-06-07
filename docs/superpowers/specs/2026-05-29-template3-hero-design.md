# Template3 — Hero Section Design

## Scope
Diseño e implementación del Template3 para la página de inicio del portafolio. Este spec documenta únicamente la sección **Hero**, a partir de la referencia visual "Ben Mills" style. Secciónes adicionales (About, Proyectos, etc.) se definirán en iteraciones posteriores con nuevas imágenes de referencia.

## Architecture

### Files
- `frontend/src/templates/HomeTemplate3.vue` — Template principal que integra todas las secciones
- `frontend/src/views/presentation/sections/HeroSection3.vue` — Componente del Hero (extraído para reutilización/claridad)
- `frontend/src/views/presentation/HomePresentationPage.vue` — Página entry-point (se modifica para usar HomeTemplate3 en vez de HomeTemplate2)

### Data Flow
HeroSection3 recibe props desde HomeTemplate3 (introData, photoUrl, etc.) mediante controllers (IntroController), siguiendo el patrón existente de HomeTemplate2.

No se requiere store nuevo — se reutiliza `introController` existente.

## Hero Section Design

### Layout
```
┌─────────────────────────────────────┐
│ [Nombre]          [ABOUT] [RÉSUMÉ]  │ ← Fixed header, transparent
│                                     │
│                                     │
│          Hi, I'm [Name].            │
│          I'm a [profession].        │ ← Título centrado, bold
│                                     │
│                                     │
│  [E-COMM REDESIGN] [UI SNAPSHOTS]  │ ← Links inferiores
└─────────────────────────────────────┘
```

### Header
- Posición fixed, top: 0
- Background: transparent
- Padding: 2rem 3rem (desktop), 1rem 1.5rem (mobile)
- Flex: space-between
- Logo: texto en dos pesos (regular + bold)
- Nav: 2 links en uppercase, letter-spacing, font-size ~0.75rem

### Hero Content
- Full viewport height (min-height: 100dvh)
- Flex column, centrado
- Título: font-size 3.5rem (desktop), 2rem (mobile), weight 700, color #111
- Sin foto de perfil ni avatares — enfoque puramente tipográfico
- Sin typing animation — texto estático directo

### Bottom Links
- Posición absoluta/relativa en la parte inferior del hero
- 2 links: "E-COMM REDESIGN CASE STUDY" y "UI SNAPSHOTS" (o equivalentes del portafolio)
- Uppercase, letter-spacing, font-size ~0.7rem
- En mobile: apilar en columna o reducir tamaño

### Responsive Breakpoints
- Desktop (>= 768px): título 3.5rem, header padding 2rem 3rem
- Mobile (< 768px): título 2rem, header padding 1rem 1.5rem, bottom links columna

### Color Scheme
- Background: white (#ffffff)
- Texto principal: near-black (#111111)
- Texto nav/links: dark gray (#333333)
- Sin colores primarios del tema Ionic — diseño monocromático limpio

## Implementation Approach

### Component: HeroSection3.vue
```vue
<template>
  <section class="hero-section">
    <header class="hero-header">
      <div class="logo">
        <span class="logo-regular">{{ firstName }}</span>
        <span class="logo-bold">{{ lastName }}</span>
      </div>
      <nav class="hero-nav">
        <a href="#about">ABOUT</a>
        <a href="#resume">RÉSUMÉ</a>
      </nav>
    </header>

    <div class="hero-content">
      <h1 class="hero-title">Hi, I'm {{ fullName }}. I'm a {{ profession }}.</h1>
    </div>

    <div class="hero-links">
      <a v-for="link in links" :key="link.href" :href="link.href">
        {{ link.label }}
      </a>
    </div>
  </section>
</template>
```

Props:
- `firstName: string`
- `lastName: string`
- `profession: string`
- `links?: Array<{ label: string; href: string }>`

### Template: HomeTemplate3.vue
- Contenedor principal `<ion-page>` → `<ion-content>` → `<HeroSection3 />`
- Carga datos con IntroController (mismo patrón que HomeTemplate2)
- Por ahora solo contiene la sección Hero. Nuevas secciones se añadirán en futuras iteraciones.

## Implementation Order
1. Crear `HeroSection3.vue`
2. Crear `HomeTemplate3.vue`
3. Actualizar `HomePresentationPage.vue` para usar `HomeTemplate3`
4. Verificar responsive

## Anti-Patterns to Avoid
- No usar emojis como iconos
- No usar animaciones excesivas (tipografía estática)
- No depender de colores del tema Ionic — estilo monocromático autónomo
- No incluir avatar/foto en el hero
