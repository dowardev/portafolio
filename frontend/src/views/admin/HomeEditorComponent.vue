<template>
  <form @submit.prevent="save" class="ion-padding">
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
        @click="addTag"
        :disabled="!newTag.trim()"
      >
        Agregar
      </ion-button>
    </ion-item>

    <ion-item class="ion-margin-top">
      <ion-label position="stacked">Descripción</ion-label>
      <ion-textarea
        v-model="form.description"
        rows="4"
        placeholder="Describe quién eres o qué haces"
      ></ion-textarea>
    </ion-item>

    <ion-item lines="none" class="ion-margin-top">
      <ion-label>Redes Sociales</ion-label>
      <ion-button slot="end" size="small" id="social-popover-trigger">
        <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Añadir
      </ion-button>
    </ion-item>

    <!-- Popover de redes sociales -->
    <ion-popover trigger="social-popover-trigger" :dismiss-on-select="true">
      <ion-content>
        <ion-list>
          <ion-item 
            v-for="social in filteredSocials" 
            :key="social.name" 
            button 
            @click="addSocial(social.name)"
          >
            <ion-icon :icon="social.icon" slot="start"></ion-icon>
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
        <ion-icon v-if="social.icon" :icon="social.icon" slot="start"></ion-icon>
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
        @change="onFileChange($event, 'logo')"
        class="ion-margin-top"
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
        @change="onFileChange($event, 'photo')"
        class="ion-margin-top"
      />
      <img
        v-if="preview.photo"
        :src="preview.photo"
        alt="Foto preview"
        class="image-preview"
      />
    </ion-item>

    <ion-button
      type="submit"
      expand="block"
      :disabled="saving"
      class="ion-margin-top"
    >
      <ion-spinner v-if="saving" slot="start"></ion-spinner>
      Guardar cambios
    </ion-button>

    <!-- Botón de datos de prueba (solo desarrollo) -->
    <ion-button
      v-if="isDev"
      expand="block"
      color="warning"
      class="ion-margin-top"
      @click="fillTestData"
    >
      Insertar datos de prueba
    </ion-button>
  </form>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonChip,
  IonIcon,
  IonSpinner,
  IonPopover,
  IonList,
  isPlatform,
} from "@ionic/vue";
import { ref, reactive, onMounted, computed } from "vue";
import {
  addOutline,
  closeOutline,
  saveOutline,
  trashOutline,
  logoFacebook,
  logoTwitter,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  logoTiktok,
  logoGithub,
  logoDiscord,
  logoTwitch,
  logoPinterest,
  logoSnapchat,
  logoReddit,
  logoWhatsapp,
  logoSkype,
  logoSlack,
  logoDribbble,
  logoBehance,
  logoMedium,
  logoWordpress,
  logoVimeo,
  logoSoundcloud,
  logoApple,
  logoGoogle,
  logoAmazon,
  logoPaypal,
  logoBitcoin,
  logoStackoverflow,
  logoSteam,
  logoXbox,
  logoPlaystation,
  logoTumblr,
  logoVk,
  logoWechat,
  logoX,
} from "ionicons/icons";
import homeApi, { HomePageData } from "@/services/homeApi";
import { ToastController } from "@/controllers/toastController";

const designElements = isPlatform("ios") ? "ios" : "md";
const toastController = new ToastController();
const saving = ref(false);
const newTag = ref("");
const isDev = import.meta.env.DEV;

// Lista de redes sociales disponibles con sus iconos
const availableSocials = [
  { name: "Facebook", icon: logoFacebook },
  { name: "X", icon: logoX },
  { name: "Twitter", icon: logoTwitter },
  { name: "Instagram", icon: logoInstagram },
  { name: "LinkedIn", icon: logoLinkedin },
  { name: "YouTube", icon: logoYoutube },
  { name: "TikTok", icon: logoTiktok },
  { name: "GitHub", icon: logoGithub },
  { name: "Discord", icon: logoDiscord },
  { name: "Twitch", icon: logoTwitch },
  { name: "Pinterest", icon: logoPinterest },
  { name: "Snapchat", icon: logoSnapchat },
  { name: "Reddit", icon: logoReddit },
  { name: "WhatsApp", icon: logoWhatsapp },
  { name: "WeChat", icon: logoWechat },
  { name: "Skype", icon: logoSkype },
  { name: "Slack", icon: logoSlack },
  { name: "Dribbble", icon: logoDribbble },
  { name: "Behance", icon: logoBehance },
  { name: "Medium", icon: logoMedium },
  { name: "WordPress", icon: logoWordpress },
  { name: "Vimeo", icon: logoVimeo },
  { name: "SoundCloud", icon: logoSoundcloud },
  { name: "Apple", icon: logoApple },
  { name: "Google", icon: logoGoogle },
  { name: "Amazon", icon: logoAmazon },
  { name: "PayPal", icon: logoPaypal },
  { name: "Bitcoin", icon: logoBitcoin },
  { name: "Stack Overflow", icon: logoStackoverflow },
  { name: "Steam", icon: logoSteam },
  { name: "Xbox", icon: logoXbox },
  { name: "PlayStation", icon: logoPlaystation },
  { name: "Tumblr", icon: logoTumblr },
  { name: "VK", icon: logoVk },
];

// Computed para filtrar redes ya seleccionadas
const filteredSocials = computed(() => {
  const selectedPlatforms = form.socials.map((s) => s.platform.toLowerCase());
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
});

const preview = reactive({
  logo: "",
  photo: "",
});

const files = reactive({
  logo: null as File | null,
  photo: null as File | null,
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
  const icon = social ? social.icon : "";
  form.socials.push({ platform, url: "", icon });
}

function removeSocial(index: number) {
  form.socials.splice(index, 1);
}

function onFileChange(event: Event, type: "logo" | "photo") {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  console.log(`File selected for ${type}:`, file.name, file.size);
  files[type] = file;
  preview[type] = URL.createObjectURL(file);
  console.log(`Preview for ${type}:`, preview[type]);
}

function fillTestData() {
  form.name = "Juan Pérez";
  form.tags = ["Desarrollador", "Full-Stack", "Vue.js", "Laravel"];
  form.description = "Desarrollador Full-Stack con más de 5 años de experiencia en el desarrollo de aplicaciones web y móviles. Especializado en Vue.js, Laravel y bases de datos relacionales.";
  form.socials = [
    { platform: "LinkedIn", url: "https://linkedin.com/in/juanperez", icon: logoLinkedin },
    { platform: "GitHub", url: "https://github.com/juanperez", icon: logoGithub },
    { platform: "Twitter", url: "https://twitter.com/juanperez", icon: logoTwitter },
  ];
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
      }),
    );
    
    // Verificar y añadir archivos
    console.log("files.logo:", files.logo);
    console.log("files.photo:", files.photo);
    
    if (files.logo) {
      const logoFile = files.logo as File;
      console.log("Adding logo:", logoFile.name, logoFile.size, logoFile.type);
      formData.append("logo", logoFile);
    }
    if (files.photo) {
      const photoFile = files.photo as File;
      console.log("Adding photo:", photoFile.name, photoFile.size, photoFile.type);
      formData.append("photo", photoFile);
    }
    
    // Verificar contenido del FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData[${key}]: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`FormData[${key}]: ${value}`);
      }
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
</style>
