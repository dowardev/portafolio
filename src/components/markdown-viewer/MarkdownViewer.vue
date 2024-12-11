<template>
  <div v-for="(block, index) in contentBlocks" :key="index">
    <component :is="block.type" v-bind="block.props" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CardCode from "@/components/cards/CardCode.vue";
import CardsAlert from "@/components/cards/CardAlert.vue";
import { informationOutline } from "ionicons/icons";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const escapeHtml = (text: string): string => {
  const htmlElements: string[] = [];
  let processedText = text;

  // Preserve div with class center containing img
  processedText = processedText.replace(
    /<div\s+class="center">\s*<img[^>]+\/>\s*<\/div>/g,
    (match) => {
      htmlElements.push(match);
      return `%%HTML${htmlElements.length - 1}%%`;
    }
  );

  // Preserve individual img tags
  processedText = processedText.replace(/<img[^>]+\/>/g, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

  // Preserve anchor tags
  processedText = processedText.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:\s+target="_blank")?>(.*?)<\/a>/g,
    (match) => {
      htmlElements.push(match);
      return `%%HTML${htmlElements.length - 1}%%`;
    }
  );

  // Escape HTML characters
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  processedText = processedText.replace(/[&<>"']/g, (m) => map[m]);

  // Restore preserved HTML elements
  processedText = processedText.replace(
    /%%HTML(\d+)%%/g,
    (_, index) => htmlElements[parseInt(index)]
  );

  return processedText;
};

const contentBlocks = computed(() => {
  const blocks = [];
  let currentListItems: string[] = [];
  let isOrderedList = false;
  let currentHtml = "";

  // Split content into segments, preserving code blocks
  const segments = props.content.split(/(```[\s\S]+?```)/g);

  segments.forEach((segment) => {
    if (segment.startsWith("```")) {
      // Process code blocks
      const match = segment.match(/```(\w*)\n([\s\S]*?)```/);
      if (match) {
        // Flush any pending HTML
        if (currentHtml.trim()) {
          blocks.push({
            type: "div",
            props: { innerHTML: currentHtml.trim() },
          });
          currentHtml = "";
        }

        const [_, lang, code] = match;
        blocks.push({
          type: CardCode,
          props: {
            cardContent: code.trim(),
            cardTitle: lang || "Code",
            border: false,
          },
        });
      }
    } else if (segment.trim()) {
      let processedSegment = segment;

      // Remove HTML comments
      processedSegment = processedSegment.replace(/<!--[\s\S]*?-->/g, "");

      // Process blockquotes
      const blockquoteRegex = /^(?:\>\s+.*(?:\n|$))+/gm;
      let blockquoteMatch;
      while (
        (blockquoteMatch = blockquoteRegex.exec(processedSegment)) !== null
      ) {
        // Flush any pending HTML
        if (currentHtml.trim()) {
          blocks.push({
            type: "div",
            props: { innerHTML: currentHtml.trim() },
          });
          currentHtml = "";
        }

        const blockquoteContent = blockquoteMatch[0]
          .split("\n")
          .map((line) => line.replace(/^>\s?/, "").trim())
          .join("<br />");

        blocks.push({
          type: CardsAlert,
          props: {
            cardContent: blockquoteContent,
            cardTitle: "Nota",
            border: false,
            icon: informationOutline,
            color: "success",
          },
        });

        processedSegment = processedSegment.replace(blockquoteMatch[0], "");
      }

      // Process remaining lines
      const lines = processedSegment.split("\n");

      lines.forEach((line) => {
        if (line.trim()) {
          // Process headers
          if (/^#{1,6}\s/.test(line)) {
            // Flush any pending lists
            if (currentListItems.length > 0) {
              currentHtml += isOrderedList
                ? `<ol>${currentListItems.join("")}</ol>`
                : `<ul>${currentListItems.join("")}</ul>`;
              currentListItems = [];
              isOrderedList = false;
            }

            const levelMatch = line.match(/^#{1,6}/);
            const level = levelMatch ? levelMatch[0].length : 1;
            let content = line.replace(/^#{1,6}\s/, "");

            content = escapeHtml(content);
            content = content
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");

            currentHtml += `<h${level}>${content}</h${level}>`;
          }
          // Process ordered lists
          else if (/^\d+\.\s+/.test(line)) {
            if (!isOrderedList) {
              if (currentListItems.length > 0) {
                currentHtml += `<ul>${currentListItems.join("")}</ul>`;
                currentListItems = [];
              }
              isOrderedList = true;
            }
            let item = line.replace(/^\d+\.\s+/, "").trim();
            item = escapeHtml(item);
            item = item
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");
            currentListItems.push(`<li>${item}</li>`);
          }
          // Process unordered lists
          else if (/^\s*-\s+/.test(line)) {
            if (isOrderedList) {
              if (currentListItems.length > 0) {
                currentHtml += `<ol>${currentListItems.join("")}</ol>`;
                currentListItems = [];
              }
              isOrderedList = false;
            }
            let item = line.replace(/^\s*-\s+/, "").trim();
            item = escapeHtml(item);
            item = item
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");
            currentListItems.push(`<li>${item}</li>`);
          }
          // Process normal text
          else {
            // Flush any pending lists
            if (currentListItems.length > 0) {
              currentHtml += isOrderedList
                ? `<ol>${currentListItems.join("")}</ol>`
                : `<ul>${currentListItems.join("")}</ul>`;
              currentListItems = [];
              isOrderedList = false;
            }

            let textLine = line.trim();
            textLine = escapeHtml(textLine);
            textLine = textLine.replace(/`([^`]+)`/g, "<code>$1</code>");
            textLine = textLine
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");
            textLine = textLine.replace(
              /\[(.*?)\]\((.*?)\)/g,
              '<a href="$2">$1</a>'
            );

            currentHtml += `<p>${textLine}</p>`;
          }
        }
      });
    }
  });

  // Flush any remaining content
  if (currentListItems.length > 0) {
    currentHtml += isOrderedList
      ? `<ol>${currentListItems.join("")}</ol>`
      : `<ul>${currentListItems.join("")}</ul>`;
  }

  if (currentHtml.trim()) {
    blocks.push({
      type: "div",
      props: { innerHTML: currentHtml.trim() },
    });
  }

  return blocks;
});
</script>

<style scoped>
:deep(img) {
  max-width: 100%;
  height: auto;
}

:deep(.center) {
  text-align: center;
  margin: 1rem 0;
}

:deep(blockquote) {
  border-left: 4px solid var(--ion-color-medium);
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: var(--ion-color-light);
}
</style>
