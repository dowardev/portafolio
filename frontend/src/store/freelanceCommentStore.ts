import { defineStore } from "pinia";
import { ref } from "vue";
import type { FreelanceComment } from "@/services/types";

export const useFreelanceCommentStore = defineStore("freelanceComment", () => {
  const freelanceComments = ref<FreelanceComment[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setFreelanceComments(newComments: FreelanceComment[]) {
    freelanceComments.value = newComments;
    loaded.value = true;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function getFreelanceComment(index: number): FreelanceComment | undefined {
    return freelanceComments.value[index];
  }

  return {
    freelanceComments,
    loading,
    loaded,
    setFreelanceComments,
    setLoading,
    getFreelanceComment,
  };
});