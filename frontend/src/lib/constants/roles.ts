import type { Role } from "@/types";

export const ROLES: Role[] = [
  "super_admin",
  "kurikulum",
  "sekretaris",
  "komti",
  "wakomti",
  "warga_lokal",
  "lainnya",
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  kurikulum: "Kurikulum",
  sekretaris: "Sekretaris",
  komti: "Komti",
  wakomti: "Wakomti",
  warga_lokal: "Warga Lokal",
  lainnya: "Lainnya",
};

// Roles that can access Admin Panel
export const ADMIN_ROLES: Role[] = [
  "super_admin",
  "kurikulum",
  "sekretaris",
  "komti",
  "wakomti",
];

// Roles that can write curriculum content
export const CURRICULUM_WRITE_ROLES: Role[] = ["super_admin", "kurikulum"];

// Roles that can write calendar events
export const CALENDAR_WRITE_ROLES: Role[] = ["super_admin", "sekretaris"];

// Roles that can view monitoring
export const MONITORING_ROLES: Role[] = [
  "super_admin",
  "kurikulum",
  "sekretaris",
  "komti",
  "wakomti",
];
