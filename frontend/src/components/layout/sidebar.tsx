"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  Settings,
  Calendar,
  ClipboardList,
  Users,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  canAccessAdmin,
  canWriteCalendar,
  canViewMonitoring,
  isSuperAdmin,
} from "@/lib/utils/role-guard";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const mainNav: NavItem[] = [
    { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { href: ROUTES.AKADEMIK, label: "Akademik", icon: BookOpen },
    { href: ROUTES.IPK, label: "Kalkulator IPK", icon: Calculator },
  ];

  const adminNav: NavItem[] = [];
  if (role && canAccessAdmin(role)) {
    adminNav.push({
      href: ROUTES.ADMIN_CURRICULUM,
      label: "Kelola Kurikulum",
      icon: Settings,
    });
  }
  if (role && canWriteCalendar(role)) {
    adminNav.push({
      href: ROUTES.ADMIN_CALENDAR,
      label: "Kalender Akademik",
      icon: Calendar,
    });
  }
  if (role && canViewMonitoring(role)) {
    adminNav.push({
      href: ROUTES.ADMIN_MONITORING,
      label: "Monitoring Tugas",
      icon: Users,
    });
  }
  if (role && isSuperAdmin(role)) {
    adminNav.push({
      href: ROUTES.ADMIN_USERS,
      label: "Kelola User",
      icon: UserCog,
    });
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r bg-background",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">PPTI Academic</h1>
            <p className="text-xs text-muted-foreground">Manajemen Kelas</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Main nav */}
        <div className="space-y-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Admin nav */}
        {adminNav.length > 0 && (
          <>
            <div className="my-4">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </p>
            </div>
            <div className="space-y-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 PPTI Academic
        </p>
      </div>
    </aside>
  );
}
