import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export interface SeoSettings {
  siteTitle: string | null;
  siteDescription: string | null;
  siteImageUrl: string | null;
  siteImagePath: string | null;
  siteKeywords: string | null;
  langCode: string;
  ogSiteName: string | null;
  twitterHandle: string | null;
  robotsIndex: boolean;
  canonicalBase: string | null;
  adminApiUrl: string | null;
}

export const useSeoSettingsStore = defineStore("seoSettings", () => {
  const loading = ref(false);
  const loaded = ref(false);

  const data = reactive<SeoSettings>({
    siteTitle: null,
    siteDescription: null,
    siteImageUrl: null,
    siteImagePath: null,
    siteKeywords: null,
    langCode: "es",
    ogSiteName: null,
    twitterHandle: null,
    robotsIndex: true,
    canonicalBase: null,
    adminApiUrl: null,
  });

  function setData(newData: Partial<SeoSettings>) {
    if (newData.siteTitle !== undefined) data.siteTitle = newData.siteTitle;
    if (newData.siteDescription !== undefined) data.siteDescription = newData.siteDescription;
    if (newData.siteImageUrl !== undefined) data.siteImageUrl = newData.siteImageUrl;
    if (newData.siteImagePath !== undefined) data.siteImagePath = newData.siteImagePath;
    if (newData.siteKeywords !== undefined) data.siteKeywords = newData.siteKeywords;
    if (newData.langCode !== undefined) data.langCode = newData.langCode;
    if (newData.ogSiteName !== undefined) data.ogSiteName = newData.ogSiteName;
    if (newData.twitterHandle !== undefined) data.twitterHandle = newData.twitterHandle;
    if (newData.robotsIndex !== undefined) data.robotsIndex = newData.robotsIndex;
    if (newData.canonicalBase !== undefined) data.canonicalBase = newData.canonicalBase;
    if (newData.adminApiUrl !== undefined) data.adminApiUrl = newData.adminApiUrl;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setLoaded(value: boolean) {
    loaded.value = value;
  }

  return {
    data,
    loading,
    loaded,
    setData,
    setLoading,
    setLoaded,
  };
});