import { useCertificatesStore } from "@/store/certificatesStore";
import type { CertificateItem } from "@/services/types";
import { ToastController } from "./toastController";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface CertificatesResponse {
  certificates: CertificateItem[];
}

export default class CertificatesController {
  private certificatesStore = useCertificatesStore();
  private toastController = new ToastController();

  async loadPublicCertificates(): Promise<void> {
    if (this.certificatesStore.loaded && this.certificatesStore.certificates.length > 0) {
      return;
    }
    this.certificatesStore.setLoading(true);
    try {
      const data = await api.get<CertificatesResponse>({ url: "get-certificates" });
      this.certificatesStore.setCertificates(data.certificates || []);
    } catch (error) {
      console.error("Error loading certificates:", error);
      this.certificatesStore.setCertificates([]);
    } finally {
      this.certificatesStore.setLoading(false);
    }
  }

  async loadCertificates(): Promise<void> {
    await this.loadPublicCertificates();
  }

  getCertificates(): CertificateItem[] {
    return this.certificatesStore.certificates;
  }

  getCertificate(index: number): CertificateItem | undefined {
    return this.certificatesStore.getCertificate(index);
  }

  async saveCertificate(certificate: CertificateItem, index?: number): Promise<boolean> {
    try {
      this.certificatesStore.setSaving(true);
      if (index !== undefined) {
        this.certificatesStore.updateCertificate(index, certificate);
      } else {
        this.certificatesStore.addCertificate(certificate);
      }

      const formData = new FormData();
      formData.append("certificates", JSON.stringify(this.certificatesStore.certificates));
      await api.post<CertificatesResponse>({
        url: "admin/update-certificates",
        data: formData,
        contentType: "multipart/form-data",
      });
      this.certificatesStore.setSaving(false);
      return true;
    } catch (error) {
      this.certificatesStore.setSaving(false);
      console.error("Error saving certificate:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar el certificado",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteCertificate(index: number): Promise<boolean> {
    try {
      this.certificatesStore.deleteCertificate(index);

      const formData = new FormData();
      formData.append("certificates", JSON.stringify(this.certificatesStore.certificates));
      await api.post<CertificatesResponse>({
        url: "admin/update-certificates",
        data: formData,
        contentType: "multipart/form-data",
      });
      return true;
    } catch (error) {
      console.error("Error deleting certificate:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el certificado",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async addCertificate(certificate: CertificateItem): Promise<boolean> {
    return this.saveCertificate(certificate);
  }
}
