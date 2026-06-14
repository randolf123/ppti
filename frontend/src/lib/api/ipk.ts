import { api, unwrapData } from "./client";
import type { IPKCawu, IPKSummary } from "@/types";

// Backend menggunakan /api/grades (lebih RESTful dari /api/ipk)
export async function getIPKData(): Promise<IPKCawu[]> {
  const res = await api.get("/api/grades");
  return unwrapData<IPKCawu[]>(res);
}

export async function getIPKSummary(): Promise<IPKSummary> {
  const res = await api.get("/api/grades");
  return unwrapData<IPKSummary>(res);
}

export async function getIPKTemplate(cawu: number): Promise<IPKCawu> {
  const res = await api.get(`/api/grades/template?cawu=${cawu}`);
  return unwrapData<IPKCawu>(res);
}

export async function updateIPKEntry(
  cawu: number,
  course_id: number,
  grade: string | null
): Promise<IPKCawu[]> {
  const res = await api.put("/api/grades", { cawu, course_id, grade });
  return unwrapData<IPKCawu[]>(res);
}

export async function updateIPKCawu(
  cawu: number,
  entries: { course_id: number; grade: string | null }[]
): Promise<IPKSummary> {
  const res = await api.put("/api/grades", { cawu, entries });
  return unwrapData<IPKSummary>(res);
}
