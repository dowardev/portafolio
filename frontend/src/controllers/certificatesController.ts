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

  async addCertificate(certificate: CertificateItem): Promise<boolean> {
    try {
      this.certificatesStore.setSaving(true);

      const formData = new FormData();
      formData.append("certificate", JSON.stringify(certificate));

      if (certificate.img) {
        const response = await fetch(certificate.img);
        const blob = await response.blob();
        formData.append("image", blob, "certificate.jpg");
      }

      const data = await api.post<CertificatesResponse>({
        url: "admin/add-certificate",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.certificatesStore.setCertificates(data.certificates || []);
      this.certificatesStore.setSaving(false);
      return true;
    } catch (error) {
      this.certificatesStore.setSaving(false);
      console.error("Error adding certificate:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el certificado",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteCertificate(id: string): Promise<boolean> {
    try {
      const data = await api.post<CertificatesResponse>({
        url: "admin/delete-certificate",
        data: { id },
      });

      this.certificatesStore.setCertificates(data.certificates || []);
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

  async updateCertificate(id: string, certificate: CertificateItem): Promise<boolean> {
    try {
      this.certificatesStore.setSaving(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("certificate", JSON.stringify(certificate));

      if (certificate.img) {
        const response = await fetch(certificate.img);
        const blob = await response.blob();
        formData.append("image", blob, "certificate.jpg");
      }

      const data = await api.post<CertificatesResponse>({
        url: "admin/update-certificate",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.certificatesStore.setCertificates(data.certificates || []);
      this.certificatesStore.setSaving(false);
      return true;
    } catch (error) {
      this.certificatesStore.setSaving(false);
      console.error("Error updating certificate:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el certificado",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}