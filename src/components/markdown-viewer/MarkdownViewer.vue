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
