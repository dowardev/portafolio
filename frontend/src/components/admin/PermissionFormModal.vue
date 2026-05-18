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
      <ion-item>
        <ion-label position="stacked">Módulo</ion-label>
        <ion-input
          v-model="module"
          placeholder="Ej: posts, projects, certificates"
          @ion-input="updateSlugPreview"
        ></ion-input>
        <ion-note>Al que pertenece el permiso</ion-note>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Acción</ion-label>
        <ion-input
          v-model="action"
          placeholder="Ej: create, update, delete"
          @ion-input="updateSlugPreview"
        ></ion-input>
        <ion-note>Qué acción permite</ion-note>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Slug (preview)</ion-label>
        <ion-input :value="slugPreview" readonly></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Descripción (opcional)</ion-label>
        <ion-input
          v-model="description"
          placeholder="Ej: Crear publicaciones"
        ></ion-input>
        <ion-note>Nombre legible para mostrar. Se autogenera si se deja vacío.</ion-note>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonNote, modalController } from '@ionic/vue'
import type { PermissionWithDescription } from '@/controllers/permissionsController'

const props = defineProps<{
  permission?: PermissionWithDescription | null
}>()

const emit = defineEmits<{
  (e: 'saved', permission: { slug: string; module: string; action: string; description: string }): void
}>()

const isEdit = computed(() => !!props.permission)

const module = ref('')
const action = ref('')
const description = ref('')
const slugPreview = ref('')

function updateSlugPreview() {
  if (module.value && action.value) {
    slugPreview.value = `${module.value.toLowerCase().trim()}.${action.value.toLowerCase().trim()}`
    if (!description.value) {
      const actionLabels: Record<string, string> = {
        create: 'Crear',
        update: 'Editar',
        delete: 'Eliminar'
      }
      const actionLabel = actionLabels[action.value.toLowerCase()] || action.value
      description.value = `${actionLabel} ${module.value}`
    }
  } else {
    slugPreview.value = ''
  }
}

const isValid = computed(() => {
  return module.value.trim().length > 0 && action.value.trim().length > 0
})

function dismiss() {
  modalController.dismiss()
}

function save() {
  if (!isValid.value) return

  emit('saved', {
    slug: slugPreview.value,
    module: module.value.trim().toLowerCase(),
    action: action.value.trim().toLowerCase(),
    description: description.value.trim()
  })

  modalController.dismiss()
}

onMounted(() => {
  if (props.permission) {
    module.value = props.permission.module
    action.value = props.permission.action
    description.value = props.permission.description || ''
    slugPreview.value = props.permission.slug
  }
})
</script>