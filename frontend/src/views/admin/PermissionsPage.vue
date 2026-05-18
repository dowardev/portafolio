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
        <ion-button @click="openCreateModal" :disabled="saving">
          <ion-icon slot="start" :icon="addCircle"></ion-icon>
          Agregar Permiso
        </ion-button>

        <div v-for="group in groupedPermissions" :key="group.module" class="permission-group">
          <ion-list-header class="module-header">
            <ion-label>
              {{ group.label }}
              <ion-badge color="medium">{{ group.permissions.length }}</ion-badge>
            </ion-label>
          </ion-list-header>

          <ion-item v-for="perm in group.permissions" :key="perm.id">
            <ion-label>
              <h2>{{ getPermissionLabel(perm) }}</h2>
              <p>{{ perm.slug }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="openEditModal(perm)">
                <ion-icon :icon="pencil"></ion-icon>
              </ion-button>
              <ion-button @click="deletePermission(perm)" color="danger">
                <ion-icon :icon="trash"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </div>
      </div>

      <!-- Tab: Roles -->
      <div v-if="activeTab === 'roles'" class="tab-content">
        <ion-item>
          <ion-label>Rol:</ion-label>
          <ion-select v-model="selectedRole" @ionChange="loadRolePermissions">
            <ion-select-option v-for="role in availableRoles" :key="role.slug" :value="role.slug">
              {{ role.name }} ({{ role.slug }})
            </ion-select-option>
          </ion-select>
        </ion-item>

        <div v-for="group in groupedRolePermissions" :key="group.module" class="permission-group">
          <ion-list-header class="module-header">
            <ion-label>
              {{ group.label }}
              <ion-badge color="medium">{{ group.enabledCount }}/{{ group.permissions.length }}</ion-badge>
            </ion-label>
          </ion-list-header>

          <ion-item v-for="perm in group.permissions" :key="perm.slug">
            <ion-checkbox
              slot="start"
              :checked="perm.enabled"
              @ionChange="togglePermission(perm.slug, $detail.checked)"
              :disabled="saving"
            ></ion-checkbox>
            <ion-label>
              <h3>{{ getPermissionLabel(perm) }}</h3>
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
          Guardar Cambios {{ changesCount > 0 ? `(${changesCount})` : '' }}
        </ion-button>
      </div>

      <!-- Tab: Users -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <UserSearchInput @selected="onUserSelected" />

        <div v-if="currentUserPermissions.length > 0">
          <div v-for="group in groupedUserPermissions" :key="group.module" class="permission-group">
            <ion-list-header class="module-header">
              <ion-label>
                {{ group.label }}
                <ion-badge color="medium">{{ group.permissions.length }}</ion-badge>
              </ion-label>
            </ion-list-header>

            <ion-item v-for="perm in group.permissions" :key="perm.slug">
              <ion-select
                slot="start"
                :value="perm.type"
                @ionChange="updateUserOverride(perm.slug, $detail.value)"
                :disabled="saving"
              >
                <ion-select-option :value="null">
                  <ion-icon :icon="removeCircleOutline" slot="start"></ion-icon>
                  Heredado
                </ion-select-option>
                <ion-select-option value="grant">
                  <ion-icon :icon="checkmarkCircle" slot="start" color="success"></ion-icon>
                  Permitir
                </ion-select-option>
                <ion-select-option value="deny">
                  <ion-icon :icon="closeCircle" slot="start" color="danger"></ion-icon>
                  Denegar
                </ion-select-option>
              </ion-select>
              <ion-label>
                <h3>{{ getPermissionLabel(perm) }}</h3>
                <p>{{ perm.slug }}</p>
              </ion-label>
            </ion-item>
          </div>

          <ion-button
            expand="block"
            @click="saveUserPermissions"
            :disabled="saving"
            class="save-btn"
          >
            <ion-icon slot="start" :icon="save"></ion-icon>
            Guardar Permisos de Usuario
          </ion-button>
        </div>
      </div>

      <!-- Tab: SSO -->
      <div v-if="activeTab === 'sync'" class="tab-content">
        <div class="sync-status">
          <h3>Roles desde SSO</h3>
          <ion-list>
            <ion-item v-for="role in syncStatus.roles" :key="role.slug">
              <ion-label>
                <h2>{{ role.name }}</h2>
                <p>{{ role.slug }}</p>
              </ion-label>
              <ion-badge v-if="role.is_protected" slot="end" color="success">Protegido</ion-badge>
            </ion-item>
          </ion-list>

          <p class="last-sync">
            Última sincronización: {{ formatLastSync(syncStatus.last_sync) }}
          </p>

          <ion-button @click="doSync" :disabled="saving">
            <ion-icon slot="start" :icon="saving ? syncIcon : syncOutline"></ion-icon>
            {{ saving ? 'Sincronizando...' : 'Sincronizar ahora' }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonCheckbox, toastController,
  IonInput, IonListHeader, IonBadge, modalController
} from '@ionic/vue'
import { shield, addCircle, pencil, trash, save, sync as syncIcon, syncOutline, checkmarkCircle, closeCircle, removeCircleOutline } from 'ionicons/icons'
import { usePermissionsController, type PermissionWithDescription, type RolePermissions, type SyncStatus, type UserPermissions } from '@/controllers/permissionsController'
import { usePermissionsGrouped } from '@/composables/usePermissionsGrouped'
import PermissionFormModal from '@/components/admin/PermissionFormModal.vue'
import UserSearchInput from '@/components/admin/UserSearchInput.vue'
import type { SearchUserResult } from '@/controllers/permissionsController'

const controller = usePermissionsController()
const { groupPermissions, getPermissionLabel } = usePermissionsGrouped()

const activeTab = ref('permissions')
const saving = ref(false)

const selectedRole = ref('admin')
const availableRoles = ref<{slug: string; name: string}[]>([])
const rolePermissions = ref<RolePermissions>({})
const originalPermissions = ref<RolePermissions>({})

const selectedUser = ref<SearchUserResult | null>(null)
const userPermissions = ref<UserPermissions>({})

const permissions = ref<PermissionWithDescription[]>([])

const syncStatus = ref<SyncStatus>({ roles: [], last_sync: null })

const groupedPermissions = computed(() => groupPermissions(permissions.value))

const groupedRolePermissions = computed(() => {
  const perms = rolePermissions.value[selectedRole.value] || []
  const withDesc = perms.map(p => ({
    ...p,
    module: p.slug.split('.')[0],
    description: null as string | null
  }))
  return groupPermissions(withDesc as PermissionWithDescription[]).map(g => ({
    ...g,
    enabledCount: g.permissions.filter(p => p.enabled).length
  }))
})

const currentUserPermissions = computed(() => {
  if (!selectedUser.value) return []
  return userPermissions.value[selectedUser.value.id] || []
})

const groupedUserPermissions = computed(() => {
  const perms = currentUserPermissions.value.map(p => ({
    ...p,
    module: p.slug.split('.')[0],
    description: p.description
  }))
  return groupPermissions(perms as PermissionWithDescription[])
})

const hasChanges = computed(() => {
  if (!selectedRole.value) return false
  const current = JSON.stringify(rolePermissions.value[selectedRole.value]?.map((p) => p.enabled))
  const original = JSON.stringify(originalPermissions.value[selectedRole.value]?.map((p) => p.enabled))
  return current !== original
})

const changesCount = computed(() => {
  if (!selectedRole.value) return 0
  const current = rolePermissions.value[selectedRole.value]?.map((p) => p.enabled) || []
  const original = originalPermissions.value[selectedRole.value]?.map((p) => p.enabled) || []
  return current.filter((c, i) => c !== original[i]).length
})

function onUserSelected(user: SearchUserResult | null) {
  selectedUser.value = user
  if (user) {
    loadUserPermissions()
  } else {
    userPermissions.value = {}
  }
}

async function loadPermissions() {
  permissions.value = await controller.getAvailablePermissions()
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadUserPermissions() {
  if (!selectedUser.value) return
  userPermissions.value = await controller.getUserPermissions({ userSsoId: selectedUser.value.id })
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
  if (activeTab.value === 'users' && selectedUser.value) loadUserPermissions()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function togglePermission(permSlug: string, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p) => p.slug === permSlug)
  if (perm) perm.enabled = enabled
}

function updateUserOverride(permSlug: string, type: string | null) {
  if (!selectedUser.value) return
  const userPerms = userPermissions.value[selectedUser.value.id]
  const perm = userPerms?.find((p) => p.slug === permSlug)
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
  if (!selectedUser.value) return
  try {
    saving.value = true
    const perms = userPermissions.value[selectedUser.value.id].map((p) => ({
      slug: p.slug,
      type: p.type,
    }))
    await controller.updateUserPermissions({ userSsoId: selectedUser.value.id, permissions: perms })
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

async function openCreateModal() {
  const modal = await modalController.create({
    component: PermissionFormModal,
    componentProps: { permission: null }
  })

  modal.onDidDismiss().then(async (result) => {
    if (result.data) {
      try {
        saving.value = true
        await controller.createPermission({
          slug: result.data.slug,
          module: result.data.module,
          action: result.data.action,
          description: result.data.description
        })
        await loadPermissions()
        showToast('Permiso creado')
      } catch (e: any) {
        showToast(e.response?.data?.message || 'Error al crear', 'danger')
      } finally {
        saving.value = false
      }
    }
  })

  await modal.present()
}

async function openEditModal(perm: PermissionWithDescription) {
  const modal = await modalController.create({
    component: PermissionFormModal,
    componentProps: { permission: perm }
  })

  modal.onDidDismiss().then(async (result) => {
    if (result.data) {
      try {
        saving.value = true
        await controller.updatePermission({
          id: perm.id,
          slug: result.data.slug,
          module: result.data.module,
          action: result.data.action,
          description: result.data.description
        })
        await loadPermissions()
        showToast('Permiso actualizado')
      } catch (e: any) {
        showToast(e.response?.data?.message || 'Error al actualizar', 'danger')
      } finally {
        saving.value = false
      }
    }
  })

  await modal.present()
}

async function deletePermission(perm: PermissionWithDescription) {
  const alert = await (await import('@ionic/vue')).alertController.create({
    header: 'Eliminar Permiso',
    message: `¿Eliminar "${getPermissionLabel(perm)}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          try {
            saving.value = true
            await controller.deletePermission({ id: perm.id })
            await loadPermissions()
            showToast('Permiso eliminado')
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

function formatLastSync(timestamp: string | null): string {
  if (!timestamp) return 'Nunca'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Hace un momento'
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
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
</script>

<style scoped>
.tab-content {
  padding: 16px;
}
.permission-group {
  margin-bottom: 16px;
}
.module-header {
  background: var(--ion-color-light);
  border-radius: 8px;
  margin-bottom: 8px;
}
.save-btn {
  margin-top: 20px;
}
.last-sync {
  color: var(--ion-color-medium);
  margin: 16px 0;
}
</style>