import { api, unwrapData } from "./client";
import type { Task, TaskInput, TaskProgress, TaskWithProgress } from "@/types";

export async function getTasks(courseId: number): Promise<Task[]> {
  const res = await api.get(`/api/courses/${courseId}/tasks`);
  return unwrapData<Task[]>(res);
}

export async function createTask(
  courseId: number,
  input: TaskInput
): Promise<Task> {
  const res = await api.post(`/api/courses/${courseId}/tasks`, input);
  return unwrapData<Task>(res);
}

export async function updateTask(
  taskId: number,
  input: TaskInput
): Promise<Task> {
  const res = await api.put(`/api/tasks/${taskId}`, input);
  return unwrapData<Task>(res);
}

export async function deleteTask(taskId: number): Promise<void> {
  await api.delete(`/api/tasks/${taskId}`);
}

export async function updateTaskProgress(
  taskId: number,
  completed: boolean
): Promise<TaskProgress> {
  const res = await api.patch(`/api/tasks/${taskId}/progress`, { completed });
  return unwrapData<TaskProgress>(res);
}
