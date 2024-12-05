<template>
  <vue-markdown-it :source="props.content" :options="markdownOptions" />
</template>

<script setup lang="ts">
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { VueMarkdownIt } from "@f3ve/vue-markdown-it";

// const
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});
const markdownOptions = {
  html: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return "";
  },
};
</script>

<style>
pre {
  --border-width-card: 8px;
  --background-opacity: 50%;

  width: 100%;
  background: #ddd6d661;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  border-radius: 4px;
  padding: 16px;
}

blockquote {
  --border-width-card: 8px;
  --background-opacity: 50%;

  width: 100%;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  border-radius: 4px;
  padding: 16px;
  margin-left: 0px;
  border-left: var(--border-width-card) solid var(--ion-color-success);
  background: var(--ion-color-secondary-background-hover);
}
</style>
