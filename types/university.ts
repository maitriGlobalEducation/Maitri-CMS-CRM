// src/types/university.ts

export type UniversityStatus = "draft" | "published";

export interface University {
  id: string;

  name: string;
  slug: string;

  country: string;
  city: string;

  shortDescription: string;
  description: string;

  logoUrl: string;
  coverImageUrl: string;

  featured: boolean;
  status: UniversityStatus;

  createdAt: string;
  updatedAt: string;
}
