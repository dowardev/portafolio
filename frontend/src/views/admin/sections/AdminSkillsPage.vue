<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>
      <ion-title>Skills</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <SkillsEditor v-model="homeEditorStore.form.skillCategories" @update:files="updateSkillFiles" />
    
    <ion-button
      expand="block"
      :disabled="homeEditorStore.saving.value"
      class="ion-margin-top"
      @click="homeEditorStore.save"
    >
      <ion-spinner v-if="homeEditorStore.saving.value" slot="start"></ion-spinner>
      Guardar cambios
    </ion-button>
  </ion-content>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonSpinner } from "@ionic/vue";
import { onMounted } from "vue";
import SkillsEditor from "../editors/SkillsEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";

const homeEditorStore = useHomeEditorStore();

onMounted(() => {
  homeEditorStore.loadData();
});

function updateSkillFiles(fileMap: Record<string, File>) {
  Object.assign(homeEditorStore.sectionFiles.skills, fileMap);
}
</script>
