<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ isEditing ? 'Editar stack' : 'Nuevo stack' }}</ion-title>

        <ion-buttons slot="end">
          <ion-button :disabled="saving || form.techs.length === 0" @click="handleSave">
            <ion-spinner v-if="saving" slot="icon-only"></ion-spinner>
            <ion-icon v-else slot="icon-only" :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <AdminBreadcrumbs
        :items="[
          { label: 'Panel', to: { name: 'PanelAdminPage' } },
          { label: 'Skills', to: { name: 'SkillsListPage' } },
          { label: isEditing ? 'Editar' : 'Nuevo' },
        ]"
      />

      <div v-if="loading" class="ion-text-center ion-padding">
        <ion-spinner name="lines"></ion-spinner>
      </div>

      <template v-else>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="8" size-lg="6">
              <ion-card class="shadow1">
                <ion-card-header>
                  <ion-card-title>Stack</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                  <ion-input
                    helper-text=" "
                    label="Nombre del stack"
                    label-placement="floating"
                    :value="form.name"
                    placeholder="Ej: Frontend"
                    :error-text="getNameError()"
                    :class="{
                      'ion-invalid': getNameError() !== '',
                      'ion-touched': formTouched.name,
                    }"
                    @ion-input="updateField({ field: 'name', value: $event.detail.value! })"
                    @ion-blur="touchField({ field: 'name' })"
                  />

                  <ion-item button lines="full" @click="openIconSelector">
                    <template v-if="form.iconName">
                      <template v-if="isLineIconName(form.iconName)">
                        <Lineicons
                          slot="start"
                          :icon="getIconComponent(form.iconName)"
                          :color="getIconColor(form.iconName)"
                          :size="24"
                        />
                      </template>
                      <ion-icon
                        v-else
                        slot="start"
                        :icon="getIconSvg(form.iconName)"
                        :style="{ color: getIconColor(form.iconName), fontSize: '24px' }"
                      />
                      <ion-label :style="{ color: getIconColor(form.iconName) }">
                        {{ getIconLabel(form.iconName) }}
                      </ion-label>
                    </template>
                    <template v-else>
                      <ion-label>Seleccionar icono</ion-label>
                    </template>
                    <ion-note v-if="form.iconName" slot="end">Cambiar</ion-note>
                    <ion-note v-else slot="end">Seleccionar</ion-note>
                  </ion-item>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="8" size-lg="6">
              <ion-list class="shadow1">
                <ion-list-header>
                  <ion-label>
                    Tecnologías
                    <ion-note>({{ form.techs.length }})</ion-note>
                  </ion-label>

                  <ion-button
                    fill="clear"
                    size="small"
                    :disabled="!canAddTech"
                    @click="addTech"
                  >
                    <ion-icon slot="start" :icon="addOutline"></ion-icon>
                    Añadir tecnología
                  </ion-button>
                </ion-list-header>

                <div v-if="form.techs.length === 0" class="empty-techs">
                  <p>Añade al menos una tecnología</p>
                </div>

                <ion-reorder-group :disabled="false" @ion-item-reorder="handleTechReorder">
                  <ion-card
                    v-for="(tech, tIndex) in form.techs"
                    :key="tech._tempId"
                    class="shadow1"
                  >
                    <ion-card-content>
                      <ion-input
                        label="Nombre"
                        label-placement="floating"
                        helper-text=" "
                        :value="tech.name"
                        placeholder="Ej: Vue.js"
                        :error-text="getTechError({ index: tIndex })"
                        :class="{
                          'ion-invalid': hasTechError({ index: tIndex }),
                          'ion-touched': techTouched[tIndex]?.name,
                        }"
                        @ion-input="
                          updateTechField({
                            index: tIndex,
                            field: 'name',
                            value: $event.detail.value!,
                          })
                        "
                        @ion-blur="touchTechField({ index: tIndex, field: 'name' })"
                      />

                      <ion-item
                        button
                        lines="full"
                        @click="openTechIconSelector({ index: tIndex })"
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
                        <ion-reorder slot="end"></ion-reorder>
                        <ion-button
                          slot="end"
                          fill="clear"
                          color="danger"
                          size="small"
                          @click="removeTech({ index: tIndex })"
                        >
                          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
                          Eliminar
                        </ion-button>
                      </ion-item>
                    </ion-card-content>
                  </ion-card>
                </ion-reorder-group>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>

    <ion-modal :is-open="showIconSelectorModal" @did-dismiss="showIconSelectorModal = false">
      <IconSelectorContent
        :selected-icon-name="iconSelectorValue"
        @select="selectIcon"
        @close="showIconSelectorModal = false"
      />
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
  IonModal,
  IonNote,
  IonPage,
  IonRow,
  IonReorder,
  IonReorderGroup,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue';
import type { ItemReorderEventDetail } from '@ionic/vue';
import { addOutline, chevronBackOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { reactive, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { required, helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { Lineicons } from '@lineiconshq/vue-lineicons';
import { getIonIconSvg, getLineIconComponent, isLineIcon, getIconByName } from '@/utils/iconsIndex';
import { ToastController } from '@/controllers/toastController';
import StackController from '@/controllers/stackController';
import TechController from '@/controllers/techController';
import IconSelectorContent from '@/components/common/IconSelectorContent.vue';
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs.vue';
import type { TechItem } from '@/services/types';

interface TechFormItem {
  _tempId: string;
  id?: number;
  name: string;
  iconName: string;
}

const route = useRoute();
const router = useRouter();
const toastController = new ToastController();
const stackController = new StackController();
const techController = new TechController();

const stackId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!stackId.value);

const saving = ref(false);
const loading = ref(isEditing.value);

let tempIdCounter = 0;
function nextTempId(): string {
  return `_temp_${++tempIdCounter}`;
}

const form = reactive<{
  name: string;
  iconName: string;
  techs: TechFormItem[];
}>({
  name: '',
  iconName: '',
  techs: [],
});

const deletedTechIds = ref<number[]>([]);

const formTouched = reactive<Record<string, boolean>>({});
const techTouched = reactive<Record<number, Record<string, boolean>>>({});

const canAddTech = computed(() => form.techs.every((tech) => tech.name.trim() !== ''));

const rules = {
  name: { required: helpers.withMessage('Nombre es requerido', required) },
};

const v$ = useVuelidate(rules, form);

const techRules = {
  items: {
    $each: helpers.forEach({
      name: { required: helpers.withMessage('Nombre es requerido', required) },
    }),
  },
};

const techV$ = useVuelidate(techRules, { items: computed(() => form.techs) });

function getNameError(): string {
  if (!formTouched.name) return '';
  const errors = v$.value.$errors;
  const msg = errors[0]?.$message;
  return typeof msg === 'string' ? msg : (msg?.valueOf() as string) || '';
}

onIonViewWillEnter(async () => {
  form.name = '';
  form.iconName = '';
  form.techs = [];
  deletedTechIds.value = [];
  formTouched.name = false;
  for (const key of Object.keys(techTouched)) {
    delete techTouched[Number(key)];
  }
  tempIdCounter = 0;

  if (!isEditing.value) {
    loading.value = false;
    return;
  }

  try {
    const stack = await stackController.getStack({ id: stackId.value! });
    if (stack) {
      form.name = stack.name;
      form.iconName = stack.iconName || '';
      form.techs = (stack.techs || []).map((tech: TechItem) => ({
        _tempId: nextTempId(),
        id: tech.id,
        name: tech.name,
        iconName: tech.iconName || '',
      }));
    }
  } catch (error) {
    console.error('Error loading stack:', error);
  } finally {
    loading.value = false;
  }
});

function updateField(params: { field: string; value: string }) {
  const { field, value } = params;
  (form as Record<string, unknown>)[field] = value;
}

function touchField(params: { field: string }) {
  const { field } = params;
  formTouched[field] = true;
}

function addTech() {
  form.techs = [...form.techs, { _tempId: nextTempId(), name: '', iconName: '' }];
}

function updateTechField(params: { index: number; field: string; value: string }) {
  const { index, field, value } = params;
  const techs = [...form.techs];
  techs[index] = { ...techs[index], [field]: value };
  form.techs = techs;
}

function removeTech(params: { index: number }) {
  const { index } = params;
  const tech = form.techs[index];
  if (tech.id) {
    deletedTechIds.value = [...deletedTechIds.value, tech.id];
  }
  form.techs = form.techs.filter((_, i) => i !== index);
}

function handleTechReorder(event: CustomEvent<ItemReorderEventDetail>) {
  const { from: originIndex, to: destinationIndex, complete } = event.detail;
  try {
    const reorderResult = complete(form.techs);
    if (Array.isArray(reorderResult)) {
      form.techs = [...reorderResult];
    }
  } catch {
    const fallback = [...form.techs];
    if (originIndex !== destinationIndex) {
      const [moved] = fallback.splice(originIndex, 1);
      fallback.splice(destinationIndex, 0, moved);
      form.techs = fallback;
    }
    try {
      complete(false);
    } catch {
      // ignore
    }
  }
}

function touchTechField(params: { index: number; field: string }) {
  const { index, field } = params;
  if (!techTouched[index]) techTouched[index] = {};
  techTouched[index][field] = true;
}

function hasTechError(params: { index: number }): boolean {
  const { index } = params;
  const errors = techV$.value.items.$each.$response.$errors[index]?.['name'];
  return techTouched[index]?.name === true && errors?.length > 0;
}

function getTechError(params: { index: number }): string {
  const { index } = params;
  const errors = techV$.value.items.$each.$response.$errors[index]?.['name'];
  const msg = errors?.[0]?.$message;
  return msg ? (typeof msg === 'string' ? msg : (msg?.valueOf() as string) || '') : '';
}

async function handleSave() {
  v$.value.$touch();
  formTouched.name = true;

  if (v$.value.$invalid) return;

  if (form.techs.length === 0) {
    const toast = await toastController.presentToast({
      message: 'Debes añadir al menos una tecnología',
      duration: 3000,
      color: 'warning',
    });
    await toast.present();
    return;
  }

  techV$.value.$touch();
  form.techs.forEach((_, i) => {
    touchTechField({ index: i, field: 'name' });
  });

  if (techV$.value.$invalid) return;

  saving.value = true;

  try {
    let currentStackId = stackId.value;

    if (currentStackId) {
      const ok = await stackController.updateStackSave({
        id: currentStackId,
        stack: { name: form.name, iconName: form.iconName },
      });
      if (!ok) throw new Error('Error updating stack');
    } else {
      const created = await stackController.createStack({
        name: form.name,
        iconName: form.iconName,
      });
      if (!created?.id) throw new Error('Error creating stack');
      currentStackId = String(created.id);
    }

    for (const techId of deletedTechIds.value) {
      const ok = await techController.deleteTechSave(techId);
      if (!ok) throw new Error('Error deleting tech');
    }
    deletedTechIds.value = [];

    for (const tech of form.techs) {
      const techPayload: TechItem = {
        name: tech.name,
        iconName: tech.iconName || '',
        stackId: Number(currentStackId),
      };

      if (tech.id) {
        const ok = await techController.updateTechSave(tech.id, techPayload);
        if (!ok) throw new Error('Error updating tech');
      } else {
        const created = await techController.createTech({ tech: techPayload });
        if (!created) throw new Error('Error creating tech');
      }
    }

    await stackController.reloadStack();

    const toast = await toastController.presentToast({
      message: isEditing.value ? 'Stack actualizado correctamente' : 'Stack creado correctamente',
      duration: 2000,
      color: 'success',
    });
    await toast.present();

    router.push('/admin-panel/skills');
  } catch (error) {
    console.error('Error saving stack:', error);
    const toast = await toastController.presentToast({
      message: 'Error al guardar el stack',
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.push('/admin-panel/skills');
}

const showIconSelectorModal = ref(false);
const iconSelectorValue = ref('');
let iconSelectorTarget: 'stack' | { index: number } = 'stack';

function openIconSelector() {
  iconSelectorTarget = 'stack';
  iconSelectorValue.value = form.iconName || '';
  showIconSelectorModal.value = true;
}

function openTechIconSelector(params: { index: number }) {
  const { index } = params;
  iconSelectorTarget = { index };
  iconSelectorValue.value = form.techs[index]?.iconName || '';
  showIconSelectorModal.value = true;
}

function selectIcon(name: string) {
  if (iconSelectorTarget === 'stack') {
    form.iconName = name;
  } else {
    const index = iconSelectorTarget.index;
    const techs = [...form.techs];
    techs[index] = { ...techs[index], iconName: name };
    form.techs = techs;
  }
  showIconSelectorModal.value = false;
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
  return icon?.color || '#666666';
}

function getIconLabel(name: string): string {
  const icon = getIconByName(name);
  return icon?.label || name;
}
</script>

<style scoped>
.empty-techs {
  padding: 16px;
  text-align: center;
  color: var(--ion-color-medium);
}
</style>
