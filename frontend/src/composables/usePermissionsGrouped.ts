import { computed } from 'vue'

export interface GroupedPermission<T = any> {
  module: string
  label: string
  permissions: T[]
}

export function usePermissionsGrouped() {
  function groupPermissions<T extends { module: string; action: string; description?: string | null }>(permissions: T[] | undefined | null): GroupedPermission<T>[] {
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

  function getPermissionLabel(permission: { description?: string | null; action: string; module: string }): string {
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

  return {
    groupPermissions,
    getPermissionLabel
  }
}