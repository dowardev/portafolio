import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import homeApi, { type HomePageData } from "@/services/homeApi";
import { ToastController } from "@/controllers/toastController";

export const useHomeEditorStore = defineStore("homeEditor", () => {
  const toastController = new ToastController();
  const saving = ref(false);
  const loading = ref(false);

  const form = reactive<Omit<HomePageData, "projects">>({
    name: "",
    tags: [],
    description: "",
    socials: [],
    logoUrl: null,
    photoUrl: null,
    stack: [],
    skillCategories: [],
    experience: [],
    certificates: [],
    freelance: [],
    showContactForm: false,
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
    skills: {} as Record<string, File>,
    experience: {} as Record<string, File>,
    certificates: {} as Record<string, File>,
    freelance: {} as Record<string, File>,
  });

  async function loadData() {
    loading.value = true;
    try {
      const data = await homeApi.get();
      form.name = data.name || "";
      form.tags = data.tags || [];
      form.description = data.description || "";
      form.socials = data.socials || [];
      form.logoUrl = data.logoUrl;
      form.photoUrl = data.photoUrl;
      form.stack = data.stack || [];
      form.skillCategories = data.skillCategories || [];
      form.experience = data.experience || [];
      form.certificates = data.certificates || [];
      form.freelance = data.freelance || [];
      form.showContactForm = data.showContactForm || false;
      preview.logo = data.logoUrl || "";
      preview.photo = data.photoUrl || "";
    } catch (error) {
      console.error("Error loading homepage data:", error);
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    saving.value = true;
    try {
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({
          name: form.name,
          tags: form.tags,
          description: form.description,
          socials: form.socials,
          stack: form.stack,
          skillCategories: form.skillCategories,
          experience: form.experience,
          certificates: form.certificates,
          freelance: form.freelance,
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

      for (const [key, file] of Object.entries(sectionFiles.skills)) {
        formData.append(`skill_image_${key}`, file);
      }

      for (const [key, file] of Object.entries(sectionFiles.experience)) {
        formData.append(key, file);
      }

      for (const [key, file] of Object.entries(sectionFiles.certificates)) {
        formData.append(key, file);
      }

      for (const [key, file] of Object.entries(sectionFiles.freelance)) {
        formData.append(key, file);
      }

      await homeApi.update(formData);
      const toast = await toastController.presentToast({
        message: "Guardado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } catch (error) {
      console.error("Error saving:", error);
      const toast = await toastController.presentToast({
        message: "Error al guardar",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
    } finally {
      saving.value = false;
    }
  }

  function resetState() {
    form.name = "";
    form.tags = [];
    form.description = "";
    form.socials = [];
    form.logoUrl = null;
    form.photoUrl = null;
    form.stack = [];
    form.skillCategories = [];
    form.experience = [];
    form.certificates = [];
    form.freelance = [];
    form.showContactForm = false;
    files.logo = null;
    files.photo = null;
    preview.logo = "";
    preview.photo = "";
    Object.keys(sectionFiles.stack).forEach((key) => delete sectionFiles.stack[Number(key)]);
    Object.keys(sectionFiles.skills).forEach((key) => delete sectionFiles.skills[key]);
    Object.keys(sectionFiles.experience).forEach((key) => delete sectionFiles.experience[key]);
    Object.keys(sectionFiles.certificates).forEach((key) => delete sectionFiles.certificates[key]);
    Object.keys(sectionFiles.freelance).forEach((key) => delete sectionFiles.freelance[key]);
  }

  return {
    form,
    files,
    preview,
    sectionFiles,
    saving,
    loading,
    loadData,
    save,
    resetState,
  };
});
