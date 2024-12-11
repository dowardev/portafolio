<template>
  <div v-for="(block, index) in contentBlocks" :key="index">
    <component :is="block.type" v-bind="block.props" />
  </div>
</template>

<script setup lang="ts">
// funciona 9
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

// Update the escapeHtml function to preserve anchor tags and images
const escapeHtml = (text: string): string => {
  // Store HTML elements temporarily
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

  // Escape HTML
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  processedText = processedText.replace(/[&<>"']/g, (m) => map[m]);

  // Restore HTML elements
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

  // Dividir el contenido en segmentos, manteniendo los bloques de código
  const segments = props.content.split(/(```[\s\S]+?```)/g);

  segments.forEach((segment) => {
    if (segment.startsWith("```")) {
      // Procesar bloque de código
      const match = segment.match(/```(\w*)\n([\s\S]*?)```/);
      if (match) {
        const [_, lang, code] = match;
        blocks.push({
          type: CardCode,
          props: {
            cardContent: code.trim(), // Solo el contenido del código
            cardTitle: lang || "Code",
            border: false,
          },
        });
      }
    } else if (segment.trim()) {
      let processedSegment = segment;

      // Remove HTML comments before any other processing
      processedSegment = processedSegment.replace(/<!--[\s\S]*?-->/g, "");

      // Procesar blockquotes
      const blockquoteRegex = /^(?:\>\s+.*(?:\n|$))+/gm;
      let blockquoteMatch;
      while (
        (blockquoteMatch = blockquoteRegex.exec(processedSegment)) !== null
      ) {
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
        // Remover el blockquote procesado del segmento
        processedSegment = processedSegment.replace(blockquoteMatch[0], "");
      }

      // Procesar líneas restantes
      const lines = processedSegment.split("\n");
      let html = "";

      lines.forEach((line) => {
        if (line.trim()) {
          // Procesar encabezados
          if (/^#{1,6}\s/.test(line)) {
            const levelMatch = line.match(/^#{1,6}/);
            const level = levelMatch ? levelMatch[0].length : 1;
            let content = line.replace(/^#{1,6}\s/, "");

            // Procesar negritas y cursivas
            content = escapeHtml(content);
            content = content
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");

            html += `<h${level}>${content}</h${level}>`;
          }
          // Procesar listas ordenadas
          else if (/^\d+\.\s+/.test(line)) {
            if (!isOrderedList) {
              if (currentListItems.length > 0) {
                html += `<ul>${currentListItems.join("")}</ul>`;
                currentListItems = [];
              }
              isOrderedList = true;
            }
            let item = line.replace(/^\d+\.\s+/, "").trim();

            // Procesar negritas y cursivas
            item = escapeHtml(item);
            item = item
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");

            currentListItems.push(`<li>${item}</li>`);
          }
          // Procesar listas no ordenadas
          else if (/^\s*-\s+/.test(line)) {
            if (isOrderedList) {
              if (currentListItems.length > 0) {
                html += `<ol>${currentListItems.join("")}</ol>`;
                currentListItems = [];
              }
              isOrderedList = false;
            }
            let item = line.replace(/^\s*-\s+/, "").trim();

            // Procesar negritas y cursivas
            item = escapeHtml(item);
            item = item
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");

            currentListItems.push(`<li>${item}</li>`);
          }
          // Procesar texto normal
          else {
            // Finalizar cualquier lista abierta
            if (currentListItems.length > 0) {
              html += isOrderedList
                ? `<ol>${currentListItems.join("")}</ol>`
                : `<ul>${currentListItems.join("")}</ul>`;
              currentListItems = [];
              isOrderedList = false;
            }

            let textLine = line.trim();

            // First escape HTML characters
            textLine = escapeHtml(textLine);

            // Then process inline code blocks, but keep <code> tags unescaped
            textLine = textLine.replace(/`([^`]+)`/g, (_, code) => {
              return `<code>${code}</code>`;
            });

            // Process bold and italics
            textLine = textLine
              .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
              .replace(/\*(.+?)\*/g, "<i>$1</i>");

            // Process links
            textLine = textLine.replace(
              /\[(.*?)\]\((.*?)\)/g,
              '<a href="$2">$1</a>'
            );

            html += `<p>${textLine}</p>`;
          }
        }
      });

      // Finalizar cualquier lista abierta al final del segmento
      if (currentListItems.length > 0) {
        html += isOrderedList
          ? `<ol>${currentListItems.join("")}</ol>`
          : `<ul>${currentListItems.join("")}</ul>`;
        currentListItems = [];
        isOrderedList = false;
      }

      if (html.trim()) {
        blocks.push({
          type: "div",
          props: { innerHTML: html.trim() },
        });
      }
    }
  });

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
