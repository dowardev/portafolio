import { defineStore } from "pinia";
import { ref } from "vue";

export interface SkillsCategoryTechItem {
  id?: string;
  iconName: string;
  image?: string;
}

export interface SkillsCategoryItem {
  id?: number;
  name: string;
  sort_order?: number;
  technologies: SkillsCategoryTechItem[];
}

export const useSkillsCategoriesStore = defineStore("skillsCategories", () => {
  const skillsCategories = ref<SkillsCategoryItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setSkillsCategories(data: SkillsCategoryItem[]): void {
    skillsCategories.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getSkillsCategories(): SkillsCategoryItem[] {
    return skillsCategories.value;
  }

  function addSkillsCategory(skillsCategory: SkillsCategoryItem): void {
    skillsCategories.value.push(skillsCategory);
  }

  function updateSkillsCategory(index: number, skillsCategory: SkillsCategoryItem): void {
    if (index >= 0 && index < skillsCategories.value.length) {
      skillsCategories.value[index] = skillsCategory;
    }
  }

  function deleteSkillsCategory(index: number): void {
    if (index >= 0 && index < skillsCategories.value.length) {
      skillsCategories.value.splice(index, 1);
    }
  }

  function resetSkillsCategories(): void {
    skillsCategories.value = [];
    loaded.value = false;
  }

  return {
    skillsCategories,
    loading,
    loaded,
    setSkillsCategories,
    setLoading,
    getSkillsCategories,
    addSkillsCategory,
    updateSkillsCategory,
    deleteSkillsCategory,
    resetSkillsCategories,
  };
});