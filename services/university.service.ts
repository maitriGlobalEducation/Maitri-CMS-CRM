// src/services/university.service.ts

import { mockUniversities } from "@/data/mockUniversities";
import { University } from "@/types/university";

export async function getUniversities(): Promise<University[]> {
  return mockUniversities;
}

export async function getUniversityById(
  id: string,
): Promise<University | null> {
  return mockUniversities.find((university) => university.id === id) ?? null;
}
