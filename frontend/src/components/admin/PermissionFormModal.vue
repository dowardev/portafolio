<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="dismiss">Cancelar</ion-button>
      </ion-buttons>
      <ion-title>{{ isEdit ? 'Editar Permiso' : 'Nuevo Permiso' }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="save" :strong="true" :disabled="!isValid">Guardar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-list>
      <ion-item v-if="!isEdit">
        <ion-label position="stacked">Módulo</ion-label>
        <ion-select v-model="module" placeholder="Seleccionar módulo">
          <ion-select-option v-for="m in availableModules" :key="m" :value="m">{{ m }}</ion-select-option>
        </ion-select>
        <ion-note>Al que pertenece el permiso</ion-note>
      </ion-item>

      <ion-item v-if="!isEdit">
        <ion-label position="stacked">Acción</ion-label>
        <ion-select v-model="actions" multiple placeholder="Seleccionar acciones" :cancel-text="'Cancelar'" :ok-text="'Aceptar'">
          <ion-select-option value="create">create - Crear</ion-select-option>
          <ion-select-option value="update">update - Editar</ion-select-option>
          <ion-select-option value="delete">delete - Eliminar</ion-select-option>
        </ion-select>
        <ion-note>Selecciona una o más acciones</ion-note>
      </ion-item>

      <ion-item v-if="isEdit">
        <ion-label position="stacked">Módulo</ion-label>
        <ion-input :value="module" readonly></ion-input>
      </ion-item>

      <ion-item v-if="isEdit">
        <ion-label position="stacked">Acción</ion-label>
        <ion-input :value="action" readonly></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Descripción{{ !isEdit ? ' (opcional)' : '' }}</ion-label>
        <ion-input
          v-model="description"
          placeholder="Nombre legible para mostrar"
        ></ion-input>
        <ion-note v-if="!isEdit">Se autogenera si se deja vacío</ion-note>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonNote, modalController } from '@ionic/vue'
import type { PermissionWithDescription } from '@/controllers/permissionsController'

const props = defineProps<{
  permission?: PermissionWithDescription | null
  availableModules?: string[]
}>()

const emit = defineEmits<{
  (e: 'saved', permissions: { slug: string; module: string; action: string; description: string }[]): void
}>()

const isEdit = computed(() => !!props.permission)

const module = ref('')
const action = ref('')
const actions = ref<string[]>([])
const description = ref('')

const availableModules = computed(() => props.availableModules || [])

const isValid = computed(() => {
  if (isEdit.value) {
    return module.value.trim().length > 0 && action.value.trim().length > 0
  }
  return module.value.trim().length > 0 && actions.value.length > 0
})

function dismiss() {
  modalController.dismiss()
}

function save() {
  if (!isValid.value) return

  if (isEdit.value) {
    emit('saved', [{
      slug: `${module.value}.${action.value}`,
      module: module.value.trim().toLowerCase(),
      action: action.value.trim().toLowerCase(),
      description: description.value.trim()
    }])
  } else {
    const actionLabels: Record<string, string> = {
      create: 'Crear',
      update: 'Editar',
      delete: 'Eliminar'
    }

    const permissions = actions.value.map(act => ({
      slug: `${module.value}.${act}`,
      module: module.value.trim().toLowerCase(),
      action: act.trim().toLowerCase(),
      description: description.value.trim() || `${actionLabels[act] || act} ${module.value}`
    }))

    emit('saved', permissions)
  }

  modalController.dismiss()
}

onMounted(() => {
  if (props.permission) {
    module.value = props.permission.module
    action.value = props.permission.action
    description.value = props.permission.description || ''
  }
})
</script>