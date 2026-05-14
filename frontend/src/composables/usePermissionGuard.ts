import { alertController } from "@ionic/vue";
import { useUserStore } from "@/store/userStore";

export function usePermissionGuard() {
  const userStore = useUserStore();

  function can(params: { permission: string }): boolean {
    return userStore.can({ permission: params.permission });
  }

  function canRole(params: { role: string }): boolean {
    return userStore.can({ role: params.role });
  }

  function canAny(params: { permissions: string[] }): boolean {
    return userStore.hasAnyPermission({ slugs: params.permissions });
  }

  function canAll(params: { permissions: string[] }): boolean {
    return params.permissions.every((slug) => userStore.hasPermission({ slug }));
  }

  function canAnyRole(params: { roles: string[] }): boolean {
    return userStore.hasAnyRole({ slugs: params.roles });
  }

  function canAllRoles(params: { roles: string[] }): boolean {
    return params.roles.every((slug) => userStore.hasRole({ slug }));
  }

  async function guard(params: {
    permission: string;
    message?: string;
  }): Promise<boolean> {
    if (userStore.can({ permission: params.permission })) return true;
    const alert = await alertController.create({
      header: "Sin permisos",
      message: params.message ??
        "No tienes permisos para realizar esta acción. Contacta al administrador.",
      buttons: ["OK"],
    });
    await alert.present();
    return false;
  }

  async function guardRole(params: {
    role: string;
    message?: string;
  }): Promise<boolean> {
    if (userStore.can({ role: params.role })) return true;
    const alert = await alertController.create({
      header: "Sin permisos",
      message: params.message ??
        "No tienes permisos para realizar esta acción. Contacta al administrador.",
      buttons: ["OK"],
    });
    await alert.present();
    return false;
  }

  return { can, canRole, canAny, canAll, canAnyRole, canAllRoles, guard, guardRole };
}