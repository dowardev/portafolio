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
    class="sec-skill"
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
              <img
                v-if="technology.type === 'img'"
                :src="technology.image"
                :style="{
                  maxWidth: technology.size || '24px',
                }"
              />
              <ion-icon
                v-if="technology.type === 'icon'"
                :icon="getIconByName(technology.iconName)"
                :style="{
                  fontSize: technology.size || '24px',
                  color: getIconColorByName(technology.name),
                }"
              ></ion-icon>
              <p>{{ technology.name }}</p>
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
import homeApi, { type StackItem, type SkillCategory } from "@/services/homeApi";

const stackItems = ref<StackItem[]>([]);
const skillCategories = ref<SkillCategory[]>([]);

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    stackItems.value = data.stack || [];
    skillCategories.value = data.skillCategories || [];
  } catch (error) {
    console.error("Error loading skills data:", error);
  }
});

function getIconByName(iconName: string) {
  if (!iconName) return ionicons.helpCircleOutline;
  const icon = ionicons[iconName as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
}

function getIconColorByName(name: string) {
  const colors: { [key: string]: string } = {
    Ionic: "#3356c7",
    Vue: "#41b883",
    Laravel: "#ff2819",
    Firebase: "#ffca28",
    Capacitorjs: "#119eff",
    Electronjs: "#47848f",
    Web: "#3356c7",
    Linux: "#000000",
    PWA: "#5905c8",
    Android: "#44ac5a",
    Windows: "#0078d4",
    JavaScript: "#f0db4f",
    Nuxt: "#00dc82",
  };
  return colors[name] || "";
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
