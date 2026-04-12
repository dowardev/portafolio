<template>
  <ion-list :style="{ height: section.height || 'auto' }">
    <ion-list-header v-if="section.title">
      <ion-label>{{ sectionTitle }}</ion-label>
      <ion-button v-if="section.routeName" @click="navigate">
        {{ section.routeLabel || "Ver todo" }}
      </ion-button>
    </ion-list-header>

    <component :is="section.component" v-bind="componentProps" />
  </ion-list>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { IonList, IonListHeader, IonLabel, IonButton } from "@ionic/vue";
import { type SectionConfig, type HomeTemplateData } from "@/utils/types/homeTemplate";

interface Props {
  section: SectionConfig;
  data: HomeTemplateData;
  screenSize: any;
}

const props = defineProps<Props>();

const router = useRouter();

const sectionTitle = computed(() => {
  const titles: Record<string, string> = {
    experience: "Experiencia reciente",
    projects: "Últimos proyectos",
    certificates: "Certificados recientes",
  };
  return titles[props.section.id] || props.section.title || "";
});

const componentProps = computed(() => {
  const sectionId = props.section.id;
  const data = props.data;

  const propsMap: Record<string, Record<string, any>> = {
    SkillsPage: { stack: data.stack, skillCategories: data.skillCategories },
    ExperienceComponent: { experience: data.experience },
    ProjectsComponent: { projects: data.projects },
    CertificatesComponent: { certificates: data.certificates },
    FinalSection: {
      freelance: data.freelance,
      showContactForm: data.showContactForm,
      screenSize: props.screenSize,
    },
  };

  const componentName = props.section.component?.name || props.section.component;
  return propsMap[componentName] || props.section.props || {};
});

function navigate() {
  if (props.section.routeName) {
    router.push({ name: props.section.routeName });
  }
}
</script>