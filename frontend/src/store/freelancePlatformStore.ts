import { defineStore } from "pinia";
import { ref } from "vue";
import type { FreelancePlatform } from "@/services/types";

export const useFreelancePlatformStore = defineStore("freelancePlatform", () => {
  const freelancePlatforms = ref<FreelancePlatform[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setFreelancePlatforms(newPlatforms: FreelancePlatform[]) {
    freelancePlatforms.value = newPlatforms;
    loaded.value = true;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function getFreelancePlatform(index: number): FreelancePlatform | undefined {
    return freelancePlatforms.value[index];
  }

  return {
    freelancePlatforms,
    loading,
    loaded,
    setFreelancePlatforms,
    setLoading,
    getFreelancePlatform,
  };
});