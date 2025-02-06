<template>
  <ion-card
    class="ion-padding no-shadow"
    :class="cardClasses"
    :style="{ border: borderStyle }"
  >
    <ion-row>
      <ion-col size="6" style="display: flex; align-items: center">
        <div
          style="width: 100%; height: 100%; max-width: 120px; max-height: 48px"
        >
          <ion-icon
            :class="iconClasses"
            :icon="icon"
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
            <!-- Opcional: Botón u otros elementos -->
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
            <p
              style="
                font-family: OpenSans-Regular;
                line-height: normal;
                color: var(--ion-text-color);
              "
            >
              <div id="content" v-html="cardContent"></div>
            </p>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

const cardClasses = computed(() => [`card-${props.color}`]);
const iconClasses = computed(() => [`icon-${props.color}`]);
const borderStyle = computed(() => {
  return props.border ? `1px solid var(--ion-color-${props.color})` : "none";
});
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
</style>
