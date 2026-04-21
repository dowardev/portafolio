import { defineStore } from "pinia";
import { ref } from "vue";
import type { FreelanceItem } from "@/services/types";

export const useFreelanceStore = defineStore("freelance", () => {
  const freelance = ref<FreelanceItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);
  const saving = ref(false);

  function setFreelance(data: FreelanceItem[]): void {
    freelance.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getFreelanceItem(index: number): FreelanceItem | undefined {
    return freelance.value[index];
  }

  function addFreelanceItem(item: FreelanceItem): void {
    freelance.value.push(item);
  }

  function updateFreelanceItem(index: number, item: FreelanceItem): void {
    if (index >= 0 && index < freelance.value.length) {
      freelance.value[index] = item;
    }
  }

  function deleteFreelanceItem(index: number): void {
    if (index >= 0 && index < freelance.value.length) {
      freelance.value.splice(index, 1);
    }
  }

  function resetFreelance(): void {
    freelance.value = [];
    loaded.value = false;
  }

  function setSaving(value: boolean): void {
    saving.value = value;
  }

  return {
    freelance,
    loading,
    loaded,
    saving,
    setFreelance,
    setLoading,
    setSaving,
    getFreelanceItem,
    addFreelanceItem,
    updateFreelanceItem,
    deleteFreelanceItem,
    resetFreelance,
  };
});