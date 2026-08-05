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
        <ion-label position="stacked">Username</ion-label>
        <ion-input
          :value="username"
          placeholder="@usuario"
          @ion-input="emit('update:username', $event.detail.value || '')"
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
            'ion-invalid': v$.description.$invalid && v$.description.$dirty,
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

      <ion-button @click="addLink">
        <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
      </ion-button>

      <ion-button @click="isReorderModalOpen = true">
        <ion-icon slot="icon-only" :icon="reorderThreeOutline"></ion-icon>
      </ion-button>
    </ion-list-header>

    <ion-card
      v-for="(linkItem, linkIndex) in tags"
      :key="linkIndex"
      class="shadow1"
    >
      <ion-item lines="full">
        <ion-input
          label="Nombre"
          label-placement="floating"
          :value="linkItem.name"
          :error-text="getLinkError({ index: linkIndex, field: 'name' })"
          :class="{
            'ion-invalid': hasLinkError({ index: linkIndex, field: 'name' }),
            'ion-touched': touched[linkIndex]?.name,
          }"
          @ion-input="updateLink({ index: linkIndex, field: 'name', value: $event.detail.value || '' })"
          @ion-blur="touchLinkField({ index: linkIndex, field: 'name' })"
        ></ion-input>
      </ion-item>

      <ion-item lines="full">
        <ion-input
          label="URL"
          label-placement="floating"
          :value="linkItem.url"
          :error-text="getLinkError({ index: linkIndex, field: 'url' })"
          :class="{
            'ion-invalid': hasLinkError({ index: linkIndex, field: 'url' }),
            'ion-touched': touched[linkIndex]?.url,
          }"
          @ion-input="updateLink({ index: linkIndex, field: 'url', value: $event.detail.value || '' })"
          @ion-blur="touchLinkField({ index: linkIndex, field: 'url' })"
        ></ion-input>
      </ion-item>

      <ion-item lines="none">
        <ion-button
          slot="end"
          fill="clear"
          color="danger"
          size="small"
          @click="removeLink(linkIndex)"
        >
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Eliminar
        </ion-button>
      </ion-item>
    </ion-card>
  </ion-list>

  <IconSelector
    :model-value="socials"
    type="social"
    show-url-input
    @update:model-value="
      emit(
        'update:socials',
        $event.map((item: any) => ({
          platform: item.iconName,
          url: item.url || '',
          iconName: item.iconName,
        })),
      )
    "
  />

  <ion-list>
    <ion-list-header>
      <ion-label>Visual</ion-label>
    </ion-list-header>

    <ion-card class="shadow1">
      <section>
        <ion-item lines="full" button @click="openFileDialog('logo')">
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
        <ion-item lines="full" button @click="openFileDialog('photo')">
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
          @ion-change="
            updateShowContactForm('freelance', $event.detail.checked)
          "
        ></ion-toggle>
      </ion-item>

      <ion-item lines="full">
        <ion-label>Mostrar footer</ion-label>

        <ion-toggle
          slot="end"
          :checked="showFooter"
          @ion-change="emit('update:show-footer', $event.detail.checked)"
        ></ion-toggle>
      </ion-item>

      <ion-item v-if="showFooter" lines="full">
        <ion-label position="stacked">Contenido del footer</ion-label>
        <ion-textarea
          :value="footerContent"
          :rows="3"
          placeholder="Texto personalizado (reemplaza el © por defecto)"
          :error-text="v$.footerContent.$errors[0]?.$message.toString()"
          :class="{
            'ion-invalid': v$.footerContent.$invalid && v$.footerContent.$dirty,
            'ion-touched': v$.footerContent.$dirty,
          }"
          @ion-input="emit('update:footer-content', $event.detail.value || '')"
          @ion-blur="v$.footerContent.$touch()"
        ></ion-textarea>
      </ion-item>
    </ion-card>
  </ion-list>

  <ion-modal :is-open="isReorderModalOpen" @did-dismiss="onReorderDismiss">
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeReorderModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Reordenar etiquetas</ion-title>

        <ion-buttons slot="end">
          <ion-button color="primary" @click="saveReorder">
            <ion-icon slot="icon-only" :icon="saveOutline"></ion-icon>
          </ion-button>
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
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
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
import { addOutline, closeOutline, reorderThreeOutline, saveOutline, trashOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { helpers, maxLength, minLength, required, url } from "@vuelidate/validators";
import { computed, reactive, ref, watch } from "vue";
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
  url?: string;
  sort_order?: number;
}

const props = defineProps<{
  name: string;
  username: string;
  description: string;
  tags: TagItem[];
  socials: SocialItem[];
  showFooter: boolean;
  footerContent: string | null;
  showContactForm: { socials: boolean; freelance: boolean };
}>();

const emit = defineEmits<{
  "update:name": [value: string];
  "update:username": [value: string];
  "update:description": [value: string];
  "update:tags": [value: TagItem[]];
  "update:socials": [value: SocialItem[]];
  "update:show-footer": [value: boolean];
  "update:footer-content": [value: string];
  "update:show-contact-form": [value: { socials: boolean; freelance: boolean }];
  "file-change": [payload: { file: File; type: "logo" | "photo" }];
}>();

const isReorderModalOpen = ref(false);
const fileNames = reactive<Record<string, string>>({});
let tagIdCounter = 0;
const logoInputRef = ref<HTMLInputElement | null>(null);
const photoInputRef = ref<HTMLInputElement | null>(null);

const localTags = ref<LocalTag[]>([]);

const touched = reactive<Record<number, Record<string, boolean>>>({});

function hasLinkError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.tags.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getLinkError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.tags.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchLinkField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addLink() {
  const newTags = [...props.tags];
  newTags.push({ name: '', url: '' });
  emit('update:tags', newTags);
}

function removeLink(index: number) {
  const newTags = [...props.tags];
  newTags.splice(index, 1);
  emit('update:tags', newTags);
}

function updateLink(params: { index: number; field: 'name' | 'url'; value: string }) {
  const { index, field, value } = params;
  const newTags = [...props.tags];
  newTags[index] = { ...newTags[index], [field]: value };
  emit('update:tags', newTags);
}

const alphaName = helpers.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/);

const rules = {
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
  tags: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("El nombre es requerido", required),
        minLength: helpers.withMessage("Mínimo 2 caracteres", minLength(2)),
      },
      url: {
        urlValid: helpers.withMessage("URL inválida", url),
      },
    }),
  },
  footerContent: {
    required: helpers.withMessage(
      "El contenido del footer es requerido cuando está visible",
      (val: string | null) => !props.showFooter || (val !== null && val.trim().length > 0),
    ),
    maxLength: helpers.withMessage(
      "El contenido del footer no puede exceder 1000 caracteres",
      maxLength(1000),
    ),
  },
};

const v$ = useVuelidate(rules, {
  name: computed(() => props.name),
  description: computed(() => props.description),
  tags: computed(() => props.tags),
  footerContent: computed(() => props.footerContent),
});

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

function closeReorderModal() {
  isReorderModalOpen.value = false;
  localTags.value = createLocalTags();
}

function onReorderDismiss() {
  closeReorderModal();
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
        localTags.value = (reorderResult as unknown as string[]).map(
          (label) =>
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
  const originalTags = props.tags || []
  const reorderedTags = localTags.value.map((localTag, index) => {
    const original = originalTags.find(t => t.id === Number(localTag.id) || t.name === localTag.label)
    return {
      id: original?.id,
      name: localTag.label,
      url: original?.url,
      sort_order: index,
    }
  })
  emit("update:tags", reorderedTags)
  isReorderModalOpen.value = false
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

// 7. Watch
watch(
  () => props.tags,
  () => {
    if (!isReorderModalOpen.value) {
      localTags.value = createLocalTags();
    }
  },
  { deep: true, immediate: true },
);

defineExpose({ handleSubmit });
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
