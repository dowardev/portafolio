import { defineStore } from "pinia";
import { ref } from "vue";

export interface SkillItem {
  id?: number;
  name: string;
  category: string;
  image?: string;
  sort_order?: number;
}

export const useSkillsStore = defineStore("skills", () => {
  const skills = ref<SkillItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setSkills(data: SkillItem[]): void {
    skills.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getSkills(): SkillItem[] {
    return skills.value;
  }

  function addSkill(skill: SkillItem): void {
    skills.value.push(skill);
  }

  function updateSkill(index: number, skill: SkillItem): void {
    if (index >= 0 && index < skills.value.length) {
      skills.value[index] = skill;
    }
  }

  function deleteSkill(index: number): void {
    if (index >= 0 && index < skills.value.length) {
      skills.value.splice(index, 1);
    }
  }

  function resetSkills(): void {
    skills.value = [];
    loaded.value = false;
  }

  return {
    skills,
    loading,
    loaded,
    setSkills,
    setLoading,
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    resetSkills,
  };
});