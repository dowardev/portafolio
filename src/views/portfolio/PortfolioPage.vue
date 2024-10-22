<template>
  <!-- selector -->
  <section class="ion-padding-start">
    <ion-select v-model="typeContent" interface="popover">
      <ion-select-option value="projectsB">
        Proyectos del blog
      </ion-select-option>

      <ion-select-option value="projectsP">
        Proyectos profesionales
      </ion-select-option>
    </ion-select>
  </section>

  <!-- content -->
  <section style="height: calc(100dvh - 127px); overflow: auto" class="center">
    <div :class="{ container: isPlatform('desktop') }">
      <ProfessionalProjectsPage v-if="typeContent == 'projectsP'" />
      <BloglProjectsPage v-if="typeContent == 'projectsB'" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, isPlatform } from "@ionic/vue";
import { ref } from "vue";

// components
import ProfessionalProjectsPage from "../../components/portfolio/professional-projects/ProfessionalProjectsPage.vue";
import BloglProjectsPage from "../../components/portfolio/blog-projects/BlogProjectsPage.vue";

const emits = defineEmits(["scrollPosition"]);
const typeContent = ref("projectsP");
</script>

<style scoped>
.container {
  width: 60%;
}
</style>
