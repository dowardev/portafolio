<template>
  <ion-card
    class="ion-padding card-primary no-shadow"
    :style="{ border: border ? '1px solid var(--ion-color-primary)' : 'none' }"
  >
    <ion-row>
      <ion-col size="6" style="display: flex; align-items: center">
        <div
          style="width: 100%; height: 100%; max-width: 120px; max-height: 48px"
        >
          <ion-icon
            class="icon-primary"
            :icon="codeOutline"
            style="
              border-radius: 50%;
              padding: 8%;
              font-size: 26px;
              color: white;
            "
          ></ion-icon>
        </div>
      </ion-col>

      <ion-col size="6">
        <ion-row>
          <ion-col style="display: flex; justify-content: end">
            <ion-button style="color: black" fill="clear" @click="copyContent">
              <ion-icon :icon="copyOutline"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="12">
        <ion-row v-if="cardTitle">
          <!-- <ion-col>
            <h1 style="font-size: 20px">
              {{ cardTitle.toUpperCase() }}
            </h1>
            <h2
              v-if="cardSubtitle"
              style="
                font-size: 20px;
                color: rgba(var(--ion-text-color-rgb), 80%);
              "
            >
              {{ cardSubtitle }}
            </h2>
          </ion-col> -->
        </ion-row>

        <ion-row>
          <ion-col>
            <pre><code id="codeContent" ref="codeBlock" :class="languageClass">{{ cardContent }}</code></pre>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-card>
</template>

<script setup lang="ts">
import { codeOutline, copyOutline } from "ionicons/icons";
import { computed, onMounted, onUpdated } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { ref } from "vue";

type Colors = "success" | "danger" | "primary";

const props = defineProps({
  cardTitle: {
    type: String,
    required: false,
  },
  cardSubtitle: {
    type: String,
    required: false,
  },
  cardContent: {
    type: String,
    required: true,
  },
  color: {
    type: String as () => Colors,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    required: true,
    default: "",
  },
});
const codeBlock = ref<HTMLElement | null>(null);

// computed
const languageClass = computed(() => {
  return props.language ? `language-${props.language}` : "";
});

onMounted(() => {
  if (codeBlock.value) {
    if (props.language) {
      hljs.highlightElement(codeBlock.value);
    } else {
      const text = codeBlock.value.textContent || "";
      const result = hljs.highlightAuto(text);
      codeBlock.value.innerHTML = result.value;
    }
  }
});

onUpdated(() => {
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value);
  }
});

// functions
function copyContent() {
  if (codeBlock.value) {
    const content = codeBlock.value.textContent || "";
    navigator.clipboard
      .writeText(content)
      .then(() => console.log("Content copied!"))
      .catch((err) => console.error("Failed to copy content: ", err));
  }
}
</script>

<style>
.card-success {
  background: var(--ion-color-secondary-background-hover);
}

.card-danger {
  background: var(--ion-color-danger-background-hover);
}

.card-primary {
  background: var(--ion-color-primary-background-hover);
}

.icon-success {
  background: var(--ion-color-success);
}

.icon-danger {
  background: var(--ion-color-danger);
}

.icon-primary {
  background: var(--ion-color-primary);
}

pre {
  padding: 1em;
  border-radius: 5px;
  box-shadow: none !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  margin: 0;
  background: transparent !important;
}

code {
  font-family: "Fira Code", monospace;
  color: var(--ion-color-dark);
  background: transparent !important;
}

.hljs {
  background: transparent !important;
}
</style>
