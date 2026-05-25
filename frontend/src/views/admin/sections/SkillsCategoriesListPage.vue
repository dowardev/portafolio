<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <ion-title>Categorías de Skills</ion-title>

      <ion-buttons slot="end">
        <ion-button
          v-if="isDev"
          v-tooltip="{ content: 'Datos de prueba', delay: [500, 0], touch: 'hold' }"
          color="tertiary"
          @click="generateTestSkillsCategories"
        >
          <ion-icon slot="start" :icon="bugOutline" color="warning"></ion-icon>
        </ion-button>

        <ion-button
          :disabled="saving || (skillData.length > 0 && !allValid)"
          @click="handleSave"
        >
          <ion-spinner v-if="saving" slot="start"></ion-spinner>
          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ion-breadcrumbs>
            <ion-breadcrumb>
              <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
            </ion-breadcrumb>

            <ion-breadcrumb>Skills editor</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-col>
      </ion-row>
    </ion-grid>

    <div v-if="loading" class="ion-text-center ion-padding">
      <ion-spinner name="lines"></ion-spinner>
    </div>

    <div v-else-if="skillData.length === 0" class="empty-state">
      <p>No hay categorías de skills aún</p>

      <ion-button @click="addSkill">
        <ion-icon slot="start" :icon="addOutline"></ion-icon>
        Crear primera categoría
      </ion-button>
    </div>

    <template v-else>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ion-list>
            <ion-list-header>
              <ion-button :disabled="!allValid" @click="addSkill">
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Añadir
              </ion-button>
            </ion-list-header>

            <ion-card v-for="(item, index) in skillData" :key="index" class="shadow1">
              <ion-item lines="full">
                <ion-input
                  label="Nombre"
                  label-placement="floating"
                  :value="item.name"
                  placeholder="Ej: Vue.js"
                  :error-text="getError({ index, field: 'name' })"
                  :class="{
                    'ion-invalid': hasError({ index, field: 'name' }),
                    'ion-touched': touched[index]?.name,
                  }"
                  @ion-input="updateSkill({ index, field: 'name', value: $event.detail.value! })"
                  @ion-blur="touchField({ index, field: 'name' })"
                ></ion-input>
              </ion-item>

              <ion-item button lines="full" @click="openIconSelector({ index })">
                <template v-if="item.iconName">
                  <template v-if="isLineIconName(item.iconName)">
                    <Lineicons
                      slot="start"
                      :icon="getIconComponent(item.iconName)"
                      :color="getIconColor(item.iconName)"
                      :size="24"
                    />
                  </template>

                  <ion-icon
                    v-else
                    slot="start"
                    :icon="getIconSvg(item.iconName)"
                    :style="{ color: getIconColor(item.iconName), fontSize: '24px' }"
                  />
                </template>

                <template v-else>
                  <ion-label>Seleccionar icono</ion-label>
                </template>

                <ion-note v-if="item.iconName" slot="end">Cambiar</ion-note>
                <ion-note v-else slot="end">Seleccionar</ion-note>
              </ion-item>

              <span v-if="hasError({ index, field: 'iconName' })" class="error">
                {{ getError({ index, field: "iconName" }) }}
              </span>

              <ion-item lines="none">
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  @click="removeSkill({ index })"
                >
                  <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                  Eliminar
                </ion-button>
              </ion-item>
            </ion-card>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </template>

  <ion-modal :is-open="showSelector" @did-dismiss="showSelector = false">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar style="--background: var(--ion-background-color)">
          <ion-buttons slot="start">
            <ion-button @click="showSelector = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Seleccionar icono</ion-title>

          <ion-buttons slot="end">
            <ion-button id="type-trigger">
              <ion-icon slot="icon-only" :icon="filterOutline" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar style="--background: var(--ion-background-color)">
          <ion-searchbar
            v-model="searchText"
            placeholder="Buscar..."
          ></ion-searchbar>
        </ion-toolbar>

        <ion-popover
          :trigger="'type-trigger'"
          side="bottom"
          alignment="center"
          :mode="designMode"
        >
          <ion-content>
            <ion-list>
              <ion-item button @click="selectedType = 'all'">
                <ion-label :color="selectedType === 'all' ? 'primary' : ''"
                  >Todos</ion-label
                >
              </ion-item>
              <ion-item button @click="selectedType = 'tech'">
                <ion-label :color="selectedType === 'tech' ? 'primary' : ''"
                  >Tecnologías</ion-label
                >
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>

        <ion-toolbar style="--background: var(--ion-background-color)">
          <div class="ion-padding-start ion-padding-end">
            <ion-segment v-model="selectedSource" :mode="designMode">
              <ion-segment-button value="all">
                <ion-label>Todos</ion-label>
              </ion-segment-button>
              <ion-segment-button value="ionicons">
                <ion-label>IonIcons</ion-label>
              </ion-segment-button>
              <ion-segment-button value="lineicons">
                <ion-label>LineIcons</ion-label>
              </ion-segment-button>
            </ion-segment>
          </div>
        </ion-toolbar>
      </ion-header>

      <ion-content :scroll-y="false">
        <div style="display: flex; flex-direction: column; height: 100%">
          <ion-list style="overflow: hidden">
            <ion-card class="shadow1" style="overflow: auto; height: 96%">
              <ion-item
                v-for="icon in filteredIcons"
                :key="icon.name"
                lines="full"
                button
                :color="selectedIconName === icon.name ? 'light' : ''"
                @click="selectIcon(icon.name)"
              >
                <template v-if="icon.source === 'lineicons'">
                  <Lineicons
                    slot="start"
                    :icon="icon.icon"
                    :color="icon.color"
                    :size="24"
                  />
                </template>
                <ion-icon
                  v-else
                  slot="start"
                  :icon="icon.icon"
                  :style="{ color: icon.color, fontSize: '24px' }"
                />

                <ion-label>
                  {{ icon.label }}
                </ion-label>

                <ion-note v-if="selectedSource === 'all'" slot="end">
                  ({{ icon.source }})
                </ion-note>
              </ion-item>
            </ion-card>
          </ion-list>
        </div>
      </ion-content>
    </ion-modal>
  </ion-content>
</ion-page>
</template>

<script setup lang="ts">
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonPopover,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import {
  addOutline,
  closeOutline,
  saveOutline,
  trashOutline,
  bugOutline,
  filterOutline,
} from "ionicons/icons";
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { faker } from "@faker-js/faker";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import {
  getIconsBySourceAndType,
  getIconByName,
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/composables/iconsIndex";
import SkillsCategoriesController from "@/controllers/skillsCategoriesController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import SystemController from "@/controllers/systemController";
import { DesignMode } from "@/utils/types";

interface SkillFormItem {
  id?: number;
  name: string;
  iconName: string;
}

const systemController = new SystemController();
const skillsCategoriesController = new SkillsCategoriesController();
const { can, guard } = usePermissionGuard();
const router = useRouter();

const saving = ref(false);
const loading = ref(true);
const touched = reactive<Record<number, Record<string, boolean>>>({});
const isDev = import.meta.env.DEV;

const skillData = ref<SkillFormItem[]>([]);

const rules = {
  items: {
    $each: helpers.forEach({
      name: {
        required: helpers.withMessage("Nombre es requerido", required),
      },
      iconName: {
        required: helpers.withMessage("Icono es requerido", required),
      },
    }),
  },
};

const v$ = useVuelidate(rules, { items: computed(() => skillData.value) });

const allValid = computed(() => {
  if (skillData.value.length === 0) return true;
  return !v$.value.$invalid;
});

function hasError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return touched[index]?.[field] === true && errors?.length > 0;
}

function getError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = v$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!touched[index]) touched[index] = {};
  touched[index][field] = true;
}

function addSkill() {
  skillData.value = [...skillData.value, { name: "", iconName: "" }];
}

function updateSkill(params: {
  index: number;
  field: keyof SkillFormItem;
  value: string;
}) {
  const { index, field, value } = params;
  const updated = [...skillData.value];
  updated[index] = { ...updated[index], [field]: value };
  skillData.value = updated;
}

async function removeSkill(params: { index: number }) {
  const { index } = params;
  const item = skillData.value[index];
  if (item?.id) {
    if (!can({ permission: 'skills-categories.delete' })) {
      await guard({ permission: 'skills-categories.delete' });
      return;
    }
    const alert = await alertController.create({
      header: "Eliminar categoría",
      message: `¿Estás seguro de eliminar "${item.name}"?`,
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          role: "destructive",
          handler: async () => {
            const ok = await skillsCategoriesController.deleteSkillsCategorySave(item.id);
            if (ok) {
              delete touched[index];
              skillData.value = skillData.value.filter((_, i) => i !== index);
            }
          },
        },
      ],
    });
    await alert.present();
  } else {
    delete touched[index];
    skillData.value = skillData.value.filter((_, i) => i !== index);
  }
}

onMounted(async () => {
  try {
    const data = await skillsCategoriesController.loadSkillsCategories();
    skillData.value = (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      iconName: item.iconName || "",
    }));
  } catch (error) {
    console.error("Error loading skills categories:", error);
  } finally {
    loading.value = false;
  }
});

async function handleSave() {
  const canCreate = can({ permission: 'skills-categories.create' });
  const canUpdate = can({ permission: 'skills-categories.update' });
  if (!canCreate && !canUpdate) {
    await guard({ permission: 'skills-categories.update' });
    return;
  }

  v$.value.$touch();
  if (v$.value.$invalid) return;

  saving.value = true;
  let success = true;
  try {
    for (const skill of skillData.value) {
      if (skill.id) {
        if (!canUpdate) continue;
        const ok = await skillsCategoriesController.updateSkillsCategorySave(skill.id, skill);
        if (!ok) success = false;
      } else {
        if (!canCreate) continue;
        const ok = await skillsCategoriesController.addSkillsCategorySave(skill);
        if (!ok) success = false;
      }
    }
    if (success) {
      await skillsCategoriesController.reloadSkillsCategories();
    }
    router.push("/admin-panel");
  } catch (error) {
    console.error("Error saving skills categories:", error);
  } finally {
    saving.value = false;
  }
}

async function generateTestSkillsCategories() {
  const iconNames = [
    "logoVue", "logoReact", "logoNode", "logoPython",
    "logoAndroid", "logoAmazon", "logoEdge", "logoChrome",
  ];

  const testData = Array.from({ length: 3 }, () => ({
    name: faker.word.noun(),
    iconName: faker.helpers.arrayElement(iconNames),
  }));

  for (const skill of testData) {
    await skillsCategoriesController.addSkillsCategorySave(skill);
  }

  const data = await skillsCategoriesController.reloadSkillsCategories();
  skillData.value = (data || []).map(
    (item) => ({
      id: item.id,
      name: item.name,
      iconName: item.iconName || "",
    }),
  );
}

const showSelector = ref(false);
const searchText = ref("");
const selectedSource = ref<string>("all");
const selectedType = ref<string>("all");
const selectedIconName = ref("");
const designMode = ref<DesignMode>(systemController.getdesignMode());
let currentIndex = -1;

const icons = computed(() =>
  getIconsBySourceAndType(
    selectedSource.value as "ionicons" | "lineicons" | "all",
    selectedType.value as "social" | "tech" | "all",
  ),
);

const filteredIcons = computed(() => {
  const list = searchText.value
    ? icons.value.filter(
        (icon) =>
          icon.label.toLowerCase().includes(searchText.value.toLowerCase()) ||
          icon.name.toLowerCase().includes(searchText.value.toLowerCase()),
      )
    : icons.value;
  return [...list].sort((a, b) => a.label.localeCompare(b.label, "es"));
});

function openIconSelector(params: { index: number }) {
  const { index } = params;
  currentIndex = index;
  selectedIconName.value = skillData.value[index]?.iconName || "";
  showSelector.value = true;
}

function selectIcon(name: string) {
  if (currentIndex >= 0) {
    const updated = [...skillData.value];
    updated[currentIndex] = { ...updated[currentIndex], iconName: name };
    skillData.value = updated;
    touchField({ index: currentIndex, field: "iconName" });
  }
  showSelector.value = false;
}

function isLineIconName(name: string): boolean {
  return isLineIcon(name);
}

function getIconSvg(name: string): string | undefined {
  return getIonIconSvg(name);
}

function getIconComponent(name: string): object | undefined {
  return getLineIconComponent(name);
}

function getIconColor(name: string): string {
  const icon = getIconByName(name);
  return icon?.color || "#666666";
}
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
  font-size: 12px;
  padding: 0 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--ion-color-medium);
}
</style>
