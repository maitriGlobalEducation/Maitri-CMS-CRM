// src/services/university.service.ts

import "server-only";

import { connectDB } from "@/lib/mongodb";
import UniversityModel from "@/models/University";
import type { University } from "@/types/university";

export async function getUniversities(): Promise<University[]> {
  await connectDB();

  const universities = await UniversityModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return universities.map((university) => ({
    ...university,
    id: university._id.toString(),
    _id: undefined,
  })) as unknown as University[];
}

export async function getUniversityById(
  id: string,
): Promise<University | null> {
  await connectDB();

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return null;
  }

  const university = await UniversityModel.findById(id).lean();

  if (!university) {
    return null;
  }

  return {
    ...university,
    id: university._id.toString(),
    _id: undefined,
  } as unknown as University;
}
