import { defineStore } from "pinia";
import { ref } from "vue";
import type { ExperienceItem } from "@/services/homeApi";
import homeApi from "@/services/homeApi";

export const useExperienceStore = defineStore("experience", () => {
  const experiences = ref<ExperienceItem[]>([]);
  const loading = ref(false);
  const saving = ref(false);
  const loaded = ref(false);

  async function loadExperiences(): Promise<void> {
    if (loaded.value && experiences.value.length > 0) return;

    loading.value = true;
    try {
      const data = await homeApi.get();
      experiences.value = data.experience || [];
      loaded.value = true;
    } catch (error) {
      console.error("Error loading experiences:", error);
      experiences.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function saveExperiences(): Promise<void> {
    saving.value = true;
    try {
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({ experience: experiences.value })
      );
      await homeApi.update(formData);
    } catch (error) {
      console.error("Error saving experiences:", error);
      throw error;
    } finally {
      saving.value = false;
    }
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
    saving,
    loaded,
    loadExperiences,
    saveExperiences,
    getExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
  };
});