<template>
  <ion-page>
    <AdminInfoPage v-if="$route.params.section === 'info'" />
    <AdminStackPage v-if="$route.params.section === 'stack'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

import AdminInfoPage from "./sections/AdminInfoPage.vue";
import AdminStackPage from "./sections/AdminStackPage.vue";
</script>
