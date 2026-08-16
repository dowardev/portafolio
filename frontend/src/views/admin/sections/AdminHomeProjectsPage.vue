<template>
  <div class="ion-padding">
    <AdminBreadcrumbs
      :items="[
        { label: 'Panel', to: { name: 'PanelAdminPage' } },
        { label: 'Proyectos' },
      ]"
    />
    <h3>Proyectos</h3>
    <p>Esta sección se implementará próximamente.</p>
    <ion-button @click="$router.push({ name: 'PanelAdminPage' })">
      Volver a secciones
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs.vue";
</script>
