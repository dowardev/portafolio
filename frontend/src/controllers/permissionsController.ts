import { api } from '@/services/api'

interface Permission {
  id: number
  slug: string
  name: string
  module: string
}

interface RolePermissionData {
  id: number
  slug: string
  name: string
  module: string
  enabled: boolean
}

interface RolePermissions {
  [roleSlug: string]: RolePermissionData[]
}

interface SyncStatus {
  roles: { slug: string; name: string; is_protected: boolean }[]
  last_sync: string | null
}

export function usePermissionsController() {
  async function getPermissions(module?: string): Promise<Permission[]> {
    const params = module ? { module } : {}
    const { data } = await api.get('/admin/permissions', { params })
    return data
  }

  async function createPermission(params: { slug: string; name: string; module: string }): Promise<Permission> {
    const { data } = await api.post('/admin/permissions', params)
    return data.permission
  }

  async function updatePermission(id: number, params: { name?: string; module?: string }): Promise<Permission> {
    const { data } = await api.put(`/admin/permissions/${id}`, params)
    return data.permission
  }

  async function deletePermission(id: number): Promise<void> {
    await api.delete(`/admin/permissions/${id}`)
  }

  async function getRolePermissions(): Promise<RolePermissions> {
    const { data } = await api.get('/admin/permissions/roles')
    return data
  }

  async function updateRolePermissions(roleSlug: string, permissionIds: number[]): Promise<void> {
    await api.put('/admin/permissions/roles', {
      role_slug: roleSlug,
      permission_ids: permissionIds,
    })
  }

  async function getSyncStatus(): Promise<SyncStatus> {
    const { data } = await api.get('/admin/permissions/sync-status')
    return data
  }

  async function syncRoles(): Promise<SyncStatus> {
    const { data } = await api.post('/admin/permissions/sync')
    return data
  }

  return {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getRolePermissions,
    updateRolePermissions,
    getSyncStatus,
    syncRoles,
  }
}