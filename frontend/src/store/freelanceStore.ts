import { defineStore } from "pinia";
import { ref } from "vue";
import type { FreelancePlatform, FreelanceComment } from "@/services/types";

export const useFreelanceStore = defineStore("freelance", () => {
  const platforms = ref<FreelancePlatform[]>([]);
  const comments = ref<FreelanceComment[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setFreelance(
    newPlatforms: FreelancePlatform[],
    newComments: FreelanceComment[],
  ) {
    platforms.value = newPlatforms;
    comments.value = newComments;
    loaded.value = true;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function getPlatform(index: number): FreelancePlatform | undefined {
    return platforms.value[index];
  }

  function getComment(index: number): FreelanceComment | undefined {
    return comments.value[index];
  }

  return {
    platforms,
    comments,
    loading,
    loaded,
    setFreelance,
    setLoading,
    getPlatform,
    getComment,
  };
});