import type { Component } from "vue";

export interface SectionConfig {
  id: string;
  title?: string;
  component: Component;
  props?: Record<string, unknown>;
  routeName?: string;
  routeLabel?: string;
  height?: string;
  layout?: {
    columns?: number;
    gap?: string;
    padding?: string;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description?: string;
  sections: SectionConfig[];
  header?: {
    showSegment?: boolean;
    showMenu?: boolean;
    segmentPosition?: "start" | "end" | "floating";
  };
}

export interface HomeTemplateData {
  stack?: unknown[];
  skillCategories?: unknown[];
  experience?: unknown[];
  projects?: unknown[];
  certificates?: unknown[];
  freelance?: unknown[];
  showContactForm?: {
    socials?: boolean;
    freelance?: boolean;
  };
}

export interface ScreenSize {
  width: number;
  height: number;
  preset: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}

export interface TemplateSectionProps {
  section: SectionConfig;
  data: HomeTemplateData;
  screenSize: ScreenSize;
  designMode: string;
}