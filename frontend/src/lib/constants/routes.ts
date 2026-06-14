export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  AKADEMIK: "/akademik",
  AKADEMIK_DETAIL: (id: number | string) => `/akademik/${id}`,
  IPK: "/ipk",
  ADMIN: "/admin",
  ADMIN_CURRICULUM: "/admin/curriculum",
  ADMIN_CALENDAR: "/admin/calendar",
  ADMIN_MONITORING: "/admin/monitoring",
  ADMIN_USERS: "/admin/users",
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
