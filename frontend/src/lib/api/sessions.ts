import { api, unwrapData } from "./client";
import type { Session, SessionInput } from "@/types";

export async function getSessions(courseId: number): Promise<Session[]> {
  const res = await api.get(`/api/courses/${courseId}/sessions`);
  return unwrapData<Session[]>(res);
}

export async function createSession(
  courseId: number,
  input: SessionInput
): Promise<Session> {
  const res = await api.post(`/api/courses/${courseId}/sessions`, input);
  return unwrapData<Session>(res);
}

export async function updateSession(
  sessionId: number,
  input: SessionInput
): Promise<Session> {
  const res = await api.put(`/api/sessions/${sessionId}`, input);
  return unwrapData<Session>(res);
}

export async function deleteSession(sessionId: number): Promise<void> {
  await api.delete(`/api/sessions/${sessionId}`);
}
