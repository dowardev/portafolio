<template>
  <div v-for="(block, index) in contentBlocks" :key="index">
    <component :is="block.type" v-bind="block.props" class="no-shadow" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardAlert, CardCode } from "ionic-extra-components";
import { informationOutline } from "ionicons/icons";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const processInlineCode = (text: string): string => {
  if (/^`[^`\n]+`$/.test(text)) {
    const content = text.replace(/^`|`$/g, "");
    return `<code class="inline-code">${content}</code>`;
  }
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
};

const escapeHtml = (text: string): string => {
  const htmlElements: string[] = [];
  let processedText = text;

  processedText = processedText.replace(/`([^`]+)`/g, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

  processedText = processedText.replace(/<iframe.*?<\/iframe>/gs, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

  processedText = processedText.replace(
    /<div\s+class="center">\s*<img[^>]+\/>\s*<\/div>/g,
    (match) => {
      htmlElements.push(match);
      return `%%HTML${htmlElements.length - 1}%%`;
    },
  );

  processedText = processedText.replace(/<img[^>]+\/>/g, (match) => {
    htmlElements.push(match);
    return `%%HTML${htmlElements.length - 1}%%`;
  });

  processedText = processedText.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:\s+target="_blank")?>(.*?)<\/a>/g,
    (match) => {
      htmlElements.push(match);
      return `%%HTML${htmlElements.length - 1}%%`;
    },
  );

  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  processedText = processedText.replace(/[&<>"']/g, (m) => map[m]);

  processedText = processedText.replace(/%%HTML(\d+)%%/g, (_, index) => {
    const element = htmlElements[parseInt(index)];
    return element.startsWith("`") ? processInlineCode(element) : element;
  });

  return processedText;
};

const processAlertContent = (text: string): string => {
  // Remove the "Nota<br />" prefix if it exists
  const prefix = "Nota<br />";
  if (text.startsWith(prefix)) {
    text = text.slice(prefix.length);
  }
  return text.replace(/`([^`]+)`/g, "<b>$1</b>");
};

const contentBlocks = computed(() => {
  const blocks = [];
  let currentHtml = "";

  const segments = props.content.split(/(```[\s\S]+?```)/g);

  segments.forEach((segment) => {
    if (segment.startsWith("```")) {
      const match = segment.match(/```(\w*)\n([\s\S]*?)```/);
      if (match) {
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
            code: code.trim(),
            border: true,
            color: "primary",
            language: lang,
            prettierFormat: true,
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
          if (/^\s*-\s+/.test(line)) {
            if (currentHtml.trim()) {
              blocks.push({
                type: "div",
                props: { innerHTML: currentHtml.trim() },
              });
              currentHtml = "";
            }

            let listItems = [];
            while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
              let item = lines[i].replace(/^\s*-\s+/, "").trim();
              item = escapeHtml(item)
                .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
                .replace(/\*(.+?)\*/g, "<i>$1</i>");
              listItems.push(`<li>${item}</li>`);
              i++;
            }
            i--;

            blocks.push({
              type: "div",
              props: { innerHTML: `<ul>${listItems.join("")}</ul>` },
            });
          } else {
            if (/^#{1,6}\s/.test(line)) {
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
            } else if (line.startsWith(">")) {
              if (currentHtml.trim()) {
                blocks.push({
                  type: "div",
                  props: { innerHTML: currentHtml.trim() },
                });
                currentHtml = "";
              }

              let blockquoteContent = line.replace(/^>\s?/, "").trim();

              while (i + 1 < lines.length && lines[i + 1].startsWith(">")) {
                i++;
                blockquoteContent +=
                  "<br />" + lines[i].replace(/^>\s?/, "").trim();
              }

              blocks.push({
                type: CardAlert,
                props: {
                  content: processAlertContent(blockquoteContent),
                  title: "Nota",
                  border: true,
                  icon: informationOutline,
                  color: "success",
                },
              });
            } else {
              let textLine = escapeHtml(line.trim());
              currentHtml += `<p>${textLine}</p>`;
            }
          }
        }
        i++;
      }
    }
  });

  if (currentHtml.trim()) {
    blocks.push({
      type: "div",
      props: { innerHTML: currentHtml.trim() },
    });
  }

  return blocks;
});
</script>
