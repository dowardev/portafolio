import { defineStore } from "pinia";
import { User } from "../utils/interfaces";
import userAvatar from "@/assets/otros/user.png";
import { ref, computed } from "vue";

interface UserState {
  user: User;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<undefined | User>(undefined);
  const isLogged = ref<boolean>(false);

  // roles (string[]) proviene del portfolio backend (my-permissions) y contiene solo slugs.
  // No confundir con user.roles (Role[]) que viene del SSO server (/me) con objetos completos.
  // Esta separación es intencional: SSO = autenticación/global roles, portfolio backend = autorización/permisos.
  const roles = ref<string[]>([]);

  // permissions proviene exclusivamente del portfolio backend (my-permissions).
  // El SSO no maneja permisos granulares por aplicación.
  const permissions = ref<Record<string, boolean>>({});
  const permissionsLoaded = ref(false);

  function imageProfile() {
    const imageProfile = user.value?.imageProfile;
    if (imageProfile) return "data:image/png;base64," + imageProfile;
    return userAvatar;
  }

  function updateUserProps(params: User) {
    const userParam = params;
    user.value = userParam;
  }

  function updateUserLoggedProp(isLoggedParam: boolean) {
    isLogged.value = isLoggedParam;
  }

  function setPermissions(params: { roles: string[]; permissions: Record<string, boolean> }) {
    roles.value = params.roles;
    permissions.value = params.permissions;
    permissionsLoaded.value = true;
  }

  function hasRole(params: { slug: string }): boolean {
    return roles.value.includes(params.slug);
  }

  function hasPermission(params: { slug: string }): boolean {
    if (roles.value.includes('admin')) return true;
    return permissions.value[params.slug] === true;
  }

  function hasAnyRole(params: { slugs: string[] }): boolean {
    return params.slugs.some(s => roles.value.includes(s));
  }

  function hasAnyPermission(params: { slugs: string[] }): boolean {
    if (roles.value.includes('admin')) return true;
    return params.slugs.some(s => permissions.value[s] === true);
  }

  function can(params: { role?: string; permission?: string }): boolean {
    if (params.role && hasRole({ slug: params.role })) return true;
    if (params.permission && hasPermission({ slug: params.permission })) return true;
    return false;
  }

  function logout() {
    user.value = undefined;
    roles.value = [];
    permissions.value = {};
    permissionsLoaded.value = false;
  }

  function clearPermissions() {
    roles.value = [];
    permissions.value = {};
    permissionsLoaded.value = false;
  }

  return {
    user,
    isLogged,
    roles,
    permissions,
    permissionsLoaded,
    imageProfile,
    updateUserProps,
    updateUserLoggedProp,
    setPermissions,
    clearPermissions,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    can,
    logout,
  };
});