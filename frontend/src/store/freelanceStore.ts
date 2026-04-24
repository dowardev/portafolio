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

  function getPlatformById(id: string): FreelancePlatform | undefined {
    return platforms.value.find(p => p.id === id);
  }

  function addPlatform(item: FreelancePlatform): void {
    if (!item.id) {
      item.id = crypto.randomUUID();
    }
    platforms.value.push(item);
  }

  function updatePlatform(index: number, item: FreelancePlatform): void {
    if (index >= 0 && index < platforms.value.length) {
      platforms.value[index] = item;
    }
  }

  function updatePlatformById(id: string, item: FreelancePlatform): void {
    const index = platforms.value.findIndex(p => p.id === id);
    if (index !== -1) {
      platforms.value[index] = { ...platforms.value[index], ...item };
    }
  }

  function deletePlatform(index: number): void {
    if (index >= 0 && index < platforms.value.length) {
      platforms.value.splice(index, 1);
    }
  }

  function deletePlatformById(id: string): void {
    platforms.value = platforms.value.filter(p => p.id !== id);
  }

  function getComment(index: number): FreelanceComment | undefined {
    return comments.value[index];
  }

  function getCommentById(id: string): FreelanceComment | undefined {
    return comments.value.find(c => c.id === id);
  }

  function addComment(item: FreelanceComment): void {
    if (!item.id) {
      item.id = crypto.randomUUID();
    }
    comments.value.push(item);
  }

  function updateComment(index: number, item: FreelanceComment): void {
    if (index >= 0 && index < comments.value.length) {
      comments.value[index] = item;
    }
  }

  function updateCommentById(id: string, item: FreelanceComment): void {
    const index = comments.value.findIndex(c => c.id === id);
    if (index !== -1) {
      comments.value[index] = { ...comments.value[index], ...item };
    }
  }

  function deleteComment(index: number): void {
    if (index >= 0 && index < comments.value.length) {
      comments.value.splice(index, 1);
    }
  }

  function deleteCommentById(id: string): void {
    comments.value = comments.value.filter(c => c.id !== id);
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
    getPlatformById,
    addPlatform,
    updatePlatform,
    updatePlatformById,
    deletePlatform,
    deletePlatformById,
    getComment,
    getCommentById,
    addComment,
    updateComment,
    updateCommentById,
    deleteComment,
    deleteCommentById,
    resetFreelance,
  };
});