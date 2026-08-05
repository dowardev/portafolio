import { getApiConnector } from '@/apiConnector'

export interface PermissionWithDescription {
  id: number
  slug: string
  module: string
  action: string
  description: string | null
}

export interface SsoUser {
  id: number
  name: string
  user: string
  email: string
}

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
  description: string | null
  type: 'grant' | 'deny' | null
}

export interface UserPermissions {
  [userId: string]: UserPermissionOverride[]
}

export interface GroupedPermission<T = unknown> {
  module: string
  label: string
  permissions: T[]
}

export function groupPermissions<T extends { module: string; action: string; description?: string | null }>(permissions: T[] | undefined | null): GroupedPermission<T>[] {
  if (!permissions || !Array.isArray(permissions)) return []
  const groups: Record<string, T[]> = {}

  for (const perm of permissions) {
    if (!groups[perm.module]) {
      groups[perm.module] = []
    }
    groups[perm.module].push(perm)
  }

  const moduleLabels: Record<string, string> = {
    posts: 'Publicaciones',
    projects: 'Proyectos',
    intro: 'Información de inicio',
    experiences: 'Experiencias',
    certificates: 'Certificados',
    freelance: 'Plataformas Freelance',
    'freelance-comments': 'Comentarios Freelance',
    stacks: 'Stack Tecnológico',
    'techs': 'Tecnologías'
  }

  return Object.entries(groups).map(([module, perms]) => ({
    module,
    label: moduleLabels[module] || module,
    permissions: perms.sort((a, b) => a.action.localeCompare(b.action))
  })).sort((a, b) => a.label.localeCompare(b.label))
}

export function getPermissionLabel(permission: { description?: string | null; action: string; module: string }): string {
  if (permission.description) {
    return permission.description
  }
  const actionLabels: Record<string, string> = {
    create: 'Crear',
    update: 'Editar',
    delete: 'Eliminar'
  }
  const action = actionLabels[permission.action] || permission.action
  const moduleLabels: Record<string, string> = {
    posts: 'publicaciones',
    projects: 'proyectos',
    intro: 'información de inicio',
    experiences: 'experiencias',
    certificates: 'certificados',
    freelance: 'plataformas freelance',
    'freelance-comments': 'comentarios freelance',
    stacks: 'tecnologías del stack',
    'techs': 'tecnologías'
  }
  const module = moduleLabels[permission.module] || permission.module
  return `${action} ${module}`
}

export function usePermissionsController() {
  async function getAvailablePermissions(): Promise<PermissionWithDescription[]> {
    const response = await getApiConnector().get<{ permissions: PermissionWithDescription[] }>('admin/permissions')
    return response.permissions
  }

  async function createPermission(params: { slug: string; module: string; action: string; description?: string }): Promise<void> {
    const { slug, module, action, description } = params
    await getApiConnector().post('admin/permissions', { slug, module, action, description })
  }

  async function updatePermission(params: { id: number; slug?: string; module?: string; action?: string; description?: string }): Promise<void> {
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

  async function getSsoUsers(params?: { search?: string }): Promise<SsoUser[]> {
    const search = params?.search
    const url = search
      ? 'admin/permissions/users?search=' + encodeURIComponent(search)
      : 'admin/permissions/users'
    const response = await getApiConnector().get<{ users: SsoUser[] }>(url)
    return response.users
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
    getSsoUsers,
    getSyncStatus,
    syncRoles,
  }
}