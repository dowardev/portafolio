<template>
  <ion-card
    class="ion-padding card-primary"
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
          <ion-col>
            <h1 style="font-size: 20px">
              {{ cardTitle }}
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
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <pre><code>{{ cardContent }}</code></pre>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-card>
</template>

<script setup lang="ts">
import { codeOutline, copyOutline } from "ionicons/icons";
import { computed, onMounted } from "vue";

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
});

// const cardClasses = computed(() => [`card-${props.color}`]);
// const iconClasses = computed(() => [`icon-${props.color}`]);
// const borderStyle = computed(() => {
//   return props.border ? `1px solid var(--ion-color-${props.color})` : "none";
// });

// onMounted(() => {
//   console.log(props.cardContent);
// });

// functions
function copyContent() {
  const contentElement = document.getElementById("content");
  const content = contentElement ? (contentElement.textContent ?? "") : "";
  navigator.clipboard
    .writeText(content)
    .then(() => {
      // Optional: Show success feedback
      console.log("Content copied!");
      // You could also add a toast/notification here
    })
    .catch((err) => {
      console.error("Failed to copy content: ", err);
    });
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
  background: transparent !important;
  box-shadow: none !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  margin: 0;
}

code {
  font-family: monospace;
  color: var(--ion-color-dark);
}
</style>
