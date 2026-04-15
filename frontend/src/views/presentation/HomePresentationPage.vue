<template>
  <!-- Elegir uno de los dos: -->

  <!-- Template 1: Scroll vertical -->
  <!-- <HomeTemplate1 v-bind="templateData" /> -->

  <!-- Template 2: Grid (descomentar para usar) -->
  <HomeTemplate2 v-bind="templateData" />
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import HomeTemplate1 from "@/templates/HomeTemplate1.vue";
import HomeTemplate2 from "@/templates/HomeTemplate2.vue";

import homeApi from "@/services/homeApi";
import type { HomePageData } from "@/services/homeApi";

const templateData = reactive<Partial<HomePageData>>({});

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    // templateData is a reactive object; merge API result into it
    Object.assign(templateData, data);
  } catch (error) {
    console.error("Error loading template data:", error);
  }
});
</script>
