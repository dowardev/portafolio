<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin-panel"></ion-back-button>
        </ion-buttons>
        <ion-title>Permisos del Sistema</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-segment v-model="activeTab" @ionChange="tabChanged">
        <ion-segment-button value="permissions">
          <ion-label>Permisos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="roles">
          <ion-label>Roles</ion-label>
        </ion-segment-button>
        <ion-segment-button value="sync">
          <ion-label>Sincronización</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Tab: Permisos -->
      <div v-if="activeTab === 'permissions'" class="tab-content">
        <div class="toolbar">
          <ion-select v-model="filterModule" placeholder="Filtrar por módulo" @ionChange="loadPermissions">
            <ion-select-option value="">Todos</ion-select-option>
            <ion-select-option v-for="mod in modules" :key="mod" :value="mod">{{ mod }}</ion-select-option>
          </ion-select>
          <ion-button @click="showCreateModal = true">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Nuevo
          </ion-button>
        </div>

        <ion-list>
          <ion-item v-for="perm in permissions" :key="perm.id">
            <ion-label>
              <h2>{{ perm.name }}</h2>
              <p>{{ perm.slug }} ({{ perm.module }})</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="editPermission(perm)">
                <ion-icon :icon="pencil"></ion-icon>
              </ion-button>
              <ion-button color="danger" @click="confirmDelete(perm)">
                <ion-icon :icon="trash"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
      </div>

      <!-- Tab: Roles -->
      <div v-if="activeTab === 'roles'" class="tab-content">
        <ion-item>
          <ion-label>Rol:</ion-label>
          <ion-select v-model="selectedRole" @ionChange="loadRolePermissions">
            <ion-select-option value="admin">Admin</ion-select-option>
            <ion-select-option value="editor">Editor</ion-select-option>
            <ion-select-option value="viewer">Visor</ion-select-option>
          </ion-select>
        </ion-item>

        <div v-if="selectedRole === 'admin'" class="admin-notice">
          <ion-icon :icon="informationCircle"></ion-icon>
          El rol Admin siempre tiene acceso total a todos los permisos.
        </div>

        <div v-else class="permissions-grid">
          <ion-item v-for="perm in rolePermissions[selectedRole]" :key="perm.id">
            <ion-checkbox
              slot="start"
              :checked="perm.enabled"
              @ionChange="togglePermission(perm.id, $detail.checked)"
            ></ion-checkbox>
            <ion-label>
              <h3>{{ perm.name }}</h3>
              <p>{{ perm.module }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          v-if="selectedRole !== 'admin'"
          expand="block"
          @click="saveRolePermissions"
          :disabled="!hasChanges"
          class="save-btn"
        >
          Guardar Cambios
        </ion-button>
      </div>

      <!-- Tab: Sincronización -->
      <div v-if="activeTab === 'sync'" class="tab-content">
        <div class="sync-status">
          <h3>Roles del SSO (cacheados)</h3>
          <ion-list>
            <ion-item v-for="role in syncStatus.roles" :key="role.slug">
              <ion-label>
                <h2>{{ role.name }}</h2>
                <p>{{ role.slug }} {{ role.is_protected ? '(protegido)' : '' }}</p>
              </ion-label>
              <ion-icon v-if="role.is_protected" slot="end" :icon="shield" color="success"></ion-icon>
            </ion-item>
          </ion-list>

          <p class="last-sync">
            Última sincronización: {{ syncStatus.last_sync || 'Nunca' }}
          </p>

          <ion-button @click="doSync">
            <ion-icon slot="start" :icon="sync"></ion-icon>
            Sincronizar ahora
          </ion-button>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <ion-modal :is-open="showCreateModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingPermission ? 'Editar' : 'Nuevo' }} Permiso</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-item>
            <ion-label position="stacked">Slug</ion-label>
            <ion-input v-model="form.slug" placeholder="posts.create"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input v-model="form.name" placeholder="Crear post"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Módulo</ion-label>
            <ion-input v-model="form.module" placeholder="posts"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="savePermission" class="save-btn">
            Guardar
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonModal, IonInput,
  IonCheckbox, toastController
} from '@ionic/vue'
import { add, pencil, trash, informationCircle, shield, sync } from 'ionicons/icons'
import { usePermissionsController } from '@/controllers/permissionsController'

const controller = usePermissionsController()

const activeTab = ref('permissions')
const permissions = ref<any[]>([])
const filterModule = ref('')
const modules = computed(() => [...new Set(permissions.value.map(p => p.module))])

const showCreateModal = ref(false)
const editingPermission = ref<any>(null)
const form = ref({ slug: '', name: '', module: '' })

const selectedRole = ref('admin')
const rolePermissions = ref<any>({})
const originalPermissions = ref<any>({})

const syncStatus = ref<any>({ roles: [], last_sync: null })

const hasChanges = computed(() => {
  if (selectedRole.value === 'admin') return false
  const current = JSON.stringify(rolePermissions.value[selectedRole.value]?.map((p: any) => p.enabled))
  const original = JSON.stringify(originalPermissions.value[selectedRole.value]?.map((p: any) => p.enabled))
  return current !== original
})

async function loadPermissions() {
  permissions.value = await controller.getPermissions(filterModule.value || undefined)
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadSyncStatus() {
  syncStatus.value = await controller.getSyncStatus()
}

function tabChanged() {
  if (activeTab.value === 'permissions') loadPermissions()
  if (activeTab.value === 'roles') loadRolePermissions()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function editPermission(perm: any) {
  editingPermission.value = perm
  form.value = { slug: perm.slug, name: perm.name, module: perm.module }
  showCreateModal.value = true
}

async function savePermission() {
  try {
    if (editingPermission.value) {
      await controller.updatePermission(editingPermission.value.id, {
        name: form.value.name,
        module: form.value.module
      })
    } else {
      await controller.createPermission(form.value)
    }
    closeModal()
    loadPermissions()
    showToast('Permiso guardado')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  }
}

async function confirmDelete(perm: any) {
  try {
    await controller.deletePermission(perm.id)
    loadPermissions()
    showToast('Permiso eliminado')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al eliminar', 'danger')
  }
}

function closeModal() {
  showCreateModal.value = false
  editingPermission.value = null
  form.value = { slug: '', name: '', module: '' }
}

function togglePermission(permId: number, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p: any) => p.id === permId)
  if (perm) perm.enabled = enabled
}

async function saveRolePermissions() {
  try {
    const enabledIds = rolePermissions.value[selectedRole.value]
      .filter((p: any) => p.enabled)
      .map((p: any) => p.id)
    await controller.updateRolePermissions(selectedRole.value, enabledIds)
    originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
    showToast('Cambios guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  }
}

async function doSync() {
  try {
    syncStatus.value = await controller.syncRoles()
    showToast('Sincronización completada')
  } catch (e: any) {
    showToast('Error al sincronizar', 'danger')
  }
}

async function showToast(message: string, color: string = 'success') {
  const toast = await toastController.create({
    message, duration: 2000, color
  })
  toast.present()
}

onMounted(() => {
  loadPermissions()
})
</script>

<style scoped>
.tab-content {
  padding: 16px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.toolbar ion-select {
  flex: 1;
  max-width: 200px;
}
.admin-notice {
  background: var(--ion-color-warning-bg);
  color: var(--ion-color-warning);
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.permissions-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.save-btn {
  margin-top: 20px;
}
.last-sync {
  color: var(--ion-color-medium);
  margin: 16px 0;
}
</style>