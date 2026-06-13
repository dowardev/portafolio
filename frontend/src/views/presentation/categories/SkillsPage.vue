<template>
  <ion-row>
    <ion-col>
      <ion-row>
        <ion-col style="display: flex" class="ion-justify-content-center">
          <h1>Stack principal</h1>
        </ion-col>
      </ion-row>

      <ion-row class="sec2">
        <ion-col style="display: flex" class="ion-justify-content-center">
          <div class="stack-container">
            <div
              v-for="(item, index) in stackItems"
              :key="index"
              class="stack-item"
            >
              <template v-if="isLineIconName(item.iconName)">
                <Lineicons
                  :icon="getIconComponent(item.iconName)"
                  :color="'var(--ion-color-primary)'"
                  :size="36"
                />
              </template>

              <ion-icon
                v-else
                :icon="getIconSvg(item.iconName)"
                :style="{
                  fontSize: '36px',
                  color: 'var(--ion-color-primary)',
                }"
              ></ion-icon>
            </div>
          </div>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>

  <ion-row
    style="overflow: auto; max-height: calc(100% - 22dvh)"
    class="sec-category"
  >
    <ion-col
      v-for="(category, indexCat) in skillCategories"
      :key="indexCat"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card class="shadow-1">
        <ion-card-header>
          <ion-card-title>{{ category.name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-row style="text-align: center">
            <ion-col v-if="category.iconName">
              <template v-if="isLineIconName(category.iconName)">
                <Lineicons
                  :icon="getIconComponent(category.iconName)"
                  color="var(--ion-color-primary)"
                  :size="24"
                />
              </template>

              <ion-icon
                v-else
                :icon="getIconSvg(category.iconName)"
                :style="{
                  fontSize: '24px',
                  color: 'var(--ion-color-primary)',
                }"
              ></ion-icon>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import type { StackItem } from "@/services/types";
import type { TechItem } from "@/services/types";
import StackController from "@/controllers/stackController";
import TechController from "@/controllers/techController";
import {
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/utils/iconsIndex";

const stackController = new StackController();
const techController = new TechController();

const stackItems = ref<StackItem[]>([]);
const skillCategories = ref<TechItem[]>([]);

onMounted(async () => {
  try {
    const [stackData, techData] = await Promise.all([
      stackController.loadStack(),
      techController.loadTechs(),
    ]);
    stackItems.value = stackData || [];
    skillCategories.value = techData || [];
  } catch (error) {
    console.error("Error loading categories data:", error);
  }
});

function isLineIconName(name: string): boolean {
  return isLineIcon(name);
}

function getIconSvg(name: string): string | undefined {
  return getIonIconSvg(name);
}

function getIconComponent(name: string): object | undefined {
  return getLineIconComponent(name);
}
</script>

<style scoped>
.stack-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.stack-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
}
</style>
