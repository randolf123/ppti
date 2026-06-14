import type { Grade } from "@/types";

export const GRADE_POINTS: Record<Grade, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  D: 1.0,
  E: 0.0,
};

export const GRADE_OPTIONS: Grade[] = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "D",
  "E",
];

export const CAWU_LABELS: Record<number, string> = {
  1: "Cawu 1",
  2: "Cawu 2",
  3: "Cawu 3",
  4: "Cawu 4",
  5: "Cawu 5",
};

export const TOTAL_CAWU = 5;
