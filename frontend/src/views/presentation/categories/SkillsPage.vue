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
              <img :src="item.image" :alt="item.name" />
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
            <ion-col
              v-for="(technology, index) in category.technologies"
              :key="index"
            >
              <ion-icon
                :icon="getIconByName(technology.iconName)"
                :style="{
                  fontSize: '24px',
                  color: getIconColor(technology.iconName),
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
import * as ionicons from "ionicons/icons";
import { useIconColors } from "@/composables/useIconColors";
import type { StackItem, SkillCategory } from "@/services/types";
import IntroController from "@/controllers/introController";
import SkillsCategoriesController from "@/controllers/skillsCategoriesController";

const { getIconColor } = useIconColors();
const introController = new IntroController();
const skillsCategoriesController = new SkillsCategoriesController();

const stackItems = ref<StackItem[]>([]);
const skillCategories = ref<SkillCategory[]>([]);

onMounted(async () => {
  try {
    const [introData, skillsData] = await Promise.all([
      introController.loadIntro(),
      skillsCategoriesController.loadSkillsCategories(),
    ]);
    stackItems.value = introData.stack || [];
    skillCategories.value = skillsData || [];
  } catch (error) {
    console.error("Error loading categories data:", error);
  }
});

function getIconByName(iconName: string) {
  if (!iconName) return ionicons.helpCircleOutline;
  const icon = ionicons[iconName as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
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

.stack-item img {
  max-width: 100%;
  max-height: 100%;
}
</style>
