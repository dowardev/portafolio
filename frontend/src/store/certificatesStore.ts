import { defineStore } from "pinia";
import { ref } from "vue";
import type { CertificateItem } from "@/services/types";

export const useCertificatesStore = defineStore("certificates", () => {
  const certificates = ref<CertificateItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);
  const saving = ref(false);

  function setCertificates(data: CertificateItem[]): void {
    certificates.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getCertificate(index: number): CertificateItem | undefined {
    return certificates.value[index];
  }

  function addCertificate(certificate: CertificateItem): void {
    certificates.value.push(certificate);
  }

  function updateCertificate(index: number, certificate: CertificateItem): void {
    if (index >= 0 && index < certificates.value.length) {
      certificates.value[index] = certificate;
    }
  }

  function deleteCertificate(index: number): void {
    if (index >= 0 && index < certificates.value.length) {
      certificates.value.splice(index, 1);
    }
  }

  function resetCertificates(): void {
    certificates.value = [];
    loaded.value = false;
  }

  function setSaving(value: boolean): void {
    saving.value = value;
  }

  return {
    certificates,
    loading,
    loaded,
    saving,
    setCertificates,
    setLoading,
    setSaving,
    getCertificate,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    resetCertificates,
  };
});
