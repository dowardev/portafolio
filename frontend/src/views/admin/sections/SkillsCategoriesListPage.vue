<template>
<ion-page>
<ion-header class="ion-no-border" mode="ios">
<ion-toolbar style="--background: var(--ion-background-color)">
<ion-buttons slot="start">
<ion-menu-button></ion-menu-button>
</ion-buttons>

<ion-title>Categorías de Skills</ion-title>

<ion-buttons slot="end">
<ion-button
v-if="isDev"
v-tooltip="{
content: 'Datos de prueba',
delay: [500, 0],
touch: 'hold',
}"
color="tertiary"
@click="generateTestSkillsCategories"
>
<ion-icon
slot="start"
:icon="bugOutline"
color="warning"
></ion-icon>
</ion-button>

<ion-button color="primary" @click="createNewSkillsCategory">
<ion-icon slot="start" :icon="addOutline"></ion-icon>
</ion-button>
</ion-buttons>
</ion-toolbar>
</ion-header>

<ion-content>
<ion-grid>
<ion-row class="ion-justify-content-center">
<ion-col size="4">
<ion-breadcrumbs>
<ion-breadcrumb>
<RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
</ion-breadcrumb>

<ion-breadcrumb>Categorías de Skills</ion-breadcrumb>
</ion-breadcrumbs>
</ion-col>
</ion-row>
</ion-grid>

<template v-if="skillsCategories.length > 0">
<ion-grid>
<ion-row class="ion-justify-content-center">
<ion-col size="4">
<ion-list>
<ion-card class="shadow1">
<ion-item
v-for="(skillsCategory, index) in skillsCategories"
:key="index"
button
lines="full"
@click="editSkillsCategory(index)"
>
<ion-thumbnail slot="start" class="placeholder-thumb">
<ion-icon :icon="codeSlashOutline" />
</ion-thumbnail>

<ion-label>
<h2>{{ skillsCategory.name || "Sin título" }}</h2>

<p
style="font-size: 12px; color: var(--ion-color-medium)"
>
{{ skillsCategory.technologies?.length || 0 }} tecnologías
</p>
</ion-label>

<ion-buttons slot="end">
<ion-button
color="danger"
fill="clear"
@click.stop="confirmDelete(index)"
>
<ion-icon :icon="trashOutline" />
</ion-button>
</ion-buttons>
</ion-item>
</ion-card>
</ion-list>
</ion-col>
</ion-row>
</ion-grid>
</template>

<div v-else class="empty-state">
<ion-icon :icon="codeSlashOutline" size="large" />

<p>No hay categorías de skills aún</p>

<ion-button @click="createNewSkillsCategory">
<ion-icon slot="start" :icon="addOutline"></ion-icon>
Crear primera categoría
</ion-button>
</div>
</ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
addOutline,
codeSlashOutline,
trashOutline,
bugOutline,
} from "ionicons/icons";
import { faker } from "@faker-js/faker";
import SkillsCategoriesController from "@/controllers/skillsCategoriesController";
import { storeToRefs } from "pinia";

const router = useRouter();
const skillsCategoriesController = new SkillsCategoriesController();
const { skillsCategories, loading: skillsCategoriesLoading } = storeToRefs(skillsCategoriesController.skillsCategoriesStore);

const isDev = import.meta.env.DEV;

onMounted(async () => {
await skillsCategoriesController.loadSkillsCategories();
});

function editSkillsCategory(index: number) {
router.push(`/admin-panel/skills-categories/edit/${index}`);
}

function createNewSkillsCategory() {
router.push("/admin-panel/skills-categories/new");
}

async function confirmDelete(index: number) {
const skillsCategory = skillsCategories.value[index];
if (!skillsCategory?.id) return;

const alert = await alertController.create({
header: "Eliminar categoría de skills",
message: `¿Estás seguro de eliminar "${skillsCategory.name || "esta categoría"}"?`,
buttons: [
{
text: "Cancelar",
role: "cancel",
},
{
text: "Eliminar",
role: "destructive",
handler: () => {
deleteSkillsCategory(skillsCategory.id)
},
},
],
});
await alert.present();
}

async function deleteSkillsCategory(id: number) {
await skillsCategoriesController.deleteSkillsCategory(id);
}

async function generateTestSkillsCategories() {
const techs = ["React", "Vue", "Node", "Python", "TypeScript", "Go", "Rust"];

const testSkillsCategories = Array.from({ length: 3 }, () => {
const techNames = faker.helpers.arrayElements(techs, { min: 2, max: 5 });
return {
name: faker.word.noun(),
technologies: techNames.map((name) => ({
iconName: name.toLowerCase(),
})),
};
});

for (const skillsCategory of testSkillsCategories) {
await skillsCategoriesController.addSkillsCategory(skillsCategory);
}
}
</script>

<style scoped>
.placeholder-thumb {
display: flex;
align-items: center;
justify-content: center;
background: var(--ion-color-light);
color: var(--ion-color-medium);
}

.empty-state {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 40px;
text-align: center;
color: var(--ion-color-medium);
}
</style>