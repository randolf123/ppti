import { api, unwrapData } from "./client";
import type { Question, QuestionInput, ExamSubmission } from "@/types";

export async function getQuestions(courseId: number): Promise<Question[]> {
  const res = await api.get(`/api/courses/${courseId}/questions`);
  return unwrapData<Question[]>(res);
}

export async function getQuestion(id: number): Promise<Question> {
  const res = await api.get(`/api/questions/${id}`);
  return unwrapData<Question>(res);
}

export async function createQuestion(
  input: QuestionInput
): Promise<Question> {
  const res = await api.post("/api/questions", input);
  return unwrapData<Question>(res);
}

export async function updateQuestion(
  id: number,
  input: Partial<QuestionInput>
): Promise<Question> {
  const res = await api.put(`/api/questions/${id}`, input);
  return unwrapData<Question>(res);
}

export async function deleteQuestion(id: number): Promise<void> {
  await api.delete(`/api/questions/${id}`);
}

export async function submitExam(
  questionId: number,
  submission: Omit<ExamSubmission, "question_id">
): Promise<{ score: number; total: number }> {
  const res = await api.post(`/api/questions/${questionId}/submit`, submission);
  return unwrapData<{ score: number; total: number }>(res);
}

export async function startExam(
  questionId: number
): Promise<{ time_limit_minutes: number; session_token: string }> {
  const res = await api.post(`/api/questions/${questionId}/start-exam`);
  return unwrapData<{ time_limit_minutes: number; session_token: string }>(res);
}
