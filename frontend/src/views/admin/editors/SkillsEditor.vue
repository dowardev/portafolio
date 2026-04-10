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
              :class="{ 'ion-invalid': hasCategoryError(catIndex, 'name') }"
              @ion-input="
                updateCategory(catIndex, 'name', $event.detail.value!)
              "
              @ion-blur="touchCategoryField(catIndex, 'name')"
            ></ion-input>
          </ion-item>

          <span v-if="hasCategoryError(catIndex, 'name')" class="error">
            Nombre de categoría es requerido
          </span>

          <ion-list>
            <ion-list-header>
              <ion-label>Tecnologías</ion-label>

              <ion-button
                :disabled="!isCategoryValid(catIndex)"
                @click="addTechnology(catIndex)"
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
                    'ion-invalid': hasTechError(catIndex, techIndex, 'name'),
                  }"
                  @ion-input="
                    updateTechnology(
                      catIndex,
                      techIndex,
                      'name',
                      $event.detail.value!,
                    )
                  "
                  @ion-blur="touchTechField(catIndex, techIndex, 'name')"
                ></ion-input>
              </ion-item>

              <span
                v-if="hasTechError(catIndex, techIndex, 'name')"
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
                  @ion-change="
                    updateTechnology(
                      catIndex,
                      techIndex,
                      'type',
                      $event.detail.value,
                    )
                  "
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
                  @update:model-value="
                    updateTechnology(catIndex, techIndex, 'iconName', $event)
                  "
                />

                <ion-button
                  v-if="tech.type === 'img' && !tech.image"
                  slot="end"
                  fill="clear"
                  @click="triggerFileInput($event, catIndex, techIndex)"
                >
                  Seleccionar
                </ion-button>
                <ion-button
                  v-if="tech.type === 'img' && tech.image"
                  slot="end"
                  fill="clear"
                  @click="previewImage(tech.image)"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>

              <input
                :id="`fileInput-${catIndex}-${techIndex}`"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onFileChange($event, catIndex, techIndex)"
              />

              <ion-item lines="full">
                <ion-input
                  label="Tamaño"
                  label-placement="floating"
                  :value="tech.size"
                  placeholder="24px"
                  @ion-input="
                    updateTechnology(
                      catIndex,
                      techIndex,
                      'size',
                      $event.detail.value!,
                    )
                  "
                ></ion-input>
              </ion-item>

              <ion-item lines="none">
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  size="small"
                  @click="removeTechnology(catIndex, techIndex)"
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
            @click="removeCategory(catIndex)"
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

const props = defineProps<{
  modelValue: SkillCategory[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SkillCategory[]): void;
  (e: "update:files", files: Record<string, File>): void;
}>();

const pendingFiles: Record<string, File> = {};
const categoryTouched = reactive<Record<string, boolean>>({});
const techTouched = reactive<Record<string, boolean>>({});
const previewModalIsOpen = ref(false);
const previewImageUrl = ref("");

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

function hasCategoryError(catIndex: number, field: string): boolean {
  const key = `${catIndex}_${field}`;
  const cat = props.modelValue[catIndex];
  return categoryTouched[key] && !cat?.[field as keyof SkillCategory];
}

function touchCategoryField(catIndex: number, field: string) {
  categoryTouched[`${catIndex}_${field}`] = true;
}

function hasTechError(
  catIndex: number,
  techIndex: number,
  field: string,
): boolean {
  const key = `${catIndex}_${techIndex}_${field}`;
  const tech = props.modelValue[catIndex]?.technologies[techIndex];
  return techTouched[key] && !tech?.[field as keyof typeof tech];
}

function touchTechField(catIndex: number, techIndex: number, field: string) {
  techTouched[`${catIndex}_${techIndex}_${field}`] = true;
}

function isCategoryValid(catIndex: number): boolean {
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

function updateCategory(index: number, field: string, value: string) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit("update:modelValue", updated);
}

function removeCategory(index: number) {
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index),
  );
}

function addTechnology(catIndex: number) {
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
  catIndex: number,
  techIndex: number,
  field: string,
  value: string,
) {
  const updated = [...props.modelValue];
  const techs = [...updated[catIndex].technologies];
  techs[techIndex] = { ...techs[techIndex], [field]: value };
  updated[catIndex] = { ...updated[catIndex], technologies: techs };
  emit("update:modelValue", updated);
}

function onFileChange(event: Event, catIndex: number, techIndex: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  const key = `${catIndex}_${techIndex}`;
  pendingFiles[key] = file;
  const objectUrl = URL.createObjectURL(file);
  updateTechnology(catIndex, techIndex, "image", objectUrl);
  emit("update:files", { ...pendingFiles });
  techTouched[`${catIndex}_${techIndex}_image`] = true;
}

function removeTechnology(catIndex: number, techIndex: number) {
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

function triggerFileInput($event: Event, catIndex: number, techIndex: number) {
  $event.preventDefault();
  const fileInput = document.querySelector(
    `#fileInput-${catIndex}-${techIndex}`,
  ) as HTMLInputElement;
  fileInput.click();
}

function previewImage(imageUrl: string) {
  previewImageUrl.value = imageUrl;
  previewModalIsOpen.value = true;
}

function closePreviewModal() {
  previewModalIsOpen.value = false;
  previewImageUrl.value = "";
}
</script>

<style scoped>
.category-item {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
}

.tech-item {
  border: 1px solid var(--ion-color-medium-tint);
  border-radius: 6px;
  padding: 6px;
  margin: 8px 0;
}

.preview-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
  min-height: 40px;
}

.tech-preview {
  max-width: 40px;
  max-height: 40px;
}

.file-upload {
  padding: 8px 16px;
}

.upload-label {
  display: block;
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}

.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.ion-invalid {
  --border-color: var(--ion-color-danger);
}
</style>
