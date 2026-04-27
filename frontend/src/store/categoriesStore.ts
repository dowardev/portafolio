import { defineStore } from "pinia";
import { ref } from "vue";
import type { TechnologyItem } from "@/services/types";

export interface CategoryTechItem {
  id?: number;
  name?: string;
  category?: string;
  image?: string;
  iconName: string;
}

export interface CategoryItem {
  id?: number;
  name: string;
  sort_order?: number;
  technologies: CategoryTechItem[];
}

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<CategoryItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setCategories(data: CategoryItem[]): void {
    categories.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getCategories(): CategoryItem[] {
    return categories.value;
  }

  function addCategory(category: CategoryItem): void {
    categories.value.push(category);
  }

  function updateCategory(index: number, category: CategoryItem): void {
    if (index >= 0 && index < categories.value.length) {
      categories.value[index] = category;
    }
  }

  function deleteCategory(index: number): void {
    if (index >= 0 && index < categories.value.length) {
      categories.value.splice(index, 1);
    }
  }

  function resetCategories(): void {
    categories.value = [];
    loaded.value = false;
  }

  return {
    categories,
    loading,
    loaded,
    setCategories,
    setLoading,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
  };
});