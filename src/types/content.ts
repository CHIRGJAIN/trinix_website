export type ProjectCta = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  status: string;
  link?: string;
  domain?: string;
  keyFeatures?: string[];
  spotlightNote?: string;
  ctas?: ProjectCta[];
};

export type ResearchPaper = {
  id: string;
  title: string;
  summary: string;
  year: number;
  link?: string;
};

export type ResearchCatalogue = {
  preprints: ResearchPaper[];
  published: ResearchPaper[];
};

export type JobRole = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  link?: string;
};
