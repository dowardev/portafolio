<template>
  <ion-page>
    <AdminInfoPage v-if="$route.params.section === 'info'" />
    <AdminStackPage v-if="$route.params.section === 'stack'" />
    <AdminSkillsPage v-if="$route.params.section === 'skills'" />
    <AdminCertificatesPage v-if="$route.params.section === 'certificates'" />
    <AdminFreelancePage v-if="$route.params.section === 'freelance'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

import AdminInfoPage from "./sections/AdminInfoPage.vue";
import AdminStackPage from "./sections/AdminStackPage.vue";
import AdminSkillsPage from "./sections/AdminSkillsPage.vue";
import AdminCertificatesPage from "./sections/AdminCertificatesPage.vue";
import AdminFreelancePage from "./sections/AdminFreelancePage.vue";
</script>
