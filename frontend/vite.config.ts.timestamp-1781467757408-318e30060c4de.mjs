// vite.config.ts
import legacy from "file:///home/dowardev/Documentos/programacion/portafolio/frontend/node_modules/.pnpm/@vitejs+plugin-legacy@5.4.3_terser@5.46.2_vite@5.4.21_@types+node@25.6.0_terser@5.46.2_/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///home/dowardev/Documentos/programacion/portafolio/frontend/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_@types+node@25.6.0_terser@5.46.2__vue@3.5.33_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///home/dowardev/Documentos/programacion/portafolio/frontend/node_modules/.pnpm/vite@5.4.21_@types+node@25.6.0_terser@5.46.2/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///home/dowardev/Documentos/programacion/portafolio/frontend/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite@5.4.21_@types+node@25.6.0_terser@5.46.2__workbox-build@7.4.1_workbox-window@7.4.1/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/home/dowardev/Documentos/programacion/portafolio/frontend";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Dowar Blog",
        short_name: "Dowar Blog",
        start_url: "/",
        id: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5e6
      }
    }),
    legacy()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@tu-org/sso-client": path.resolve(__vite_injected_original_dirname, "../../sso-client/packages/sso-client/src/index.ts")
    }
  },
  optimizeDeps: {
    exclude: ["@tu-org/sso-client"]
  },
  test: {
    globals: true,
    environment: "jsdom"
  },
  esbuild: {
    target: "esnext",
    supported: {
      "top-level-await": true
    }
  },
  build: {
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kb3dhcmRldi9Eb2N1bWVudG9zL3Byb2dyYW1hY2lvbi9wb3J0YWZvbGlvL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kb3dhcmRldi9Eb2N1bWVudG9zL3Byb2dyYW1hY2lvbi9wb3J0YWZvbGlvL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rvd2FyZGV2L0RvY3VtZW50b3MvcHJvZ3JhbWFjaW9uL3BvcnRhZm9saW8vZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCBsZWdhY3kgZnJvbSBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6IFwicHJvbXB0XCIsXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIkRvd2FyIEJsb2dcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJEb3dhciBCbG9nXCIsXG4gICAgICAgIHN0YXJ0X3VybDogXCIvXCIsXG4gICAgICAgIGlkOiBcIi9cIixcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwicHdhLTE5MngxOTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcInB3YS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJwd2EtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBwdXJwb3NlOiBcImFueSBtYXNrYWJsZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogNTAwMDAwMCwgXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGxlZ2FjeSgpLFxuICBdLFxuIHJlc29sdmU6IHtcbiBhbGlhczoge1xuIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuIFwiQHR1LW9yZy9zc28tY2xpZW50XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vc3NvLWNsaWVudC9wYWNrYWdlcy9zc28tY2xpZW50L3NyYy9pbmRleC50c1wiKSxcbiB9LFxuIH0sXG4gb3B0aW1pemVEZXBzOiB7XG4gZXhjbHVkZTogW1wiQHR1LW9yZy9zc28tY2xpZW50XCJdLFxuIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXG4gICAgc3VwcG9ydGVkOiB7XG4gICAgICBcInRvcC1sZXZlbC1hd2FpdFwiOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiBcImVzbmV4dFwiLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxZQUFZO0FBQ25CLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlO0FBTnhCLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLFdBQVc7QUFBQSxRQUNYLElBQUk7QUFBQSxRQUNKLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsK0JBQStCO0FBQUEsTUFDakM7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDRCxTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsTUFDUCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsc0JBQXNCLEtBQUssUUFBUSxrQ0FBVyxtREFBbUQ7QUFBQSxJQUNqRztBQUFBLEVBQ0E7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNkLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQSxFQUM5QjtBQUFBLEVBQ0MsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxNQUNULG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
