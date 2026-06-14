export interface Course {
  id: number;
  code: string;
  name: string;
  sks: number;
  description?: string;
  instructors?: string[];
  cawu?: number; // TODO: API_NOT_READY — field belum ada di backend
  created_at: string;
  updated_at: string;
}

export interface CourseInput {
  code: string;
  name: string;
  sks: number;
  description?: string;
  instructors?: string[];
  cawu?: number;
}
