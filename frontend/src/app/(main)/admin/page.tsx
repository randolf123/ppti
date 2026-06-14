"use client";
import Link from "next/link";
import { BookOpen, Calendar, ClipboardList, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ADMIN_ACTIONS = [
  {
    title: "Kelola Kurikulum",
    description: "Tambah, edit, atau hapus mata kuliah, sesi, dan materi",
    icon: BookOpen,
    href: "/admin/curriculum",
  },
  {
    title: "Kalender Akademik",
    description: "Kelola event, jadwal ujian, dan kegiatan akademik",
    icon: Calendar,
    href: "/admin/calendar",
  },
  {
    title: "Monitoring Tugas",
    description: "Pantau progres tugas seluruh mahasiswa",
    icon: Users,
    href: "/admin/monitoring",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">
          Kelola konten akademik dan pantau progres
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
