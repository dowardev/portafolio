import { useCertificatesStore } from "@/store/certificatesStore";
import { storeToRefs } from "pinia";
import type { CertificateItem } from "@/services/types";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";

interface CertificatesResponse {
  certificates: CertificateItem[];
}

interface CertificateResponse {
  certificate: CertificateItem;
}

export default class CertificatesController {
  certificatesStore = useCertificatesStore();
  private toastController = new ToastController();

  async loadPublicCertificates(): Promise<CertificateItem[]> {
    if (this.certificatesStore.loaded && this.certificatesStore.certificates.length > 0) {
      return this.certificatesStore.certificates;
    }
    this.certificatesStore.setLoading(true);
    try {
      const data = await getApiConnector().get<CertificatesResponse>("certificates");
      this.certificatesStore.setCertificates(data.certificates || []);
      return data.certificates || [];
    } catch (error) {
      console.error("Error loading certificates:", error);
      this.certificatesStore.setCertificates([]);
      return [];
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

  async addCertificate(certificate: CertificateItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("title", certificate.title);

      if (certificate.url) {
        formData.append("url", certificate.url);
      }
      if (certificate.aptitudes) {
        formData.append("aptitudes", JSON.stringify(certificate.aptitudes));
      }

      if (imageFile) {
        formData.append("image", imageFile, "certificate.jpg");
      }

      await getApiConnector().post<CertificateResponse>(
        "admin/certificates",
        formData,
      );

      this.certificatesStore.addCertificate(certificate);
      this.certificatesStore.setCertificates([...this.certificatesStore.certificates]);

      const toast = await this.toastController.presentToast({
        message: "Certificado agregado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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
      const index = this.certificatesStore.certificates.findIndex((c) => c.id === id);
      if (index === -1) return false;

      await getApiConnector().delete(`admin/certificates/${id}`);

      this.certificatesStore.deleteCertificate(index);
      this.certificatesStore.setCertificates([...this.certificatesStore.certificates]);

      const toast = await this.toastController.presentToast({
        message: "Certificado eliminado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
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

  async updateCertificate(id: string, certificate: CertificateItem, imageFile?: File | null): Promise<boolean> {
    try {
      const index = this.certificatesStore.certificates.findIndex((c) => c.id === id);
      if (index === -1) return false;

      const formData = new FormData();
      formData.append("title", certificate.title);

      if (certificate.url) {
        formData.append("url", certificate.url);
      }
      if (certificate.aptitudes) {
        formData.append("aptitudes", JSON.stringify(certificate.aptitudes));
      }

      if (imageFile) {
        formData.append("image", imageFile, "certificate.jpg");
      }

      await getApiConnector().post<CertificateResponse>(
        `admin/certificates/${id}`,
        formData,
      );

      this.certificatesStore.updateCertificate(index, certificate);
      this.certificatesStore.setCertificates([...this.certificatesStore.certificates]);

      const toast = await this.toastController.presentToast({
        message: "Certificado actualizado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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

  get certificates() {
    return storeToRefs(this.certificatesStore).certificates;
  }

  get certificatesLoading() {
    return storeToRefs(this.certificatesStore).loading;
  }
}