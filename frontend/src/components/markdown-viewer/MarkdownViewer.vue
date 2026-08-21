<template>
  <div v-for="(block, index) in contentBlocks" :key="index">
    <component :is="block.type" v-bind="block.props" class="no-shadow" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Marked } from "marked";
import { CardAlert, CardCode } from "ionic-extra-components";
import { informationOutline } from "ionicons/icons";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

// Strip the "Nota<br />" prefix if present and render inline code as bold.
const processAlertContent = (text: string): string => {
  const prefix = "Nota<br />";
  if (text.startsWith(prefix)) {
    text = text.slice(prefix.length);
  }
  return text.replace(/`([^`]+)`/g, "<b>$1</b>");
};

// Standalone markdown instance so renderer overrides never leak across parses.
const md = new Marked();

const contentBlocks = computed(() => {
  const blocks: Array<{ type: unknown; props: Record<string, unknown> }> = [];
  let currentHtml: string[] = [];

  const flush = () => {
    const html = currentHtml.join("");
    if (html.trim()) {
      blocks.push({ type: "div", props: { innerHTML: html } });
    }
    currentHtml = [];
  };

  const tokens = md.lexer(props.content);

  tokens.forEach((token: import("marked").Tokens.Generic) => {
    if (token.type === "code") {
      flush();
      blocks.push({
        type: CardCode,
        props: {
          code: token.text,
          border: true,
          color: "primary",
          language: token.lang ?? "",
          prettierFormat: true,
        },
      });
    } else if (token.type === "blockquote") {
      flush();
      const innerHtml = md.parser(token.tokens ?? []);
      blocks.push({
        type: CardAlert,
        props: {
          content: processAlertContent(innerHtml.trim()),
          title: "Nota",
          border: true,
          icon: informationOutline,
          color: "success",
        },
      });
    } else {
      // headings, paragraphs, lists, inline code, links, images, raw html
      currentHtml.push(md.parser([token]));
    }
  });

  flush();

  return blocks;
});
</script>
