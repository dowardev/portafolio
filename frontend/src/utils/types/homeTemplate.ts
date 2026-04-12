export interface SectionConfig {
  id: string;
  title?: string;
  component: any;
  props?: Record<string, any>;
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
  stack?: any[];
  skillCategories?: any[];
  experience?: any[];
  projects?: any[];
  certificates?: any[];
  freelance?: any[];
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