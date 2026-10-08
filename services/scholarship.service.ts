import type { Scholarship } from "@/types/scholarship";

interface ScholarshipResponse {
  success: boolean;
  data: Scholarship;
  message?: string;
}

interface ScholarshipsResponse {
  success: boolean;
  data: Scholarship[];
  message?: string;
}

export async function getScholarships(): Promise<Scholarship[]> {
  const response = await fetch("/api/cms/scholarships");

  const result: ScholarshipsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch scholarships");
  }

  return result.data;
}

export async function getScholarship(id: string): Promise<Scholarship> {
  const response = await fetch(`/api/cms/scholarships/${id}`);

  const result: ScholarshipResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch scholarship");
  }

  return result.data;
}
