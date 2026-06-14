import { api, unwrapData } from "./client";
import type { AcademicEvent, Task, Course } from "@/types";

export interface DashboardSummary {
  today_schedule: {
    course_name: string;
    time: string;
    room: string;
  }[];
  pending_tasks: {
    task_id: number;
    title: string;
    course_name: string;
    course_id: number;
    deadline: string;
    completed: boolean;
  }[];
  active_events: Pick<AcademicEvent, "id" | "title" | "date" | "category">[];
  recent_courses: Pick<Course, "id" | "name" | "code">[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get("/api/dashboard/summary");
  return unwrapData<DashboardSummary>(res);
}
