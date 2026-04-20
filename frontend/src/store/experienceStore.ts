import { defineStore } from "pinia";
import { ref } from "vue";
import type { ExperienceItem } from "@/services/types";

export const useExperienceStore = defineStore("experience", () => {
  const experiences = ref<ExperienceItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setExperiences(data: ExperienceItem[]): void {
    experiences.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getExperience(index: number): ExperienceItem | undefined {
    return experiences.value[index];
  }

  function addExperience(experience: ExperienceItem): void {
    experiences.value.push(experience);
  }

  function updateExperience(index: number, experience: ExperienceItem): void {
    if (index >= 0 && index < experiences.value.length) {
      experiences.value[index] = experience;
    }
  }

  function deleteExperience(index: number): void {
    if (index >= 0 && index < experiences.value.length) {
      experiences.value.splice(index, 1);
    }
  }

  function resetExperiences(): void {
    experiences.value = [];
    loaded.value = false;
  }

  return {
    experiences,
    loading,
    loaded,
    setExperiences,
    setLoading,
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
  };
});