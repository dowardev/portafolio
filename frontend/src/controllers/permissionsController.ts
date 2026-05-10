import { getApiConnector } from '@/apiConnector'

export interface AvailablePermission {
  id: number
  slug: string
  module: string
  action: string
}

export interface RolePermissionData {
  slug: string
  module: string
  action: string
  enabled: boolean
}

export interface RolePermissions {
  [roleSlug: string]: RolePermissionData[]
}

export interface SyncStatus {
  roles: { slug: string; name: string; is_protected: boolean }[]
  last_sync: string | null
}

export interface UserPermissionOverride {
  slug: string
  module: string
  action: string
  type: 'grant' | 'deny' | null
}

export interface UserPermissions {
  [userId: string]: UserPermissionOverride[]
}

export function usePermissionsController() {
  async function getAvailablePermissions(): Promise<AvailablePermission[]> {
    const response = await getApiConnector().get<AvailablePermission[]>('admin/permissions')
    return response
  }

  async function createPermission(params: { slug: string; module: string; action: string }): Promise<void> {
    const { slug, module, action } = params
    await getApiConnector().post('admin/permissions', { slug, module, action })
  }

  async function updatePermission(params: { id: number; slug?: string; module?: string; action?: string }): Promise<void> {
    const { id, ...body } = params
    await getApiConnector().put(`admin/permissions/${id}`, body)
  }

  async function deletePermission(params: { id: number }): Promise<void> {
    const { id } = params
    await getApiConnector().delete(`admin/permissions/${id}`)
  }

  async function getRolePermissions(): Promise<RolePermissions> {
    const response = await getApiConnector().get<RolePermissions>('admin/permissions/roles')
    return response
  }

  async function updateRolePermissions(params: { roleSlug: string; permissionSlugs: string[] }): Promise<void> {
    const { roleSlug, permissionSlugs } = params
    await getApiConnector().put('admin/permissions/roles', {
      role_slug: roleSlug,
      permission_slugs: permissionSlugs,
    })
  }

  async function getUserPermissions(params?: { userSsoId?: string }): Promise<UserPermissions> {
    const url = params?.userSsoId 
      ? 'admin/permissions/user-override?user_sso_id=' + encodeURIComponent(params.userSsoId)
      : 'admin/permissions/user-override'
    const response = await getApiConnector().get<UserPermissions>(url)
    return response
  }

  async function updateUserPermissions(params: { userSsoId: string; permissions: { slug: string; type: 'grant' | 'deny' | null }[] }): Promise<void> {
    const { userSsoId, permissions } = params
    await getApiConnector().put('admin/permissions/user-override', {
      user_sso_id: userSsoId,
      permissions,
    })
  }

  async function getSyncStatus(): Promise<SyncStatus> {
    const response = await getApiConnector().get<SyncStatus>('admin/permissions/sync-status')
    return response
  }

  async function syncRoles(): Promise<SyncStatus> {
    const response = await getApiConnector().post<SyncStatus>('admin/permissions/sync')
    return response
  }

  return {
    getAvailablePermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getRolePermissions,
    updateRolePermissions,
    getUserPermissions,
    updateUserPermissions,
    getSyncStatus,
    syncRoles,
  }
}