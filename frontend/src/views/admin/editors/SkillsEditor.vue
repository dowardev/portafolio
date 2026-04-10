<template>
  <div class="ion-padding">
    <template v-for="(category, catIndex) in modelValue" :key="catIndex">
      <ion-list>
        <ion-list-header>
          <ion-label>Categorías de Skills</ion-label>

          <ion-button :disabled="!allValid" @click="addCategory">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Añadir categoría
          </ion-button>
        </ion-list-header>

        <ion-card class="shadow1">
          <ion-item lines="full">
            <ion-input
              label="Nombre de categoría"
              label-placement="floating"
              :value="category.name"
              placeholder="Ej: Frameworks"
              :class="{ 'ion-invalid': hasCategoryError({ catIndex, field: 'name' }) }"
              @ion-input="updateCategory({ index: catIndex, field: 'name', value: $event.detail.value! })"
              @ion-blur="touchCategoryField({ catIndex, field: 'name' })"
            ></ion-input>
          </ion-item>

          <span v-if="hasCategoryError({ catIndex, field: 'name' })" class="error">
            Nombre de categoría es requerido
          </span>

          <ion-list>
            <ion-list-header>
              <ion-label>Tecnologías</ion-label>

              <ion-button
                :disabled="!isCategoryValid({ catIndex })"
                @click="addTechnology({ catIndex })"
              >
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Añadir
              </ion-button>
            </ion-list-header>
          </ion-list>

          <ion-card class="shadow2">
            <template
              v-for="(tech, techIndex) in category.technologies"
              :key="techIndex"
            >
              <ion-item lines="full">
                <ion-input
                  label="Nombre"
                  label-placement="floating"
                  :value="tech.name"
                  placeholder="Ej: Vue"
                  :class="{
                    'ion-invalid': hasTechError({ catIndex, techIndex, field: 'name' }),
                  }"
                  @ion-input="updateTechnology({ catIndex, techIndex, field: 'name', value: $event.detail.value! })"
                  @ion-blur="touchTechField({ catIndex, techIndex, field: 'name' })"
                ></ion-input>
              </ion-item>

              <span
                v-if="hasTechError({ catIndex, techIndex, field: 'name' })"
                class="error"
              >
                Nombre es requerido
              </span>

              <ion-item lines="full">
                <ion-select
                  label="Tipo"
                  interface="popover"
                  label-placement="floating"
                  :value="tech.type"
                  @ion-change="updateTechnology({ catIndex, techIndex, field: 'type', value: $event.detail.value })"
                >
                  <ion-select-option value="img">Imagen</ion-select-option>

                  <ion-select-option value="icon">Icono</ion-select-option>
                </ion-select>

                <!-- TODO: implmentar TechnologiesEditor -->
                <TechIconSelector
                  v-if="tech.type === 'icon'"
                  slot="end"
                  :model-value="tech.iconName"
                  label="Icono de tecnología"
                  @update:model-value="updateTechnology({ catIndex, techIndex, field: 'iconName', value: $event })"
                />

                <ion-button
                  v-if="tech.type === 'img' && !tech.image"
                  slot="end"
                  fill="clear"
                  @click="triggerFileInput({ event: $event, catIndex, techIndex })"
                >
                  Seleccionar
                </ion-button>
                <ion-button
                  v-if="tech.type === 'img' && tech.image"
                  slot="end"
                  fill="clear"
                  @click="previewImage({ imageUrl: tech.image })"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>

              <input
                :id="`fileInput-${catIndex}-${techIndex}`"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onFileChange({ event: $event, catIndex, techIndex })"
              />

              <ion-item lines="full">
                <ion-input
                  label="Tamaño"
                  label-placement="floating"
                  :value="tech.size"
                  placeholder="24px"
                  @ion-input="updateTechnology({ catIndex, techIndex, field: 'size', value: $event.detail.value! })"
                ></ion-input>
              </ion-item>

              <ion-item lines="none">
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  size="small"
                  @click="removeTechnology({ catIndex, techIndex })"
                >
                  <ion-icon :icon="trashOutline"></ion-icon>
                  Eliminar tecnología
                </ion-button>
              </ion-item>
            </template>

            <ion-modal :is-open="previewModalIsOpen">
              <ion-header class="ion-no-border" mode="ios">
                <ion-toolbar>
                  <ion-buttons>
                    <ion-button @click="closePreviewModal">
                      <ion-icon :icon="closeOutline"></ion-icon>
                    </ion-button>
                  </ion-buttons>

                  <ion-title>Previsualización</ion-title>
                </ion-toolbar>
              </ion-header>

              <ion-content class="ion-padding">
                <div class="ion-text-center">
                  <img
                    :src="previewImageUrl"
                    alt="Previsualización"
                    class="preview-image"
                  />
                </div>
              </ion-content>
            </ion-modal>
          </ion-card>

          <ion-button
            fill="clear"
            color="danger"
            expand="block"
            @click="removeCategory({ index: catIndex })"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
            Eliminar categoría
          </ion-button>
        </ion-card>
      </ion-list>
    </template>
  </div>
</template>

<script setup lang="ts">
// imports
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonModal,
} from "@ionic/vue";
import {
  addOutline,
  closeOutline,
  eyeOutline,
  trashOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";
import type { SkillCategory } from "@/services/homeApi";
import TechIconSelector from "./TechIconSelector.vue";
// end imports

// props and emits
const props = defineProps<{
  modelValue: SkillCategory[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SkillCategory[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();
// end props and emits

// vars and const
const pendingFiles: Record<string, File> = {};
const categoryTouched = reactive<Record<string, boolean>>({});
const techTouched = reactive<Record<string, boolean>>({});
const previewModalIsOpen = ref(false);
const previewImageUrl = ref("");
// end vars and const

// computed
const allValid = computed(() => {
  if (props.modelValue.length === 0) return true;
  return props.modelValue.every((cat) => {
    if (!cat.name?.trim()) return false;
    return cat.technologies.every((tech) => {
      if (!tech.name?.trim()) return false;
      if (tech.type === "img" && !tech.image) return false;
      if (tech.type === "icon" && !tech.iconName) return false;
      return true;
    });
  });
});
// end computed

// functions
function hasCategoryError(params: { catIndex: number; field: string }): boolean {
  const { catIndex, field } = params;
  const key = `${catIndex}_${field}`;
  const cat = props.modelValue[catIndex];
  return categoryTouched[key] && !cat?.[field as keyof SkillCategory];
}

function touchCategoryField(params: { catIndex: number; field: string }) {
  const { catIndex, field } = params;
  categoryTouched[`${catIndex}_${field}`] = true;
}

function hasTechError(params: {
  catIndex: number;
  techIndex: number;
  field: string;
}): boolean {
  const { catIndex, techIndex, field } = params;
  const key = `${catIndex}_${techIndex}_${field}`;
  const tech = props.modelValue[catIndex]?.technologies[techIndex];
  return techTouched[key] && !tech?.[field as keyof typeof tech];
}

function touchTechField(params: { catIndex: number; techIndex: number; field: string }) {
  const { catIndex, techIndex, field } = params;
  techTouched[`${catIndex}_${techIndex}_${field}`] = true;
}

function isCategoryValid(params: { catIndex: number }): boolean {
  const { catIndex } = params;
  const cat = props.modelValue[catIndex];
  if (!cat?.name?.trim()) return false;
  return cat.technologies.every((tech) => {
    if (!tech.name?.trim()) return false;
    if (tech.type === "img" && !tech.image) return false;
    if (tech.type === "icon" && !tech.iconName) return false;
    return true;
  });
}

function addCategory() {
  emit("update:modelValue", [
    ...props.modelValue,
    {
      name: "",
      technologies: [
        { name: "", image: "", iconName: "", size: "24px", type: "icon" },
      ],
    },
  ]);
}

function updateCategory(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeCategory(params: { index: number }) {
  const { index } = params;
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}

function addTechnology(params: { catIndex: number }) {
  const { catIndex } = params;
  const updated = [...props.modelValue];
  updated[catIndex] = {
    ...updated[catIndex],
    technologies: [
      ...updated[catIndex].technologies,
      { name: "", image: "", iconName: "", size: "24px", type: "icon" },
    ],
  };
  emit("update:modelValue", updated);
}

function updateTechnology(
  params: { catIndex: number; techIndex: number; field: string; value: string },
) {
  const { catIndex, techIndex, field, value } = params;
  const updated = [...props.modelValue];
  const techs = [...updated[catIndex].technologies];
  techs[techIndex] = { ...techs[techIndex], [field]: value };
  updated[catIndex] = { ...updated[catIndex], technologies: techs };
  emit("update:modelValue", updated);
}

function onFileChange(params: { event: Event; catIndex: number; techIndex: number }) {
  const { event, catIndex, techIndex } = params;
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  const key = `${catIndex}_${techIndex}`;
  pendingFiles[key] = file;
  const objectUrl = URL.createObjectURL(file);
  updateTechnology({ catIndex, techIndex, field: "image", value: objectUrl });
  emit("update:files", { ...pendingFiles });
  techTouched[`${catIndex}_${techIndex}_image`] = true;
}

function removeTechnology(params: { catIndex: number; techIndex: number }) {
  const { catIndex, techIndex } = params;
  const key = `${catIndex}_${techIndex}`;
  delete pendingFiles[key];
  emit("update:files", { ...pendingFiles });
  const updated = [...props.modelValue];
  updated[catIndex] = {
    ...updated[catIndex],
    technologies: updated[catIndex].technologies.filter(
      (_, i) => i !== techIndex,
    ),
  };
  emit("update:modelValue", updated);
}

function triggerFileInput(params: { event: Event; catIndex: number; techIndex: number }) {
  const { event, catIndex, techIndex } = params;
  event.preventDefault();
  const fileInput = document.querySelector(
    `#fileInput-${catIndex}-${techIndex}`,
  ) as HTMLInputElement;
  fileInput.click();
}

function previewImage(params: { imageUrl: string }) {
  const { imageUrl } = params;
  previewImageUrl.value = imageUrl;
  previewModalIsOpen.value = true;
}

function closePreviewModal() {
  previewModalIsOpen.value = false;
  previewImageUrl.value = "";
}
// end functions
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.ion-invalid {
  --border-color: var(--ion-color-danger);
}
</style>
