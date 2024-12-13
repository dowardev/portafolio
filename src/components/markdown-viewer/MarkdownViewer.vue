<template>
  <div v-for="(block, index) in contentBlocks" :key="index">
    <component :is="block.type" v-bind="block.props" />
  </div>
</template>

<script setup lang="ts">
// funciona 3
import { computed } from "vue";
import CardCode from "@/components/cards/CardCode.vue";
import CardsAlert from "@/components/cards/CardAlert.vue";
import { informationOutline, language } from "ionicons/icons";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const processInlineCode = (text: string): string => {
  // Process single word code blocks first
  if (/^`[^`\n]+`$/.test(text)) {
    const content = text.replace(/^`|`$/g, "");
    return `<code class="inline-code">${content}</code>`;
  }
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
};

const escapeHtml = (text: string): string => {
  const htmlElements: string[] = [];
  let processedText = text;

  // Preserve inline code blocks first
  processedText = processedText.replace(/`([^`]+)`/g, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

  // Preserve iframe tags
  processedText = processedText.replace(/<iframe.*?<\/iframe>/gs, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

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

  // Restore preserved HTML elements and process inline code
  processedText = processedText.replace(/%%HTML(\d+)%%/g, (_, index) => {
    const element = htmlElements[parseInt(index)];
    return element.startsWith("`") ? processInlineCode(element) : element;
  });

  return processedText;
};

const contentBlocks = computed(() => {
  const blocks = [];
  let currentListItems = [];
  let currentHtml = "";

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
            language: lang,
          },
        });
      }
    } else if (segment.trim()) {
      let processedSegment = segment;
      let lines = processedSegment.split("\n");
      let i = 0;

      while (i < lines.length) {
        const line = lines[i].trim();

        if (line) {
          // Process unordered lists
          if (/^\s*-\s+/.test(line)) {
            // Flush any pending content
            if (currentHtml.trim()) {
              blocks.push({
                type: "div",
                props: { innerHTML: currentHtml.trim() },
              });
              currentHtml = "";
            }

            // Start collecting list items
            let listItems = [];
            while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
              let item = lines[i].replace(/^\s*-\s+/, "").trim();
              // Process bold and italics within list item
              item = escapeHtml(item)
                .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
                .replace(/\*(.+?)\*/g, "<i>$1</i>");
              listItems.push(`<li>${item}</li>`);
              i++;
            }
            i--; // Adjust for outer loop increment

            blocks.push({
              type: "div",
              props: { innerHTML: `<ul>${listItems.join("")}</ul>` },
            });
          } else {
            // Process headers
            if (/^#{1,6}\s/.test(line)) {
              // Flush pending content
              if (currentHtml.trim()) {
                blocks.push({
                  type: "div",
                  props: { innerHTML: currentHtml.trim() },
                });
                currentHtml = "";
              }

              const levelMatch = line.match(/^#{1,6}/);
              const level = levelMatch ? levelMatch[0].length : 1;
              let content = line.replace(/^#{1,6}\s/, "");
              content = escapeHtml(content);

              blocks.push({
                type: "div",
                props: { innerHTML: `<h${level}>${content}</h${level}>` },
              });
            }
            // Process blockquotes
            else if (line.startsWith(">")) {
              // Flush pending content
              if (currentHtml.trim()) {
                blocks.push({
                  type: "div",
                  props: { innerHTML: currentHtml.trim() },
                });
                currentHtml = "";
              }

              let blockquoteContent = line.replace(/^>\s?/, "").trim();

              // Collect all consecutive blockquote lines
              while (i + 1 < lines.length && lines[i + 1].startsWith(">")) {
                i++;
                blockquoteContent +=
                  "<br />" + lines[i].replace(/^>\s?/, "").trim();
              }

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
            }
            // Process normal text
            else {
              let textLine = escapeHtml(line.trim());
              currentHtml += `<p>${textLine}</p>`;
            }
          }
        }
        i++;
      }
    }
  });

  // Flush remaining content
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

:deep(code) {
  background: var(--ion-color-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

:deep(code[class*="language-"]) {
  color: var(--ion-color-primary);
  background: var(--ion-color-light);
}

:deep(.inline-code) {
  background: var(--ion-color-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  color: var(--ion-color-primary);
}
</style>
