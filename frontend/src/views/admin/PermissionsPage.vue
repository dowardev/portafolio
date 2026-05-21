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
              @ionChange="(e: any) => togglePermission(perm.slug, e.detail.checked)"
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
    <ion-item>
      <ion-label position="stacked">Buscar usuario</ion-label>
      <ion-input v-model="userSearchQuery" placeholder="Nombre o email..." debounce="300" @ionInput="searchSsoUsers"></ion-input>
    </ion-item>

    <div v-if="loadingUsers" class="loading-container">
      <ion-spinner name="lines"></ion-spinner>
      <p>Cargando usuarios...</p>
    </div>

    <ion-list v-else-if="ssoUsers.length > 0" class="users-list">
      <ion-item
        v-for="user in ssoUsers"
        :key="user.id"
        :button="true"
        :detail="true"
        :class="{ 'selected-user': selectedUser?.id === String(user.id) }"
        @click="selectSsoUser(user)"
      >
        <ion-icon slot="start" :icon="personOutline" color="primary"></ion-icon>
        <ion-label>
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
        </ion-label>
      </ion-item>
    </ion-list>

    <div v-else class="empty-container">
      <p>No se encontraron usuarios</p>
    </div>

        <div v-if="currentUserPermissions.length > 0">
          <div v-for="group in groupedUserPermissions" :key="group.module" class="permission-group">
            <ion-list-header class="module-header">
              <ion-label>
                {{ group.label }}
                <ion-badge color="medium">{{ group.permissions.length }}</ion-badge>
              </ion-label>
            </ion-list-header>

            <ion-item
              v-for="perm in group.permissions"
              :key="perm.slug"
              button
              @click="openPermPopover($event, perm.slug)"
            >
              <ion-icon
                slot="start"
                :icon="perm.type === 'grant' ? checkmarkCircle : perm.type === 'deny' ? closeCircle : removeCircleOutline"
                :color="perm.type === 'grant' ? 'success' : perm.type === 'deny' ? 'danger' : 'medium'"
              />
              <ion-label>
                <h3>{{ getPermissionLabel(perm) }}</h3>
                <p>{{ perm.slug }}</p>
              </ion-label>
              <ion-note slot="end">
                {{ perm.type === 'grant' ? 'Permitir' : perm.type === 'deny' ? 'Denegar' : 'Heredado' }}
              </ion-note>
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

      <ion-popover
        :is-open="permPopover.open"
        :event="permPopover.event"
        @did-dismiss="permPopover.open = false"
        side="bottom"
      >
        <ion-content>
          <ion-list>
            <ion-item
              button
              @mouseenter="permDescription = 'El permiso se decide según los roles del usuario'"
              @click="selectPermOverride(null); permPopover.open = false"
            >
              <ion-icon slot="start" :icon="removeCircleOutline" color="medium" />
              <ion-label>Heredado</ion-label>
              <ion-badge v-if="currentPermType === null" slot="end" color="medium">●</ion-badge>
            </ion-item>
            <ion-item
              button
              @mouseenter="permDescription = 'Fuerza el permiso como concedido, sin importar los roles'"
              @click="selectPermOverride('grant'); permPopover.open = false"
            >
              <ion-icon slot="start" :icon="checkmarkCircle" color="success" />
              <ion-label>Permitir</ion-label>
              <ion-badge v-if="currentPermType === 'grant'" slot="end" color="success">●</ion-badge>
            </ion-item>
            <ion-item
              button
              @mouseenter="permDescription = 'Fuerza el permiso como denegado, sin importar los roles'"
              @click="selectPermOverride('deny'); permPopover.open = false"
            >
              <ion-icon slot="start" :icon="closeCircle" color="danger" />
              <ion-label>Denegar</ion-label>
              <ion-badge v-if="currentPermType === 'deny'" slot="end" color="danger">●</ion-badge>
            </ion-item>
          </ion-list>
          <ion-item class="perm-description">
            <ion-label>
              <p>{{ permDescription }}</p>
            </ion-label>
          </ion-item>
        </ion-content>
      </ion-popover>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonCheckbox,
  toastController, IonInput, IonListHeader, IonBadge, IonSpinner, IonNote, IonPopover
} from '@ionic/vue'
import { save, sync as syncIcon, syncOutline, checkmarkCircle, closeCircle, removeCircleOutline, personOutline } from 'ionicons/icons'
import { usePermissionsController, type RolePermissions, type SyncStatus, type UserPermissions, type SsoUser } from '@/controllers/permissionsController'
import { useUserStore } from '@/store/userStore'
import { usePermissionsGrouped } from '@/composables/usePermissionsGrouped'

const userStore = useUserStore()
const controller = usePermissionsController()
const { groupPermissions, getPermissionLabel } = usePermissionsGrouped()

const activeTab = ref('roles')
const saving = ref(false)

const selectedRole = ref('admin')
const availableRoles = ref<{slug: string; name: string}[]>([])
const rolePermissions = ref<RolePermissions>({})
const originalPermissions = ref<RolePermissions>({})

const selectedUser = ref<SsoUser | null>(null)
const userPermissions = ref<UserPermissions>({})
const ssoUsers = ref<SsoUser[]>([])
const loadingUsers = ref(false)
const userSearchQuery = ref('')

const permPopover = reactive({ open: false, event: Event })
const currentPermSlug = ref('')
const currentPermType = ref<string | null>(null)
const permDescription = ref('El permiso se decide según los roles del usuario')

const syncStatus = ref<SyncStatus>({ roles: [], last_sync: null })

const groupedRolePermissions = computed(() => {
  const perms = rolePermissions.value[selectedRole.value] || []
  const withDesc = perms.map(p => ({
    ...p,
    module: p.slug.split('.')[0],
    description: null as string | null
  }))
  return groupPermissions(withDesc).map(g => ({
    ...g,
    enabledCount: g.permissions.filter((p: any) => (p as any).enabled).length
  }))
})

const currentUserPermissions = computed(() => {
  if (!selectedUser.value) return []
  return userPermissions.value[String(selectedUser.value.id)] || []
})

const groupedUserPermissions = computed(() => {
  const perms = currentUserPermissions.value.map(p => ({
    ...p,
    module: p.slug.split('.')[0],
    description: p.description
  }))
  return groupPermissions(perms)
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

function selectSsoUser(user: SsoUser) {
  selectedUser.value = user
  loadUserPermissions()
}

function openPermPopover(event: Event, permSlug: string) {
  if (saving.value || !selectedUser.value) return
  const userPerms = userPermissions.value[String(selectedUser.value.id)]
  const perm = userPerms?.find(p => p.slug === permSlug)
  currentPermSlug.value = permSlug
  currentPermType.value = perm?.type ?? null
  permDescription.value = getPermDescription(currentPermType.value)
  permPopover.event = event
  permPopover.open = true
}

function selectPermOverride(type: string | null) {
  updateUserOverride(currentPermSlug.value, type)
}

function getPermDescription(type: string | null): string {
  switch (type) {
    case 'grant': return 'Fuerza el permiso como concedido, sin importar los roles'
    case 'deny': return 'Fuerza el permiso como denegado, sin importar los roles'
    default: return 'El permiso se decide según los roles del usuario'
  }
}

async function searchSsoUsers() {
  loadingUsers.value = true
  try {
    const query = userSearchQuery.value.trim()
    const users = await controller.getSsoUsers(query.length >= 2 ? { search: query } : undefined)
    ssoUsers.value = users.filter(u => String(u.id) !== String(userStore.user?.id))
  } catch {
    ssoUsers.value = []
  } finally {
    loadingUsers.value = false
  }
}

async function loadSsoUsers() {
  loadingUsers.value = true
  try {
    const users = await controller.getSsoUsers()
    ssoUsers.value = users.filter(u => String(u.id) !== String(userStore.user?.id))
  } catch {
    ssoUsers.value = []
  } finally {
    loadingUsers.value = false
  }
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadUserPermissions() {
  if (!selectedUser.value) return
  userPermissions.value = await controller.getUserPermissions({ userSsoId: String(selectedUser.value.id) })
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
  if (activeTab.value === 'roles') loadRolePermissions()
  if (activeTab.value === 'users') loadSsoUsers()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function togglePermission(permSlug: string, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p) => p.slug === permSlug)
  if (perm) perm.enabled = enabled
}

function updateUserOverride(permSlug: string, type: string | null) {
  if (!selectedUser.value) return
  const userPerms = userPermissions.value[String(selectedUser.value.id)]
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
    const perms = userPermissions.value[String(selectedUser.value.id)].map((p) => ({
      slug: p.slug,
      type: p.type,
    }))
    await controller.updateUserPermissions({ userSsoId: String(selectedUser.value.id), permissions: perms })
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
  const toast = await toastController.create({ message, duration: 2000, color })
  await toast.present()
}

onMounted(() => {
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
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  color: var(--ion-color-medium);
}
.empty-container {
  text-align: center;
  padding: 32px;
  color: var(--ion-color-medium);
}
.selected-user {
  --background: var(--ion-color-light);
}
.users-list {
  margin-top: 8px;
}
.perm-description {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
  --inner-padding-top: 8px;
  --inner-padding-bottom: 8px;
  --inner-padding-start: 16px;
  --inner-padding-end: 16px;
}
.perm-description p {
  font-size: 12px;
  font-style: italic;
  margin: 0;
}
</style>