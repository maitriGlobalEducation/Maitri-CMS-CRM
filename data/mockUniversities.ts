// src/data/mockUniversities.ts

import { University } from "@/types/university";

export const mockUniversities: University[] = [
  {
    id: "1",
    name: "Domus Academy",
    slug: "domus-academy",

    country: "Italy",
    city: "Milan",

    shortDescription: "International design academy in Milan.",
    description: "University description goes here.",

    logoUrl: "/universities/domus-logo.png",
    coverImageUrl: "/universities/domus-cover.jpg",

    featured: true,
    status: "published",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
