# Cyberpunk Theme + Menú Sci-Fi/HUD

## Scope
Tema light "cyberpunk-light" estilo Nothing Phone (monocromático B&N) + nuevo componente de menú estilo HUD con items numerados. Integración condicionada por tema.

## Archivos creados

- `frontend/src/theme/cyberpunk-light.css` — Tema light monocromático B&N
- `frontend/src/components/menu/MenuItem3.vue` — Item individual con índice numérico (001), label upper, flecha `›`
- `frontend/src/components/menu/MenuComponent3.vue` — Menú HUD completo con todas las secciones (nav, usuario, admin, más opciones colapsable, logout)

## Archivos modificados

- `frontend/src/utils/types.ts` — Agregado `"cyberpunk-light"` a `ConcreteTheme`
- `frontend/src/theme/variables.css` — Import del nuevo tema
- `frontend/src/components/theme/ThemeComponente.vue` — Agregado a `availableThemes`
- `frontend/src/App.vue` — Menú condicional: `MenuComponent3` si `resolvedTheme === "cyberpunk-light"`, `MenuComponent` en otro caso
- `frontend/src/templates/HomeTemplate3.vue` — Botón menú hamburguesa mobile via `ion-menu-button`

## Paleta cyberpunk-light (Nothing Phone)

| Rol | Valor | RGB |
|-----|-------|-----|
| primary | `#1a1a1a` | 26, 26, 26 |
| secondary | `#d4d4d4` | 212, 212, 212 |
| tertiary | `#666666` | 102, 102, 102 |
| success | `#1a1a1a` | 26, 26, 26 |
| warning | `#333333` | 51, 51, 51 |
| danger | `#1a1a1a` | 26, 26, 26 |
| medium | `#999999` | 153, 153, 153 |
| light | `#f5f5f5` | 245, 245, 245 |
| dark | `#1a1a1a` | 26, 26, 26 |
| background | `#ffffff` | 255, 255, 255 |
| text | `#1a1a1a` | 26, 26, 26 |
| background-contrast | `#f5f5f5` | 245, 245, 245 |

## Diseño del menú (MenuItem3)

```
┌─────────────────────────────┐
│ ▌ PRESENTACIÓN     001  ›  │
│ ─────────────────────────── │
│ ▌ BLOG             002  ›  │
│ ─────────────────────────── │
│ ▌ POLÍTICAS        003  ›  │
│                            │
│ ─── USUARIO ─────────────  │  (solo si logged in)
│ ▌ PANEL USUARIO    004  ›  │
│                            │
│ ─── ADMIN ───────────────  │  (solo si admin)
│ ▌ PANEL ADMIN      005  ›  │
│ ─────────────────────────── │
│ ▌ USUARIOS         006  ›  │
│                            │
│ ─────────────────────────── │
│ ▌ MÁS OPCIONES      —  ›  │  (accordion collapsible)
│ ─────────────────────────── │
│   ▌ TEMA            007  › │
│   ▌ CONTRIBUIR      008  › │
│   ▌ CÓDIGO FUENTE   009  › │
│   ▌ COMENTARIOS     010  › │
│   ▌ NOVEDADES       011  › │
│   ▌ MÁS APPS        012  › │
│                            │
│ ─────────────────────────── │
│  ⚡ CERRAR SESIÓN          │  (solo si logged in)
└─────────────────────────────┘
```

## Integración

`App.vue` usa `computed` reactivo que lee `systemStore` y resuelve el tema actual:

```ts
const resolvedTheme = computed(() => {
  const theme = systemStore.getThemeSelected() as Theme
  return systemController.resolveAutoTheme({ theme })
})
```

Template: `MenuComponent3` cuando `resolvedTheme === "cyberpunk-light"`, `MenuComponent` en otro caso.

## Estado

✅ Implementado y verificado con oxlint (0 errores)
