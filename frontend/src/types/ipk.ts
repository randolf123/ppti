// TODO: API_NOT_READY — seluruh IPK endpoint belum ada di backend
export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "E";

export interface IPKEntry {
  course_id: number;
  course_name: string;
  sks: number;
  grade: Grade | null;
}

export interface IPKCawu {
  cawu: number;
  entries: IPKEntry[];
}

export interface IPKSummary {
  ipk: number;
  per_cawu: { cawu: number; ip: number; total_sks: number }[];
  trend: { cawu: number; ip: number }[];
}
