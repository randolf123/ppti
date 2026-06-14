import { api, unwrapData } from "./client";
import type { Course, CourseInput } from "@/types";

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/api/courses");
  return unwrapData<Course[]>(res);
}

export async function getCourse(id: number): Promise<Course> {
  const res = await api.get(`/api/courses/${id}`);
  return unwrapData<Course>(res);
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const res = await api.post("/api/courses", input);
  return unwrapData<Course>(res);
}

export async function updateCourse(
  id: number,
  input: CourseInput
): Promise<Course> {
  const res = await api.put(`/api/courses/${id}`, input);
  return unwrapData<Course>(res);
}

export async function deleteCourse(id: number): Promise<void> {
  await api.delete(`/api/courses/${id}`);
}
