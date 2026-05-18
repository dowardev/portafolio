import { computed } from 'vue'
import type { PermissionWithDescription } from '@/controllers/permissionsController'

export interface GroupedPermission {
  module: string
  label: string
  permissions: PermissionWithDescription[]
}

export function usePermissionsGrouped() {
  function groupPermissions(permissions: PermissionWithDescription[]): GroupedPermission[] {
    const groups: Record<string, PermissionWithDescription[]> = {}

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
      'skills-categories': 'Categorías de Skills'
    }

    return Object.entries(groups).map(([module, perms]) => ({
      module,
      label: moduleLabels[module] || module,
      permissions: perms.sort((a, b) => a.action.localeCompare(b.action))
    })).sort((a, b) => a.label.localeCompare(b.label))
  }

  function getPermissionLabel(permission: PermissionWithDescription): string {
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
      'skills-categories': 'categorías de skills'
    }
    const module = moduleLabels[permission.module] || permission.module
    return `${action} ${module}`
  }

  return {
    groupPermissions,
    getPermissionLabel
  }
}