# Skills Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a unified admin panel editor where stacks and their techs are managed inline in a single page.

**Architecture:** New `SkillsEditorPage.vue` replaces `AdminStackPage.vue` + `TechListPage.vue` + `StackEditor.vue`. Each stack card is expandable to reveal its techs. Save iterates all items sequentially. A temporary `_tempId` maps new stacks to their real IDs from the API.

**Tech Stack:** Ionic 8 + Vue 3 (Composition API), Pinia, Vuelidate, Laravel 11

---

### Task 1: Update StackController to return created stack

**Files:**
- Modify: `frontend/src/controllers/stackController.ts:58-86`
- Test: manual verification via save flow

- [ ] **Step 1: Add `createStack` method to StackController**

Add a method that creates a stack and returns the created object (including its new ID), without showing a toast:

```ts
async createStack(stack: StackItem): Promise<StackItem | null> {
  try {
    const payload: Record<string, unknown> = {
      name: stack.name,
      icon_name: stack.iconName || null,
    };
    const response = await getApiConnector().post<StackResponse>("admin/stacks", payload);
    await this.reloadStack();
    return response.stack;
  } catch (error) {
    console.error("Error creating stack:", error);
    return null;
  }
}
```

- [ ] **Step 2: Verify the method compiles**

Run: `cd frontend && pnpm run build 2>&1 | head -30`
Expected: No errors in stackController.ts

---

### Task 2: Create SkillsEditorPage.vue

**Files:**
- Create: `frontend/src/views/admin/sections/SkillsEditorPage.vue`

- [ ] **Step 1: Write the template**

```vue
<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>Skills</ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="saving || !allValid"
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
          <ion-col size="12" size-md="8" size-lg="6">
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

      <div v-else-if="stacks.length === 0" class="empty-state">
        <p>No hay stacks aún</p>
        <ion-button @click="addStack">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          Crear primer stack
        </ion-button>
      </div>

      <template v-else>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="8" size-lg="6">
              <ion-list>
                <ion-list-header>
                  <ion-button :disabled="!allValid" @click="addStack">
                    <ion-icon slot="start" :icon="addOutline"></ion-icon>
                    Añadir stack
                  </ion-button>
                </ion-list-header>

                <ion-card
                  v-for="(stack, sIndex) in stacks"
                  :key="stack._tempId"
                  class="shadow1 stack-card"
                >
                  <ion-item lines="full" button @click="toggleStack(sIndex)">
                    <ion-icon
                      slot="start"
                      :icon="expanded[sIndex] ? chevronDownOutline : chevronForwardOutline"
                    />
                    <template v-if="stack.iconName">
                      <template v-if="isLineIconName(stack.iconName)">
                        <Lineicons
                          slot="start"
                          :icon="getIconComponent(stack.iconName)"
                          :color="getIconColor(stack.iconName)"
                          :size="24"
                        />
                      </template>
                      <ion-icon
                        v-else
                        slot="start"
                        :icon="getIconSvg(stack.iconName)"
                        :style="{ color: getIconColor(stack.iconName), fontSize: '24px' }"
                      />
                    </template>
                    <ion-label>{{ stack.name || 'Sin nombre' }}</ion-label>
                    <ion-note slot="end">{{ (stack.techs || []).length }} techs</ion-note>
                  </ion-item>

                  <div v-if="expanded[sIndex]">
                    <ion-item lines="full">
                      <ion-input
                        label="Nombre del stack"
                        label-placement="floating"
                        :value="stack.name"
                        placeholder="Ej: Frontend"
                        :error-text="getStackError({ index: sIndex, field: 'name' })"
                        :class="{
                          'ion-invalid': hasStackError({ index: sIndex, field: 'name' }),
                          'ion-touched': stackTouched[sIndex]?.name,
                        }"
                        @ion-input="updateStack({ index: sIndex, field: 'name', value: $event.detail.value! })"
                        @ion-blur="touchStackField({ index: sIndex, field: 'name' })"
                      />
                    </ion-item>

                    <ion-item
                      button
                      lines="full"
                      @click="openStackIconSelector({ index: sIndex })"
                    >
                      <template v-if="stack.iconName">
                        <template v-if="isLineIconName(stack.iconName)">
                          <Lineicons
                            slot="start"
                            :icon="getIconComponent(stack.iconName)"
                            :color="getIconColor(stack.iconName)"
                            :size="24"
                          />
                        </template>
                        <ion-icon
                          v-else
                          slot="start"
                          :icon="getIconSvg(stack.iconName)"
                          :style="{ color: getIconColor(stack.iconName), fontSize: '24px' }"
                        />
                        <ion-label :style="{ color: getIconColor(stack.iconName) }">
                          {{ getIconLabel(stack.iconName) }}
                        </ion-label>
                      </template>
                      <template v-else>
                        <ion-label>Seleccionar icono</ion-label>
                      </template>
                      <ion-note v-if="stack.iconName" slot="end">Cambiar</ion-note>
                      <ion-note v-else slot="end">Seleccionar</ion-note>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-button
                        slot="end"
                        fill="clear"
                        color="danger"
                        @click="removeStack({ index: sIndex })"
                      >
                        <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                        Eliminar stack
                      </ion-button>
                    </ion-item>

                    <ion-item lines="full">
                      <ion-label class="techs-label">Tecnologías</ion-label>
                    </ion-item>

                    <div v-for="(tech, tIndex) in stack.techs" :key="tech._tempId" class="tech-item">
                      <ion-item lines="full">
                        <ion-input
                          label="Nombre"
                          label-placement="floating"
                          :value="tech.name"
                          placeholder="Ej: Vue.js"
                          :error-text="getTechError({ sIndex, tIndex, field: 'name' })"
                          :class="{
                            'ion-invalid': hasTechError({ sIndex, tIndex, field: 'name' }),
                            'ion-touched': techTouched[`${sIndex}-${tIndex}`]?.name,
                          }"
                          @ion-input="updateTech({ sIndex, tIndex, field: 'name', value: $event.detail.value! })"
                          @ion-blur="touchTechField({ sIndex, tIndex, field: 'name' })"
                        />
                      </ion-item>

                      <ion-item
                        button
                        lines="full"
                        @click="openTechIconSelector({ sIndex, tIndex })"
                      >
                        <template v-if="tech.iconName">
                          <template v-if="isLineIconName(tech.iconName)">
                            <Lineicons
                              slot="start"
                              :icon="getIconComponent(tech.iconName)"
                              :color="getIconColor(tech.iconName)"
                              :size="24"
                            />
                          </template>
                          <ion-icon
                            v-else
                            slot="start"
                            :icon="getIconSvg(tech.iconName)"
                            :style="{ color: getIconColor(tech.iconName), fontSize: '24px' }"
                          />
                          <ion-label :style="{ color: getIconColor(tech.iconName) }">
                            {{ getIconLabel(tech.iconName) }}
                          </ion-label>
                        </template>
                        <template v-else>
                          <ion-label>Seleccionar icono</ion-label>
                        </template>
                        <ion-note v-if="tech.iconName" slot="end">Cambiar</ion-note>
                        <ion-note v-else slot="end">Seleccionar</ion-note>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-button
                          slot="end"
                          fill="clear"
                          color="danger"
                          size="small"
                          @click="removeTech({ sIndex, tIndex })"
                        >
                          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                          Eliminar
                        </ion-button>
                      </ion-item>
                    </div>

                    <ion-item lines="none">
                      <ion-button
                        fill="clear"
                        size="small"
                        @click="addTech({ sIndex })"
                      >
                        <ion-icon slot="start" :icon="addOutline"></ion-icon>
                        Añadir tecnología
                      </ion-button>
                    </ion-item>
                  </div>
                </ion-card>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>

    <ion-modal :is-open="showStackIconSelector" @did-dismiss="showStackIconSelector = false">
      <icon-selector-content
        :selected-icon-name="selectedIconName"
        @select="selectStackIcon"
        @close="showStackIconSelector = false"
      />
    </ion-modal>

    <ion-modal :is-open="showTechIconSelector" @did-dismiss="showTechIconSelector = false">
      <icon-selector-content
        :selected-icon-name="selectedIconName"
        @select="selectTechIcon"
        @close="showTechIconSelector = false"
      />
    </ion-modal>
  </ion-page>
</template>
```

- [ ] **Step 2: Write the script setup**

```vue
<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonBreadcrumb,
  IonBreadcrumbs,
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
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import {
  addOutline,
  chevronDownOutline,
  chevronForwardOutline,
  saveOutline,
  trashOutline,
} from "ionicons/icons";
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import {
  getIconsBySourceAndType,
  getIconByName,
  getIonIconSvg,
  getLineIconComponent,
  isLineIcon,
} from "@/composables/iconsIndex";
import StackController from "@/controllers/stackController";
import TechController from "@/controllers/techController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import SystemController from "@/controllers/systemController";
import IconSelectorContent from "@/components/common/IconSelectorContent.vue";
import type { StackItem } from "@/services/types";
import { getApiConnector } from "@/apiConnector";
import { DesignMode } from "@/utils/types";

interface StackFormItem {
  _tempId: string;
  id?: string;
  name: string;
  iconName: string;
  sort_order?: number;
  techs: TechFormItem[];
}

interface TechFormItem {
  _tempId: string;
  id?: number;
  name: string;
  iconName: string;
}

interface StackResponse {
  stack: StackItem;
}

const systemController = new SystemController();
const stackController = new StackController();
const techController = new TechController();
const { can, guard } = usePermissionGuard();
const router = useRouter();

const saving = ref(false);
const loading = ref(true);
const designMode = ref<DesignMode>(systemController.getdesignMode());

let tempIdCounter = 0;
function nextTempId(): string {
  return `_temp_${++tempIdCounter}`;
}

const stacks = ref<StackFormItem[]>([]);
const expanded = ref<Record<number, boolean>>({});
const deletedStackIds = ref<string[]>([]);
const deletedTechIds = ref<number[]>([]);

const stackTouched = reactive<Record<number, Record<string, boolean>>>({});
const techTouched = reactive<Record<string, Record<string, boolean>>>({});

const stackRules = {
  items: {
    $each: helpers.forEach({
      name: { required: helpers.withMessage("Nombre es requerido", required) },
    }),
  },
};

const techRules = {
  items: {
    $each: helpers.forEach({
      name: { required: helpers.withMessage("Nombre es requerido", required) },
    }),
  },
};

const allTechItems = computed(() => stacks.value.flatMap((s) => s.techs));

const stackV$ = useVuelidate(stackRules, { items: computed(() => stacks.value) });
const techV$ = useVuelidate(techRules, { items: allTechItems });

const allValid = computed(() => {
  if (stacks.value.length === 0) return true;
  return !stackV$.value.$invalid && !techV$.value.$invalid;
});

function hasStackError(params: { index: number; field: string }): boolean {
  const { index, field } = params;
  const errors = stackV$.value.items.$each.$response.$errors[index]?.[field];
  return stackTouched[index]?.[field] === true && errors?.length > 0;
}

function getStackError(params: { index: number; field: string }): string {
  const { index, field } = params;
  const errors = stackV$.value.items.$each.$response.$errors[index]?.[field];
  return errors?.[0]?.$message || "";
}

function touchStackField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!stackTouched[index]) stackTouched[index] = {};
  stackTouched[index][field] = true;
}

function hasTechError(params: { sIndex: number; tIndex: number; field: string }): boolean {
  const { sIndex, tIndex, field } = params;
  let flatIndex = 0;
  for (let i = 0; i < sIndex; i++) {
    flatIndex += (stacks.value[i]?.techs || []).length;
  }
  flatIndex += tIndex;
  const errors = techV$.value.items.$each.$response.$errors[flatIndex]?.[field];
  const key = `${sIndex}-${tIndex}`;
  return techTouched[key]?.[field] === true && errors?.length > 0;
}

function getTechError(params: { sIndex: number; tIndex: number; field: string }): string {
  const { sIndex, tIndex, field } = params;
  let flatIndex = 0;
  for (let i = 0; i < sIndex; i++) {
    flatIndex += (stacks.value[i]?.techs || []).length;
  }
  flatIndex += tIndex;
  const errors = techV$.value.items.$each.$response.$errors[flatIndex]?.[field];
  return errors?.[0]?.$message || "";
}

function touchTechField(params: { sIndex: number; tIndex: number; field: string }) {
  const { sIndex, tIndex, field } = params;
  const key = `${sIndex}-${tIndex}`;
  if (!techTouched[key]) techTouched[key] = {};
  techTouched[key][field] = true;
}

function toggleStack(index: number) {
  expanded.value = { ...expanded.value, [index]: !expanded.value[index] };
}

function addStack() {
  stacks.value = [
    ...stacks.value,
    {
      _tempId: nextTempId(),
      name: "",
      iconName: "",
      techs: [],
    },
  ];
}

function updateStack(params: {
  index: number;
  field: string;
  value: string;
}) {
  const { index, field, value } = params;
  const updated = [...stacks.value];
  updated[index] = { ...updated[index], [field]: value };
  stacks.value = updated;
}

async function removeStack(params: { index: number }) {
  const { index } = params;
  const stack = stacks.value[index];
  if (stack.id) {
    const alert = await alertController.create({
      header: "Eliminar stack",
      message: `¿Estás seguro de eliminar "${stack.name}"? Las tecnologías asociadas también se eliminarán.`,
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          role: "destructive",
          handler: () => {
            deletedStackIds.value = [...deletedStackIds.value, stack.id!];
            stacks.value = stacks.value.filter((_, i) => i !== index);
          },
        },
      ],
    });
    await alert.present();
  } else {
    stacks.value = stacks.value.filter((_, i) => i !== index);
  }
}

function addTech(params: { sIndex: number }) {
  const { sIndex } = params;
  const updated = [...stacks.value];
  updated[sIndex] = {
    ...updated[sIndex],
    techs: [
      ...(updated[sIndex].techs || []),
      { _tempId: nextTempId(), name: "", iconName: "" },
    ],
  };
  stacks.value = updated;
}

function updateTech(params: {
  sIndex: number;
  tIndex: number;
  field: string;
  value: string;
}) {
  const { sIndex, tIndex, field, value } = params;
  const updated = [...stacks.value];
  const techs = [...updated[sIndex].techs];
  techs[tIndex] = { ...techs[tIndex], [field]: value };
  updated[sIndex] = { ...updated[sIndex], techs };
  stacks.value = updated;
}

async function removeTech(params: { sIndex: number; tIndex: number }) {
  const { sIndex, tIndex } = params;
  const tech = stacks.value[sIndex].techs[tIndex];
  const updated = [...stacks.value];
  if (tech.id) {
    deletedTechIds.value = [...deletedTechIds.value, tech.id];
  }
  updated[sIndex] = {
    ...updated[sIndex],
    techs: updated[sIndex].techs.filter((_, i) => i !== tIndex),
  };
  stacks.value = updated;
}

async function handleSave() {
  const canCreateStack = can({ permission: 'stacks.create' });
  const canUpdateStack = can({ permission: 'stacks.update' });
  const canCreateTech = can({ permission: 'techs.create' });
  const canUpdateTech = can({ permission: 'techs.update' });
  const canDeleteStack = can({ permission: 'stacks.delete' });
  const canDeleteTech = can({ permission: 'techs.delete' });

  if (!canCreateStack && !canUpdateStack && !canCreateTech && !canUpdateTech) {
    await guard({ permission: 'techs.update' });
    return;
  }

  stackV$.value.$touch();
  techV$.value.$touch();
  if (stackV$.value.$invalid || techV$.value.$invalid) return;

  saving.value = true;
  try {
    for (const id of deletedStackIds.value) {
      if (!canDeleteStack) continue;
      await getApiConnector().delete(`admin/stacks/${id}`);
    }
    deletedStackIds.value = [];

    for (const id of deletedTechIds.value) {
      if (!canDeleteTech) continue;
      await getApiConnector().delete(`admin/techs/${id}`);
    }
    deletedTechIds.value = [];

    for (const stack of stacks.value) {
      if (stack.id) {
        if (!canUpdateStack) continue;
        await getApiConnector().post(`admin/stacks/${stack.id}`, {
          name: stack.name,
          icon_name: stack.iconName || null,
        });
      } else {
        if (!canCreateStack) continue;
        const res = await getApiConnector().post<StackResponse>("admin/stacks", {
          name: stack.name,
          icon_name: stack.iconName || null,
        });
        stack.id = res.stack.id;
      }
    }

    for (const stack of stacks.value) {
      if (!stack.id) continue;
      for (const tech of stack.techs) {
        const payload: Record<string, unknown> = {
          name: tech.name,
          icon_name: tech.iconName || null,
          stack_id: stack.id,
        };
        if (tech.id) {
          if (!canUpdateTech) continue;
          await getApiConnector().post(`admin/techs/${tech.id}`, payload);
        } else {
          if (!canCreateTech) continue;
          await getApiConnector().post("admin/techs", payload);
        }
      }
    }

    await stackController.loadStack();
    await techController.reloadTechs();
    router.push("/admin-panel");
  } catch (error) {
    console.error("Error saving skills:", error);
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const data = await stackController.loadStack();
    stacks.value = (data || []).map((stack) => ({
      _tempId: nextTempId(),
      id: stack.id,
      name: stack.name,
      iconName: stack.iconName || "",
      sort_order: stack.sort_order,
      techs: (stack.techs || []).map((tech) => ({
        _tempId: nextTempId(),
        id: tech.id,
        name: tech.name,
        iconName: tech.iconName || "",
      })),
    }));
  } catch (error) {
    console.error("Error loading stacks:", error);
  } finally {
    loading.value = false;
  }
});

// Icon selector state (reused for both stack and tech icon selection)
const showStackIconSelector = ref(false);
const showTechIconSelector = ref(false);
const selectedIconName = ref("");
let iconSelectorStackIndex = -1;
let iconSelectorTechIndex = -1;

function openStackIconSelector(params: { index: number }) {
  const { index } = params;
  iconSelectorStackIndex = index;
  iconSelectorTechIndex = -1;
  selectedIconName.value = stacks.value[index]?.iconName || "";
  showStackIconSelector.value = true;
}

function openTechIconSelector(params: { sIndex: number; tIndex: number }) {
  const { sIndex, tIndex } = params;
  iconSelectorStackIndex = sIndex;
  iconSelectorTechIndex = tIndex;
  selectedIconName.value = stacks.value[sIndex]?.techs[tIndex]?.iconName || "";
  showTechIconSelector.value = true;
}

function selectStackIcon(name: string) {
  if (iconSelectorStackIndex >= 0) {
    updateStack({ index: iconSelectorStackIndex, field: "iconName", value: name });
    touchStackField({ index: iconSelectorStackIndex, field: "iconName" });
  }
  showStackIconSelector.value = false;
}

function selectTechIcon(name: string) {
  if (iconSelectorStackIndex >= 0 && iconSelectorTechIndex >= 0) {
    updateTech({
      sIndex: iconSelectorStackIndex,
      tIndex: iconSelectorTechIndex,
      field: "iconName",
      value: name,
    });
    touchTechField({
      sIndex: iconSelectorStackIndex,
      tIndex: iconSelectorTechIndex,
      field: "iconName",
    });
  }
  showTechIconSelector.value = false;
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

function getIconLabel(name: string): string {
  const icon = getIconByName(name);
  return icon?.label || name;
}
</script>
```

- [ ] **Step 3: Write the scoped styles**

```vue
<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--ion-color-medium);
}

.stack-card {
  margin-bottom: 16px;
}

.tech-item {
  padding-left: 24px;
  border-left: 2px solid var(--ion-color-light-shade);
  margin-left: 16px;
}

.techs-label {
  font-weight: 600;
  font-size: 0.85rem;
  padding-left: 16px;
}
</style>
```

- [ ] **Step 4: Create IconSelectorContent.vue shared component**

The icon selector modal content is duplicated across StackEditor, TechListPage, and will be needed in SkillsEditorPage. Extract it into a reusable component:

Create: `frontend/src/components/common/IconSelectorContent.vue`

```vue
<template>
  <ion-content>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-button @click="$emit('close')">
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
        <ion-searchbar v-model="searchText" placeholder="Buscar..."></ion-searchbar>
      </ion-toolbar>

      <ion-popover trigger="type-trigger" side="bottom" alignment="center" :mode="designMode">
        <ion-content>
          <ion-list>
            <ion-item button @click="selectedType = 'all'">
              <ion-label :color="selectedType === 'all' ? 'primary' : ''">Todos</ion-label>
            </ion-item>
            <ion-item button @click="selectedType = 'tech'">
              <ion-label :color="selectedType === 'tech' ? 'primary' : ''">Tecnologías</ion-label>
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

    <div style="display: flex; flex-direction: column; height: 100%; padding-top: 130px">
      <ion-list style="overflow: hidden">
        <ion-card class="shadow1" style="overflow: auto; height: 96%">
          <ion-item
            v-for="icon in filteredIcons"
            :key="icon.name"
            lines="full"
            button
            :color="selectedIconName === icon.name ? 'light' : ''"
            @click="$emit('select', icon.name)"
          >
            <template v-if="icon.source === 'lineicons'">
              <Lineicons slot="start" :icon="icon.icon" :color="icon.color" :size="24" />
            </template>
            <ion-icon
              v-else
              slot="start"
              :icon="icon.icon"
              :style="{ color: icon.color, fontSize: '24px' }"
            />
            <ion-label>{{ icon.label }}</ion-label>
            <ion-note v-if="selectedSource === 'all'" slot="end">({{ icon.source }})</ion-note>
          </ion-item>
        </ion-card>
      </ion-list>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { closeOutline, filterOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { Lineicons } from "@lineiconshq/vue-lineicons";
import {
  getIconsBySourceAndType,
  getIconByName,
} from "@/composables/iconsIndex";
import SystemController from "@/controllers/systemController";
import { DesignMode } from "@/utils/types";

const props = defineProps<{
  selectedIconName: string;
}>();

defineEmits<{
  (e: "select", name: string): void;
  (e: "close"): void;
}>();

const systemController = new SystemController();
const designMode = ref<DesignMode>(systemController.getdesignMode());

const searchText = ref("");
const selectedSource = ref<string>("all");
const selectedType = ref<string>("all");

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
</script>
```

---

### Task 3: Update AdminEditorPage to wire in SkillsEditorPage

**Files:**
- Modify: `frontend/src/views/admin/AdminEditorPage.vue`

- [ ] **Step 1: Replace AdminStackPage import and usage with SkillsEditorPage**

```vue
<template>
  <ion-page>
    <AdminInfoPage v-if="$route.params.section === 'info'" />
    <SkillsEditorPage v-if="$route.params.section === 'skills'" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from "@ionic/vue";

import AdminInfoPage from "./sections/AdminInfoPage.vue";
import SkillsEditorPage from "./sections/SkillsEditorPage.vue";
</script>
```

---

### Task 4: Update AdminHomeMenu — combine Stack + Techs into Skills

**Files:**
- Modify: `frontend/src/views/admin/AdminHomeMenu.vue:243-258`

- [ ] **Step 1: Replace "Stack" and "Techs" menu entries with a single "Skills" entry**

Replace the two entries (lines 243-258) with one:

```ts
  {
    section: "skills",
    label: "Skills",
    icon: codeSlashOutline,
    route: "/admin-panel/skills",
    color: "#4ECB71",
    permissions: ['stacks.create', 'stacks.update', 'stacks.delete', 'techs.create', 'techs.update', 'techs.delete'],
  },
```

Also remove the `barChartOutline` import since it's no longer used:

```ts
// Remove from imports:
//   barChartOutline,
```

---

### Task 5: Update router

**Files:**
- Modify: `frontend/src/router/index.ts:75,226-229,316`

- [ ] **Step 1: Import SkillsEditorPage and add route, remove TechListPage route guard and route**

Add import:
```ts
import SkillsEditorPage from "@/views/admin/sections/SkillsEditorPage.vue";
```

Replace the `TechListPage` route guard entry (line 75):
```ts
  SkillsEditorPage: { permissions: ['stacks.create', 'stacks.update', 'stacks.delete', 'techs.create', 'techs.update', 'techs.delete'] },
```

Replace the route (lines 226-229):
```ts
  {
    path: "/admin-panel/skills",
    name: "SkillsEditorPage",
    component: SkillsEditorPage,
  },
```

Remove `TechListPage` from the `adminRoutes` array (line 316):
```ts
// Remove this line:
//   "TechListPage",
```

---

### Task 6: Update TechController backend validation

**Files:**
- Modify: `backend/app/Http/Controllers/Admin/TechController.php:33,58`

- [ ] **Step 1: Make stack_id required in store method**

Change `'stack_id' => 'nullable|exists:stacks,id'` to `'stack_id' => 'required|exists:stacks,id'` in the `store` method.

- [ ] **Step 2: Make stack_id required in update method**

Same change in the `update` method.

---

### Task 7: Delete old files

**Files:**
- Delete: `frontend/src/views/admin/sections/AdminStackPage.vue`
- Delete: `frontend/src/views/admin/sections/TechListPage.vue`
- Delete: `frontend/src/views/admin/editors/StackEditor.vue`

- [ ] **Step 1: Remove the old files**

```bash
rm frontend/src/views/admin/sections/AdminStackPage.vue
rm frontend/src/views/admin/sections/TechListPage.vue
rm frontend/src/views/admin/editors/StackEditor.vue
```

---

### Task 8: Verify build

- [ ] **Step 1: Run the build**

```bash
cd frontend && pnpm run build
```

Expected: Build succeeds with no errors.
