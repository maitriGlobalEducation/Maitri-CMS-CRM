export type ScholarshipStatus = "draft" | "published";

export type ScholarshipFieldType =
  | "text"
  | "email"
  | "phone"
  | "select"
  | "date"
  | "checkbox";

export interface ScholarshipImage {
  url: string;
  publicId: string;
}

export interface ScholarshipFormField {
  key: string;
  label: string;
  type: ScholarshipFieldType;
  required: boolean;
}

export interface ScholarshipApplicationForm {
  fields: ScholarshipFormField[];
}

export interface Scholarship {
  _id: string;

  title: string;
  slug: string;

  cardImage: ScholarshipImage | null;
  contentImage: ScholarshipImage | null;

  deadline: string | null;

  content: Record<string, unknown>;

  applicationForm: ScholarshipApplicationForm;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeyword: string;

  status: ScholarshipStatus;

  createdAt: string;
  updatedAt: string;
}
