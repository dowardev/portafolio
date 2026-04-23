import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useIntroStore = defineStore("intro", () => {
  const saving = ref(false);
  const loading = ref(false);

  const form = reactive({
    name: "",
    tags: [] as string[],
    description: "",
    socials: [] as Array<{ platform: string; url: string; iconName: string }>,
    logoUrl: null as string | null,
    photoUrl: null as string | null,
    stack: [] as Array<{ name: string; image: string }>,
    showContactForm: { socials: false, freelance: false },
  });

  const files = reactive({
    logo: null as File | null,
    photo: null as File | null,
  });

  const preview = reactive({
    logo: "",
    photo: "",
  });

  const sectionFiles = reactive({
    stack: {} as Record<number, File>,
  });

  function setData(data: {
    name: string | null;
    tags: string[];
    description: string | null;
    socials: Array<{ platform: string; url: string; iconName: string }>;
    logoUrl: string | null;
    photoUrl: string | null;
    stack: Array<{ name: string; image: string }>;
    showContactForm: { socials: boolean; freelance: boolean };
  }) {
    form.name = data.name || "";
    form.tags = data.tags || [];
    form.description = data.description || "";
    form.socials = data.socials || [];
    form.logoUrl = data.logoUrl;
    form.photoUrl = data.photoUrl;
    form.stack = data.stack || [];
    form.showContactForm = data.showContactForm || { socials: false, freelance: false };
    preview.logo = data.logoUrl || "";
    preview.photo = data.photoUrl || "";
  }

  function getFormData(): FormData {
    const formData = new FormData();
    formData.append(
      "intro",
      JSON.stringify({
        name: form.name,
        tags: form.tags,
        description: form.description,
        socials: form.socials,
        stack: form.stack,
        showContactForm: form.showContactForm,
      }),
    );

    if (files.logo) {
      formData.append("logo", files.logo);
    }
    if (files.photo) {
      formData.append("photo", files.photo);
    }

    for (const [index, file] of Object.entries(sectionFiles.stack)) {
      formData.append(`stack_image_${index}`, file);
    }

    return formData;
  }

  function resetState() {
    form.name = "";
    form.tags = [];
    form.description = "";
    form.socials = [];
    form.logoUrl = null;
    form.photoUrl = null;
    form.stack = [];
    form.showContactForm = { socials: false, freelance: false };
    files.logo = null;
    files.photo = null;
    preview.logo = "";
    preview.photo = "";
    Object.keys(sectionFiles.stack).forEach((key) => delete sectionFiles.stack[Number(key)]);
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setSaving(value: boolean) {
    saving.value = value;
  }

  return {
    form,
    files,
    preview,
    sectionFiles,
    saving,
    loading,
    setData,
    getFormData,
    resetState,
    setLoading,
    setSaving,
  };
});