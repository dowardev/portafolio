<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Información</ion-label>
    </ion-list-header>

    <ion-card class="shadow1">
      <ion-item lines="full">
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input
          :value="name"
          placeholder="Tu nombre o título"
          :error-text="v$.name.$errors[0]?.$message.toString()"
          :class="{
            'ion-invalid': v$.name.$invalid && v$.name.$dirty,
            'ion-touched': v$.name.$dirty,
          }"
          @ion-input="emit('update:name', $event.detail.value || '')"
          @ion-blur="v$.name.$touch()"
        ></ion-input>
      </ion-item>

      <ion-item lines="full">
        <ion-label position="stacked">Descripción</ion-label>
        <ion-textarea
          :value="description"
          :rows="4"
          placeholder="Describe quién eres o qué haces"
          :error-text="v$.description.$errors[0]?.$message.toString()"
          :class="{
            'ion-invalid':
              v$.description.$invalid && v$.description.$dirty,
            'ion-touched': v$.description.$dirty,
          }"
          @ion-input="emit('update:description', $event.detail.value || '')"
          @ion-blur="v$.description.$touch()"
        ></ion-textarea>
      </ion-item>
    </ion-card>
  </ion-list>

  <ion-list>
    <ion-list-header>
      <ion-label>Etiquetas</ion-label>

      <ion-button @click="isAddTagAlertOpen = true">
        <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
      </ion-button>

      <ion-button @click="isReorderModalOpen = true">
        <ion-icon slot="icon-only" :icon="reorderThreeOutline"></ion-icon>
      </ion-button>
    </ion-list-header>

    <ion-card class="shadow1">
      <ion-card-content>
        <div class="chips-container">
          <ion-chip
            v-for="(tagItem, tagIndex) in tags"
            :key="(tagItem.id || tagItem.name || tagIndex) + '-' + tagIndex"
            color="primary"
          >
            <ion-label>{{ tagItem.name }}</ion-label>
            <ion-icon
              :icon="closeOutline"
              @click="removeTag(tagIndex)"
            ></ion-icon>
          </ion-chip>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-list>

  <IconSelector
    :model-value="socials"
    type="social"
    show-url-input
    @update:model-value="emit('update:socials', $event.map((item: any) => ({ platform: item.iconName, url: item.url || '', iconName: item.iconName })))"
  />

  <ion-list>
    <ion-list-header>
      <ion-label>Visual</ion-label>
    </ion-list-header>

    <ion-card class="shadow1">
      <section>
        <ion-item
          lines="full"
          button
          @click="openFileDialog('logo')"
        >
          <ion-label>Logo</ion-label>

          <ion-note v-if="fileNames.logo" slot="end">{{
            fileNames.logo
          }}</ion-note>
          <ion-note v-else slot="end">Seleccionar</ion-note>
        </ion-item>

        <input
          ref="logoInputRef"
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFileChange($event, 'logo')"
        />
      </section>

      <section>
        <ion-item
          lines="full"
          button
          @click="openFileDialog('photo')"
        >
          <ion-label>Foto (Cover)</ion-label>

          <ion-note v-if="fileNames.photo" slot="end">{{
            fileNames.photo
          }}</ion-note>

          <ion-note v-else slot="end">Seleccionar</ion-note>
        </ion-item>

        <input
          ref="photoInputRef"
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFileChange($event, 'photo')"
        />
      </section>
    </ion-card>
  </ion-list>

  <ion-list>
    <ion-list-header>
      <ion-label>Otras opciones</ion-label>
    </ion-list-header>

    <ion-card class="shadow1">
      <ion-item>
        <ion-label>Mostrar botón de contacto (sección info)</ion-label>
        <ion-note slot="end">Junto a redes sociales</ion-note>

        <ion-toggle
          slot="end"
          :checked="showContactForm.socials"
          @ion-change="updateShowContactForm('socials', $event.detail.checked)"
        ></ion-toggle>
      </ion-item>

      <ion-item>
        <ion-label>Mostrar botón de contacto (freelance)</ion-label>
        <ion-note slot="end">En sección de plataformas</ion-note>

        <ion-toggle
          slot="end"
          :checked="showContactForm.freelance"
          @ion-change="updateShowContactForm('freelance', $event.detail.checked)"
        ></ion-toggle>
      </ion-item>
    </ion-card>
  </ion-list>

  <ion-modal :is-open="isReorderModalOpen" @did-dismiss="onReorderDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-title>Reordenar etiquetas</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="closeReorderModal">
            Cerrar
          </ion-button>
          <ion-button color="primary" @click="saveReorder">Guardar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-reorder-group :disabled="false" @ion-item-reorder="handleReorder">
          <ion-item v-for="localTagItem in localTags" :key="localTagItem.id">
            <ion-label>{{ localTagItem.label }}</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      </ion-list>
    </ion-content>
  </ion-modal>

  <ion-alert
    :is-open="isAddTagAlertOpen"
    header="Agregar etiqueta"
    :inputs="[
      { name: 'tag', type: 'text', placeholder: 'Etiqueta', value: newTag },
    ]"
    :buttons="addTagAlertButtons"
    @did-dismiss="onAlertDismiss"
  />
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonReorder,
  IonReorderGroup,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import { addOutline, closeOutline, reorderThreeOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import { computed, reactive, ref, onMounted } from "vue";
import IconSelector from "@/components/admin/IconSelector.vue";

interface SocialItem {
  platform: string;
  url: string;
  iconName: string;
}

interface LocalTag {
  id: string;
  label: string;
}

interface ReorderEventDetail {
  from: number;
  to: number;
  complete: (data?: boolean | LocalTag[]) => LocalTag[];
}

interface TagItem {
  id?: number;
  name: string;
  sort_order?: number;
}

const props = defineProps<{
  name: string;
  description: string;
  tags: TagItem[];
  socials: SocialItem[];
  showContactForm: { socials: boolean; freelance: boolean };
}>();

const emit = defineEmits<{
  "update:name": [value: string];
  "update:description": [value: string];
  "update:tags": [value: TagItem[]];
  "update:socials": [value: SocialItem[]];
  "update:show-contact-form": [value: { socials: boolean; freelance: boolean }];
  "file-change": [payload: { file: File; type: "logo" | "photo" }];
}>();

const isAddTagAlertOpen = ref(false);
const isReorderModalOpen = ref(false);
const fileNames = reactive<Record<string, string>>({});
const newTag = ref("");
let tagIdCounter = 0;
const logoInputRef = ref<HTMLInputElement | null>(null);
const photoInputRef = ref<HTMLInputElement | null>(null);

const localTags = ref<LocalTag[]>([]);

const addTagAlertButtons = computed(() => [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Agregar",
    role: "confirm",
    handler: (alertData: { tag?: string } | undefined) => {
      const tagValue = alertData?.tag ?? newTag.value;
      if (tagValue && tagValue.toString().trim()) {
        const trimmedValue = tagValue.toString().trim();
        const newTags = [...props.tags];
        const exists = newTags.some(t => t.name === trimmedValue);
        if (!exists) {
          newTags.push({ name: trimmedValue, sort_order: newTags.length });
          emit("update:tags", newTags);
        }
      }
      newTag.value = "";
    },
  },
]);

const alphaName = helpers.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/);

const v$ = useVuelidate(
  {
    name: {
      required: helpers.withMessage("El nombre es requerido", required),
      minLength: helpers.withMessage(
        "El nombre debe tener al menos 2 caracteres",
        minLength(2),
      ),
      maxLength: helpers.withMessage(
        "El nombre no puede exceder 50 caracteres",
        maxLength(50),
      ),
      alphaName: helpers.withMessage(
        "El nombre solo puede contener letras, espacios y guiones",
        alphaName,
      ),
    },
    description: {
      required: helpers.withMessage("La descripción es requerida", required),
      minLength: helpers.withMessage(
        "La descripción debe tener al menos 10 caracteres",
        minLength(10),
      ),
      maxLength: helpers.withMessage(
        "La descripción no puede exceder 500 caracteres",
        maxLength(500),
      ),
    },
  },
  { name: computed(() => props.name), description: computed(() => props.description) },
);

function createLocalTags(): LocalTag[] {
  return props.tags.map((tag) => ({
    id: `tag_${Date.now()}_${tagIdCounter++}`,
    label: tag.name,
  }));
}

function onFileChange(event: Event, type: "logo" | "photo") {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  fileNames[type] = file.name;
  emit("file-change", { file, type });
  input.value = "";
}

function openFileDialog(type: "logo" | "photo") {
  const input = type === "logo" ? logoInputRef.value : photoInputRef.value;
  input?.click();
}

function removeTag(index: number) {
  const newTags = [...props.tags];
  newTags.splice(index, 1);
  emit("update:tags", newTags);
}

function closeReorderModal() {
  isReorderModalOpen.value = false;
  localTags.value = createLocalTags();
}

function onReorderDismiss() {
  closeReorderModal();
}

function onAlertDismiss() {
  isAddTagAlertOpen.value = false;
  newTag.value = "";
}

function handleReorder(reorderEvent: CustomEvent<ReorderEventDetail>) {
  const detail = reorderEvent.detail as ReorderEventDetail;
  const { from: originIndex, to: destinationIndex, complete } = detail;

  try {
    const reorderResult = complete(localTags.value);
    if (Array.isArray(reorderResult)) {
      if (reorderResult.length && typeof reorderResult[0] === "string") {
        const labelMapping = new Map(
          localTags.value.map((localTag) => [localTag.label, localTag]),
        );
        localTags.value = (reorderResult as unknown as string[]).map((label) =>
          labelMapping.get(label) || {
            id: `tag_${Date.now()}_${tagIdCounter++}`,
            label,
          },
        );
      } else {
        localTags.value = (reorderResult as unknown as LocalTag[]).slice();
      }
    }
  } catch {
    if (originIndex !== destinationIndex) {
      const movedTag = localTags.value.splice(originIndex, 1)[0];
      localTags.value.splice(destinationIndex, 0, movedTag);
    }
    try {
      complete(false);
    } catch {
      // ignore
    }
  }
}

function saveReorder() {
  const reorderedTags = localTags.value.map((localTag, index) => ({
    name: localTag.label,
    sort_order: index,
  }));
  emit("update:tags", reorderedTags);
  isReorderModalOpen.value = false;
}

function updateShowContactForm(key: "socials" | "freelance", value: boolean) {
  emit("update:show-contact-form", {
    ...props.showContactForm,
    [key]: value,
  });
}

async function handleSubmit(): Promise<boolean> {
  const isValid = await v$.value.$validate();
  return isValid;
}

defineExpose({ handleSubmit });

onMounted(() => {
  localTags.value = createLocalTags();
});
</script>

<style scoped>
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
input[type="file"] {
  margin-top: 8px;
}
</style>