<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Proyectos</ion-title>

      <ion-buttons slot="end">
        <ion-button
          color="medium"
          @click="addTestData"
        >
          <ion-icon :icon="bulbOutline"></ion-icon>
        </ion-button>

        <ion-button
          :disabled="homeEditorStore.saving.value"
          class="ion-margin-top"
          @click="homeEditorStore.save"
        >
          <ion-spinner
            v-if="homeEditorStore.saving.value"
            slot="start"
          ></ion-spinner>

          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ProjectsEditor
            v-model="homeEditorStore.form.projects"
            @update:files="updateProjectFiles"
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
} from "@ionic/vue";
import { onMounted } from "vue";
import ProjectsEditor from "../editors/ProjectsEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import { saveOutline, bulbOutline } from "ionicons/icons";
import { faker } from "@faker-js/faker";

const homeEditorStore = useHomeEditorStore();

onMounted(() => {
  homeEditorStore.loadData();
});

function updateProjectFiles(fileMap: Record<string, File>) {
  Object.assign(homeEditorStore.sectionFiles.projects, fileMap);
}

function addTestData() {
  const techOptions = ["Vue.js", "React", "Angular", "Node.js", "Python", "TypeScript", "Laravel", "Django", "Go", "Rust"];
  
  for (let i = 0; i < 3; i++) {
    const numTechs = faker.number.int({ min: 2, max: 5 });
    const selectedTechs = faker.helpers.arrayElements(techOptions, numTechs).map(name => ({
      name,
      type: "icon" as const,
      source: "",
      size: "small" as const,
    }));
    
    homeEditorStore.form.projects.push({
      img: "",
      title: faker.company.name(),
      status: faker.helpers.arrayElement(["progress", "indeterminate", "finished"]),
      technologies: selectedTechs,
      source: {
        img: "",
        name: faker.company.name(),
        url: faker.internet.url(),
      },
      details: {
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
      },
    });
  }
}
</script>
