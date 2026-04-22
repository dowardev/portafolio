import { defineStore } from "pinia";
import { ref } from "vue";
import type { FreelancePlatform, FreelanceComment } from "@/services/types";

export const useFreelanceStore = defineStore("freelance", () => {
  const platforms = ref<FreelancePlatform[]>([]);
  const comments = ref<FreelanceComment[]>([]);
  const loading = ref(false);
  const loaded = ref(false);
  const saving = ref(false);

  function setPlatforms(data: FreelancePlatform[]): void {
    platforms.value = data;
    loaded.value = true;
  }

  function setComments(data: FreelanceComment[]): void {
    comments.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getPlatform(index: number): FreelancePlatform | undefined {
    return platforms.value[index];
  }

  function addPlatform(item: FreelancePlatform): void {
    platforms.value.push(item);
  }

  function updatePlatform(index: number, item: FreelancePlatform): void {
    if (index >= 0 && index < platforms.value.length) {
      platforms.value[index] = item;
    }
  }

  function deletePlatform(index: number): void {
    if (index >= 0 && index < platforms.value.length) {
      platforms.value.splice(index, 1);
    }
  }

  function getComment(index: number): FreelanceComment | undefined {
    return comments.value[index];
  }

  function addComment(item: FreelanceComment): void {
    comments.value.push(item);
  }

  function updateComment(index: number, item: FreelanceComment): void {
    if (index >= 0 && index < comments.value.length) {
      comments.value[index] = item;
    }
  }

  function deleteComment(index: number): void {
    if (index >= 0 && index < comments.value.length) {
      comments.value.splice(index, 1);
    }
  }

  function resetFreelance(): void {
    platforms.value = [];
    comments.value = [];
    loaded.value = false;
  }

  function setSaving(value: boolean): void {
    saving.value = value;
  }

  return {
    platforms,
    comments,
    loading,
    loaded,
    saving,
    setPlatforms,
    setComments,
    setLoading,
    setSaving,
    getPlatform,
    addPlatform,
    updatePlatform,
    deletePlatform,
    getComment,
    addComment,
    updateComment,
    deleteComment,
    resetFreelance,
  };
});