<template>
  <ion-page>
    <AdminInfoPage v-if="$route.params.section === 'info'" />
    <AdminStackPage v-if="$route.params.section === 'stack'" />
    <AdminSkillsPage v-if="$route.params.section === 'skills'" />
    <AdminExperiencePage v-if="$route.params.section === 'experience'" />
    <AdminProjectsPage v-if="$route.params.section === 'projects'" />
    <AdminCertificatesPage v-if="$route.params.section === 'certificates'" />
    <AdminFreelancePage v-if="$route.params.section === 'freelance'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

import AdminInfoPage from "./sections/AdminInfoPage.vue";
import AdminStackPage from "./sections/AdminStackPage.vue";
import AdminSkillsPage from "./sections/AdminSkillsPage.vue";
import AdminExperiencePage from "./sections/AdminExperiencePage.vue";
import AdminProjectsPage from "./sections/AdminProjectsPage.vue";
import AdminCertificatesPage from "./sections/AdminCertificatesPage.vue";
import AdminFreelancePage from "./sections/AdminFreelancePage.vue";
</script>
