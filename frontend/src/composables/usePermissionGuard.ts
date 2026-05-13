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

  return { can, canRole, guard, guardRole };
}