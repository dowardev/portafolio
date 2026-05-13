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
        <ion-segment-button value="users">
          <ion-label>Usuarios</ion-label>
        </ion-segment-button>
        <ion-segment-button value="sync">
          <ion-label>SSO</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Tab: Permissions Catalog -->
      <div v-if="activeTab === 'permissions'" class="tab-content">
        <ion-button @click="showAddPermissionModal" :disabled="saving">
          <ion-icon slot="start" :icon="addCircle"></ion-icon>
          Agregar Permiso
        </ion-button>

        <ion-list>
          <ion-item v-for="perm in permissions" :key="perm.slug">
            <ion-label>
              <h2>{{ perm.module }}.{{ perm.action }}</h2>
              <p>{{ perm.slug }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="editPermission(perm)">
                <ion-icon :icon="pencil"></ion-icon>
              </ion-button>
              <ion-button @click="deletePermission(perm)" color="danger">
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
            <ion-select-option v-for="role in availableRoles" :key="role.slug" :value="role.slug">
              {{ role.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <div class="permissions-grid">
          <ion-item v-for="perm in rolePermissions[selectedRole]" :key="perm.slug">
            <ion-checkbox
              slot="start"
              :checked="perm.enabled"
              @ionChange="togglePermission(perm.slug, $detail.checked)"
              :disabled="saving"
            ></ion-checkbox>
            <ion-label>
              <h3>{{ perm.module }}.{{ perm.action }}</h3>
              <p>{{ perm.slug }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          expand="block"
          @click="saveRolePermissions"
          :disabled="!hasChanges || saving"
          class="save-btn"
        >
          <ion-icon slot="start" :icon="save"></ion-icon>
          Guardar Cambios
        </ion-button>
      </div>

      <!-- Tab: Users -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <ion-item>
          <ion-label>Usuario SSO ID:</ion-label>
          <ion-input v-model="selectedUserId" placeholder="Ingrese ID del usuario"></ion-input>
        </ion-item>

        <div v-if="userPermissions[selectedUserId]" class="permissions-grid">
          <ion-item v-for="perm in userPermissions[selectedUserId]" :key="perm.slug">
            <ion-select
              slot="start"
              :value="perm.type"
              @ionChange="updateUserOverride(perm.slug, $detail.value)"
              :disabled="saving"
            >
              <ion-select-option :value="null">Heredado del rol</ion-select-option>
              <ion-select-option value="grant">Permitir</ion-select-option>
              <ion-select-option value="deny">Denegar</ion-select-option>
            </ion-select>
            <ion-label>
              <h3>{{ perm.module }}.{{ perm.action }}</h3>
              <p>{{ perm.slug }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          v-if="selectedUserId"
          expand="block"
          @click="saveUserPermissions"
          :disabled="saving"
          class="save-btn"
        >
          <ion-icon slot="start" :icon="save"></ion-icon>
          Guardar Permisos de Usuario
        </ion-button>
      </div>

      <!-- Tab: SSO -->
      <div v-if="activeTab === 'sync'" class="tab-content">
        <div class="sync-status">
          <h3>Roles desde SSO</h3>
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

          <ion-button @click="doSync" :disabled="saving">
            <ion-icon slot="start" :icon="syncIcon"></ion-icon>
            Sincronizar ahora
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonCheckbox, toastController,
  IonInput, alertController
} from '@ionic/vue'
import { shield, sync as syncIcon, addCircle, pencil, trash, save } from 'ionicons/icons'
import { usePermissionsController, type AvailablePermission, type RolePermissions, type SyncStatus, type UserPermissions } from '@/controllers/permissionsController'

const controller = usePermissionsController()

const activeTab = ref('permissions')
const saving = ref(false)

const selectedRole = ref('admin')
const availableRoles = ref<{slug: string; name: string}[]>([])
const rolePermissions = ref<RolePermissions>({})
const originalPermissions = ref<RolePermissions>({})

const selectedUserId = ref('')
let userPermissionsTimeout: ReturnType<typeof setTimeout> | null = null
const userPermissions = ref<UserPermissions>({})
const originalUserPermissions = ref<UserPermissions>({})

const permissions = ref<AvailablePermission[]>([])

const syncStatus = ref<SyncStatus>({ roles: [], last_sync: null })

const hasChanges = computed(() => {
  if (!selectedRole.value) return false
  const current = JSON.stringify(rolePermissions.value[selectedRole.value]?.map((p) => p.enabled))
  const original = JSON.stringify(originalPermissions.value[selectedRole.value]?.map((p) => p.enabled))
  return current !== original
})

watch(selectedUserId, (newVal) => {
  if (userPermissionsTimeout) clearTimeout(userPermissionsTimeout)
  if (newVal) {
    userPermissionsTimeout = setTimeout(() => {
      loadUserPermissions()
    }, 500)
  } else {
    userPermissions.value = {}
    originalUserPermissions.value = {}
  }
})

async function loadPermissions() {
  permissions.value = await controller.getAvailablePermissions()
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadUserPermissions() {
  if (!selectedUserId.value) return
  userPermissions.value = await controller.getUserPermissions({ userSsoId: selectedUserId.value })
  originalUserPermissions.value = JSON.parse(JSON.stringify(userPermissions.value))
}

async function loadAvailableRoles() {
  const status = await controller.getSyncStatus()
  availableRoles.value = (status.roles || []).map((r) => ({
    slug: r.slug,
    name: r.name
  }))
  if (availableRoles.value.length > 0 && !selectedRole.value) {
    selectedRole.value = availableRoles.value[0].slug
  }
}

async function loadSyncStatus() {
  syncStatus.value = await controller.getSyncStatus()
}

function tabChanged() {
  if (activeTab.value === 'permissions') loadPermissions()
  if (activeTab.value === 'roles') loadRolePermissions()
  if (activeTab.value === 'users') loadUserPermissions()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function togglePermission(permSlug: string, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p) => p.slug === permSlug)
  if (perm) perm.enabled = enabled
}

function updateUserOverride(permSlug: string, type: string | null) {
  const userPerms = userPermissions.value[selectedUserId.value]
  const perm = userPerms.find((p) => p.slug === permSlug)
  if (perm) perm.type = type as 'grant' | 'deny' | null
}

async function saveRolePermissions() {
  try {
    saving.value = true
    const enabledSlugs = rolePermissions.value[selectedRole.value]
      .filter((p) => p.enabled)
      .map((p) => p.slug)
    await controller.updateRolePermissions({ roleSlug: selectedRole.value, permissionSlugs: enabledSlugs })
    originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
    showToast('Cambios guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

async function saveUserPermissions() {
  if (!selectedUserId.value) return
  try {
    saving.value = true
    const perms = userPermissions.value[selectedUserId.value].map((p) => ({
      slug: p.slug,
      type: p.type,
    }))
    await controller.updateUserPermissions({ userSsoId: selectedUserId.value, permissions: perms })
    originalUserPermissions.value = JSON.parse(JSON.stringify(userPermissions.value))
    showToast('Permisos de usuario guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

async function doSync() {
  try {
    saving.value = true
    syncStatus.value = await controller.syncRoles()
    showToast('Sincronización completada')
  } catch (e: any) {
    showToast('Error al sincronizar', 'danger')
  } finally {
    saving.value = false
  }
}

async function showAddPermissionModal() {
  const alert = await alertController.create({
    header: 'Agregar Permiso',
    inputs: [
      { name: 'module', placeholder: 'Módulo (ej: posts)', type: 'text' },
      { name: 'action', placeholder: 'Acción (ej: create)', type: 'text' },
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: async (data) => {
          if (!data.module || !data.action) {
            showToast('Complete todos los campos', 'warning')
            return
          }
          const slug = `${data.module}.${data.action}`
          try {
            saving.value = true
            await controller.createPermission({ slug, module: data.module, action: data.action })
            await loadPermissions()
            showToast('Permiso creado')
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al crear', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function editPermission(perm: AvailablePermission) {
  const alert = await alertController.create({
    header: 'Editar Permiso',
    inputs: [
      { name: 'slug', placeholder: 'Slug', value: perm.slug, type: 'text' },
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (data) => {
          const parts = data.slug.split('.', 2)
          try {
            saving.value = true
            const permId = permissions.value.find(p => p.slug === perm.slug)?.id
            if (permId) {
              await controller.updatePermission({ id: permId, slug: data.slug, module: parts[0], action: parts[1] || '' })
              await loadPermissions()
              showToast('Permiso actualizado')
            }
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al actualizar', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function deletePermission(perm: AvailablePermission) {
  const alert = await alertController.create({
    header: 'Eliminar Permiso',
    message: `¿Eliminar ${perm.slug}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          try {
            saving.value = true
            const permId = permissions.value.find(p => p.slug === perm.slug)?.id
            if (permId) {
              await controller.deletePermission({ id: permId })
              await loadPermissions()
              showToast('Permiso eliminado')
            }
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al eliminar', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function showToast(message: string, color: string = 'success') {
  const toast = await toastController.create({
    message, duration: 2000, color
  })
  await toast.present()
}

onMounted(() => {
  loadPermissions()
  loadAvailableRoles()
  loadRolePermissions()
  loadSyncStatus()
})

onUnmounted(() => {
  if (userPermissionsTimeout) clearTimeout(userPermissionsTimeout)
})
</script>

<style scoped>
.tab-content {
  padding: 16px;
}
.permissions-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
}
.save-btn {
  margin-top: 20px;
}
.last-sync {
  color: var(--ion-color-medium);
  margin: 16px 0;
}
</style>