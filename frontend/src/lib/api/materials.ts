import { api, unwrapData } from "./client";
import type { Material, MaterialInput, SessionWithMaterials } from "@/types";

export async function getMaterials(
  courseId: number
): Promise<SessionWithMaterials[]> {
  const res = await api.get(`/api/courses/${courseId}/materials`);
  return unwrapData<SessionWithMaterials[]>(res);
}

export async function createMaterial(input: MaterialInput): Promise<Material> {
  const res = await api.post("/api/materials", input);
  return unwrapData<Material>(res);
}

export async function updateMaterial(
  materialId: number,
  input: MaterialInput
): Promise<Material> {
  const res = await api.put(`/api/materials/${materialId}`, input);
  return unwrapData<Material>(res);
}

export async function deleteMaterial(materialId: number): Promise<void> {
  await api.delete(`/api/materials/${materialId}`);
}
