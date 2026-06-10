<template>
  <ion-page>
    <AdminInfoPage v-if="$route.params.section === 'info'" />
    <SkillsEditorPage v-if="$route.params.section === 'skills'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

import AdminInfoPage from "./sections/AdminInfoPage.vue";
import SkillsEditorPage from "./sections/SkillsEditorPage.vue";
</script>
