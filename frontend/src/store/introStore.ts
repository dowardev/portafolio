import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export interface TagItem {
  id?: number;
  name: string;
  url?: string;
  sort_order?: number;
}

export interface SocialItem {
  id?: number;
  platform: string;
  url: string;
  iconName: string;
}

export const useIntroStore = defineStore("intro", () => {
  const loading = ref(false);

  const data = reactive({
    name: "",
    tags: [] as TagItem[],
    description: "",
    socials: [] as SocialItem[],
    logoUrl: null as string | null,
    photoUrl: null as string | null,
    stack: [] as Array<{ name: string; image: string }>,
    showContactForm: { socials: false, freelance: false },
  });

  function setData(newData: {
    name: string | null;
    tags: TagItem[];
    description: string | null;
    socials: SocialItem[];
    logoUrl: string | null;
    photoUrl: string | null;
    stack: Array<{ name: string; image: string }>;
    showContactForm: { socials: boolean; freelance: boolean };
  }) {
    data.name = newData.name || "";
    data.tags = newData.tags || [];
    data.description = newData.description || "";
    data.socials = newData.socials || [];
    data.logoUrl = newData.logoUrl;
    data.photoUrl = newData.photoUrl;
    data.stack = newData.stack || [];
    data.showContactForm = newData.showContactForm || { socials: false, freelance: false };
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  return {
    data,
    loading,
    setData,
    setLoading,
  };
});