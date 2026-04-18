<template>
  <div>
    <div class="nav-buttons">
      <ion-button :color="activeSection === 'info' ? 'primary' : 'medium'" @click="navigateTo('info')">
        Info
      </ion-button>
      <ion-button :color="activeSection === 'stack' ? 'primary' : 'medium'" @click="navigateTo('stack')">
        Stack
      </ion-button>
      <ion-button :color="activeSection === 'skills' ? 'primary' : 'medium'" @click="navigateTo('skills')">
        Skills
      </ion-button>
      <ion-button :color="activeSection === 'experience' ? 'primary' : 'medium'" @click="navigateToExperience">
        Experiencia
      </ion-button>
      <ion-button :color="activeSection === 'projects' ? 'primary' : 'medium'" @click="navigateToProjects">
        Proyectos
      </ion-button>
      <ion-button :color="activeSection === 'certificates' ? 'primary' : 'medium'" @click="navigateTo('certificates')">
        Certificados
      </ion-button>
      <ion-button :color="activeSection === 'freelance' ? 'primary' : 'medium'" @click="navigateTo('freelance')">
        Freelance
      </ion-button>
    </div>

    <form @submit.prevent="save">
      <!-- Sección Info -->
      <div v-if="activeSection === 'info'" class="ion-padding">
        <ion-item>
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input
            v-model="form.name"
            placeholder="Tu nombre o título"
            required
          ></ion-input>
        </ion-item>

        <ion-item lines="none" class="ion-margin-top">
          <ion-label position="stacked">Etiquetas</ion-label>
        </ion-item>
        <div class="chips-container">
          <ion-chip v-for="(tag, index) in form.tags" :key="index" color="primary">
            <ion-label>{{ tag }}</ion-label>
            <ion-icon :icon="closeOutline" @click="removeTag(index)"></ion-icon>
          </ion-chip>
        </div>
        <ion-item>
          <ion-input
            v-model="newTag"
            placeholder="Nueva etiqueta"
            @keyup.enter="addTag"
          ></ion-input>
          <ion-button
            slot="end"
            size="small"
            :disabled="!newTag.trim()"
            @click="addTag"
          >
            Agregar
          </ion-button>
        </ion-item>

        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Descripción</ion-label>
          <ion-textarea
            v-model="form.description"
            :rows="4"
            placeholder="Describe quién eres o qué haces"
          ></ion-textarea>
        </ion-item>

        <ion-item lines="none" class="ion-margin-top">
          <ion-label>Redes Sociales</ion-label>
          <ion-button id="social-popover-trigger" slot="end" size="small">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Añadir
          </ion-button>
        </ion-item>

        <ion-popover trigger="social-popover-trigger" :dismiss-on-select="true">
          <ion-content>
            <ion-list>
              <ion-item
                v-for="social in filteredSocials"
                :key="social.name"
                button
                @click="addSocial(social.name)"
              >
                <ion-icon slot="start" :icon="getIconByName(social.iconName)"></ion-icon>
                <ion-label>{{ social.name }}</ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>

        <div
          v-for="(social, index) in form.socials"
          :key="index"
          class="social-row"
        >
          <ion-item>
            <ion-icon v-if="social.platform" slot="start" :icon="getIconByName(social.platform)"></ion-icon>
            <ion-input
              v-model="social.platform"
              placeholder="Plataforma"
              readonly
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              v-model="social.url"
              placeholder="https://..."
              type="url"
            ></ion-input>
          </ion-item>
          <ion-button fill="clear" color="danger" @click="removeSocial(index)">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </div>

        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Logo</ion-label>
          <input
            type="file"
            accept="image/*"
            class="ion-margin-top"
            @change="onFileChange($event, 'logo')"
          />
          <img
            v-if="preview.logo"
            :src="preview.logo"
            alt="Logo preview"
            class="image-preview"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Foto (Cover)</ion-label>
          <input
            type="file"
            accept="image/*"
            class="ion-margin-top"
            @change="onFileChange($event, 'photo')"
          />
          <img
            v-if="preview.photo"
            :src="preview.photo"
            alt="Foto preview"
            class="image-preview"
          />
        </ion-item>

        <ion-item class="ion-margin-top">
          <ion-label>Mostrar botón de contacto (sección info)</ion-label>
          <ion-note slot="end">Junto a redes sociales</ion-note>
          <ion-toggle
            :checked="form.showContactForm.socials"
            @ion-change="form.showContactForm.socials = $event.detail.checked"
          ></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Mostrar botón de contacto (freelance)</ion-label>
          <ion-note slot="end">En sección de plataformas</ion-note>
          <ion-toggle
            :checked="form.showContactForm.freelance"
            @ion-change="form.showContactForm.freelance = $event.detail.checked"
          ></ion-toggle>
        </ion-item>
      </div>

      <!-- Sección Stack -->
      <StackEditor
        v-if="activeSection === 'stack'"
        v-model="form.stack"
        @update:files="updateStackFiles"
      />

      <!-- Sección Skills -->
      <SkillsEditor
        v-if="activeSection === 'skills'"
        v-model="form.skillCategories"
        @update:files="updateSkillFiles"
      />

      <!-- Sección Certificados -->
      <CertificatesEditor
        v-if="activeSection === 'certificates'"
        v-model="form.certificates"
        @update:files="updateCertFiles"
      />

      <!-- Sección Freelance -->
      <FreelanceEditor
        v-if="activeSection === 'freelance'"
        v-model="form.freelance"
        @update:files="updateFreelanceFiles"
      />

      <div class="ion-padding">
        <ion-button
          type="submit"
          expand="block"
          :disabled="saving"
          class="ion-margin-top"
        >
          <ion-spinner v-if="saving" slot="start"></ion-spinner>
          Guardar cambios
        </ion-button>

        <ion-button
          v-if="isDev"
          expand="block"
          color="warning"
          class="ion-margin-top"
          @click="fillTestData"
        >
          Insertar datos de prueba
        </ion-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonChip,
  IonIcon,
  IonSpinner,
  IonPopover,
  IonList,
  IonContent,
  IonToggle,
} from "@ionic/vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  addOutline,
  closeOutline,
  trashOutline,
  linkOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import { faker } from "@faker-js/faker";
import homeApi, { type HomePageData } from "@/services/homeApi";
import { ToastController } from "@/controllers/toastController";

import StackEditor from "./editors/StackEditor.vue";
import SkillsEditor from "./editors/SkillsEditor.vue";
import CertificatesEditor from "./editors/CertificatesEditor.vue";
import FreelanceEditor from "./editors/FreelanceEditor.vue";

const toastController = new ToastController();
const saving = ref(false);
const newTag = ref("");
const isDev = import.meta.env.DEV;

const router = useRouter();
const route = useRoute();

const validSections = ["info", "stack", "skills", "experience", "projects", "certificates", "freelance"];

const activeSection = computed(() => {
  const section = route.params.section as string;
  if (section && validSections.includes(section)) {
    return section;
  }
  return "info";
});

function navigateTo(section: string) {
  router.push(`/admin-panel/${section}`);
}

function navigateToExperience() {
  router.push("/admin-panel/experience");
}

function navigateToProjects() {
  router.push("/admin-panel/projects");
}

const availableSocials = [
  { name: "Facebook", iconName: "logoFacebook" },
  { name: "X", iconName: "logoX" },
  { name: "Twitter", iconName: "logoTwitter" },
  { name: "Instagram", iconName: "logoInstagram" },
  { name: "LinkedIn", iconName: "logoLinkedin" },
  { name: "YouTube", iconName: "logoYoutube" },
  { name: "TikTok", iconName: "logoTiktok" },
  { name: "GitHub", iconName: "logoGithub" },
  { name: "Discord", iconName: "logoDiscord" },
  { name: "Twitch", iconName: "logoTwitch" },
  { name: "Pinterest", iconName: "logoPinterest" },
  { name: "Snapchat", iconName: "logoSnapchat" },
  { name: "Reddit", iconName: "logoReddit" },
  { name: "WhatsApp", iconName: "logoWhatsapp" },
  { name: "WeChat", iconName: "logoWechat" },
  { name: "Skype", iconName: "logoSkype" },
  { name: "Slack", iconName: "logoSlack" },
  { name: "Dribbble", iconName: "logoDribbble" },
  { name: "Behance", iconName: "logoBehance" },
  { name: "Medium", iconName: "logoMedium" },
  { name: "WordPress", iconName: "logoWordpress" },
  { name: "Vimeo", iconName: "logoVimeo" },
  { name: "SoundCloud", iconName: "logoSoundcloud" },
  { name: "Apple", iconName: "logoApple" },
  { name: "Google", iconName: "logoGoogle" },
  { name: "Amazon", iconName: "logoAmazon" },
  { name: "PayPal", iconName: "logoPaypal" },
  { name: "Bitcoin", iconName: "logoBitcoin" },
  { name: "Stack Overflow", iconName: "logoStackoverflow" },
  { name: "Steam", iconName: "logoSteam" },
  { name: "Xbox", iconName: "logoXbox" },
  { name: "PlayStation", iconName: "logoPlaystation" },
  { name: "Tumblr", iconName: "logoTumblr" },
  { name: "VK", iconName: "logoVk" },
];

function getIconByName(iconName: string) {
  if (!iconName) return linkOutline;

  let icon = ionicons[iconName as keyof typeof ionicons];
  if (icon) return icon;

  const logoIconName = `logo${iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/\s/g, '')}`;
  icon = ionicons[logoIconName as keyof typeof ionicons];
  if (icon) return icon;

  const social = availableSocials.find(s => s.name.toLowerCase() === iconName.toLowerCase());
  if (social) {
    icon = ionicons[social.iconName as keyof typeof ionicons];
    if (icon) return icon;
  }

  return linkOutline;
}

const filteredSocials = computed(() => {
  const selectedPlatforms = form.socials
    .filter((s) => s.platform)
    .map((s) => s.platform.toLowerCase());
  return availableSocials.filter(
    (social) => !selectedPlatforms.includes(social.name.toLowerCase())
  );
});

const form = reactive<HomePageData>({
  name: "",
  tags: [],
  description: "",
  socials: [],
  logoUrl: null,
  photoUrl: null,
  stack: [],
  skillCategories: [],
  experience: [],
  projects: [],
  certificates: [],
  freelance: [],
  showContactForm: {
      socials: false,
      freelance: false,
    },
});

const preview = reactive({
  logo: "",
  photo: "",
});

const files = reactive({
  logo: null as File | null,
  photo: null as File | null,
});

const sectionFiles = reactive({
  stack: {} as Record<number, File>,
  skills: {} as Record<string, File>,
  experience: {} as Record<string, File>,
  projects: {} as Record<string, File>,
  certificates: {} as Record<string, File>,
  freelance: {} as Record<string, File>,
});

onMounted(async () => {
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
    form.projects = data.projects || [];
    form.certificates = data.certificates || [];
    form.freelance = data.freelance || [];
    form.showContactForm = data.showContactForm || {
      socials: false,
      freelance: false,
    };
    preview.logo = data.logoUrl || "";
    preview.photo = data.photoUrl || "";
  } catch (error) {
    console.error("Error loading homepage data:", error);
  }
});

function addTag() {
  if (!newTag.value.trim()) return;
  if (!form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim());
  }
  newTag.value = "";
}

function removeTag(index: number) {
  form.tags.splice(index, 1);
}

function addSocial(platform: string) {
  const social = availableSocials.find((s) => s.name === platform);
  const iconName = social ? social.iconName : "";
  form.socials.push({ platform, url: "", iconName });
}

function removeSocial(index: number) {
  form.socials.splice(index, 1);
}

function onFileChange(event: Event, type: "logo" | "photo") {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  files[type] = file;
  preview[type] = URL.createObjectURL(file);
}

function updateStackFiles(fileMap: Record<number, File>) {
  Object.assign(sectionFiles.stack, fileMap);
}

function updateSkillFiles(fileMap: Record<string, File>) {
  Object.assign(sectionFiles.skills, fileMap);
}

function updateExpFiles(fileMap: Record<string, File>) {
  Object.assign(sectionFiles.experience, fileMap);
}

function updateProjectFiles(fileMap: Record<string, File>) {
  Object.assign(sectionFiles.projects, fileMap);
}

function updateCertFiles(fileMap: Record<string, File>) {
  Object.assign(sectionFiles.certificates, fileMap);
}

function updateFreelanceFiles(fileMap: Record<string, File>) {
  Object.assign(sectionFiles.freelance, fileMap);
}

function fillTestData() {
  form.name = "Juan Pérez";
  form.tags = ["Desarrollador", "Full-Stack", "Vue.js", "Laravel"];
  form.description = "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.";
  form.socials = [
    { platform: "LinkedIn", url: "https://linkedin.com/in/juanperez", iconName: "logoLinkedin" },
    { platform: "GitHub", url: "https://github.com/juanperez", iconName: "logoGithub" },
    { platform: "Twitter", url: "https://twitter.com/juanperez", iconName: "logoTwitter" },
  ];
  const techOptions = ["Vue.js", "React", "Angular", "Node.js", "Python", "TypeScript", "Laravel", "Django", "Go", "Rust"];
  form.projects = Array.from({ length: 3 }, () => {
    const numTechs = faker.number.int({ min: 2, max: 5 });
    const selectedTechs = faker.helpers.arrayElements(techOptions, numTechs).map(name => ({
      name,
      type: "icon" as const,
      source: "",
      size: "small" as const,
    }));
    
    return {
      img: "",
      title: faker.company.name(),
      status: faker.helpers.arrayElement(["progress", "indeterminate", "finished"]),
      technologies: selectedTechs,
      source: {
        img: "",
        name: faker.company.name(),
        url: faker.internet.url(),
      },
      details: {
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
      },
    };
  });
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
        projects: form.projects,
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

    // Stack files
    for (const [index, file] of Object.entries(sectionFiles.stack)) {
      formData.append(`stack_image_${index}`, file);
    }

    // Skills files
    for (const [key, file] of Object.entries(sectionFiles.skills)) {
      formData.append(`skill_image_${key}`, file);
    }

    // Experience files
    for (const [key, file] of Object.entries(sectionFiles.experience)) {
      formData.append(key, file);
    }

    // Projects files
    for (const [key, file] of Object.entries(sectionFiles.projects)) {
      formData.append(key, file);
    }

    // Certificates files
    for (const [key, file] of Object.entries(sectionFiles.certificates)) {
      formData.append(key, file);
    }

    // Freelance files
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
</script>

<style scoped>
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.social-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.social-row ion-item {
  flex: 1;
}
.image-preview {
  max-width: 100%;
  max-height: 120px;
  margin-top: 12px;
  border-radius: 8px;
}
input[type="file"] {
  margin-top: 8px;
}
.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
}
.nav-buttons ion-button {
  --margin-start: 0;
  --margin-end: 0;
}
</style>
