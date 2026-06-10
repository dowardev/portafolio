import { defineStore } from "pinia";
import { ref } from "vue";
import type { TechItem } from "@/services/types";

export type { TechItem } from "@/services/types";

export const useTechStore = defineStore("techs", () => {
  const techs = ref<TechItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setTechs(data: TechItem[]): void {
    techs.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getTechs(): TechItem[] {
    return techs.value;
  }

  function addTech(tech: TechItem): void {
    techs.value.push(tech);
  }

  function updateTech(index: number, tech: TechItem): void {
    if (index >= 0 && index < techs.value.length) {
      techs.value[index] = tech;
    }
  }

  function deleteTech(index: number): void {
    if (index >= 0 && index < techs.value.length) {
      techs.value.splice(index, 1);
    }
  }

  function resetTechs(): void {
    techs.value = [];
    loaded.value = false;
  }

  return {
    techs,
    loading,
    loaded,
    setTechs,
    setLoading,
    getTechs,
    addTech,
    updateTech,
    deleteTech,
    resetTechs,
  };
});
