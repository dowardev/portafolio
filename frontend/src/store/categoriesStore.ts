import { defineStore } from "pinia";
import type { SkillCategory } from "@/services/types";

interface State {
  skillCategories: SkillCategory[];
  loading: boolean;
  loaded: boolean;
  saving: boolean;
}

export const useCategoriesStore = defineStore("categories", {
  state: (): State => ({
    skillCategories: [],
    loading: false,
    loaded: false,
    saving: false,
  }),

  getters: {
    getSkillCategory:
      (state) =>
      (index: number): SkillCategory | undefined => {
        return state.skillCategories[index];
      },
  },

  actions: {
    setSkillCategories(categories: SkillCategory[]) {
      this.skillCategories = categories;
      this.loaded = true;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    updateSkillCategory(index: number, category: SkillCategory) {
      this.skillCategories[index] = category;
    },

    addSkillCategory(category: SkillCategory) {
      this.skillCategories.push(category);
    },

    deleteSkillCategory(index: number) {
      this.skillCategories.splice(index, 1);
    },

    setSaving(saving: boolean) {
      this.saving = saving;
    },
  },
});