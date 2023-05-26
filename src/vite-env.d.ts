/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "vue3-markdown-it";
declare module "vue3-mq";

declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const component: ComponentOptions;
  export default component;
}
