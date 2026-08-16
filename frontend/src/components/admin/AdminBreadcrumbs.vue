<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
      <ion-col size="4">
        <ion-breadcrumbs>
          <ion-breadcrumb v-for="(item, index) in items" :key="index">
            <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
            <template v-else>{{ item.label }}</template>
          </ion-breadcrumb>
        </ion-breadcrumbs>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
// 1. Imports (ionic/vue/ionicons)
import { IonBreadcrumb, IonBreadcrumbs, IonCol, IonGrid, IonRow } from "@ionic/vue";
import { RouterLink } from "vue-router";

// 4. Interface and types imports
import type { RouteLocationRaw } from "vue-router";

// 5. Main (props, emits, etc.)
defineProps<{ items: Array<{ label: string; to?: RouteLocationRaw }> }>();
</script>