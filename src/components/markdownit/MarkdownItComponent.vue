<template>
  <Markdown :source="source" :html="true" :linkify="true" :breaks="true" />
</template>

<script setup lang="ts">
import Markdown from "vue3-markdown-it";

const props = defineProps({
  source: {
    type: String,
    default: "",
  },
});
</script>

<style>
blockquote {
  border-left: 4px solid var(--ion-color-primary);
  display: flex;
  justify-content: center;
}
blockquote > p {
  margin: 16px;
}
.hljs {
  font-size: 1.2rem !important;
}
code {
  background: #282c34;
  padding: 5px;
  border-radius: 3px;
  font-size: 0.8rem !important;
  color: #969ca9;
}
</style>
