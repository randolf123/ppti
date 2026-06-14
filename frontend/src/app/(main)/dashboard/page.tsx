"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getDashboardSummary, type DashboardSummary } from "@/lib/api/dashboard";
import { ROUTES } from "@/lib/constants/routes";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas akademik Anda
        </p>
      </div>

      {/* Top widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Schedule today */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.today_schedule.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada jadwal hari ini
              </p>
            ) : (
              data.today_schedule.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="rounded bg-primary/10 p-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.course_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.time} • {item.room}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Tugas Belum Selesai
              <Badge variant="secondary" className="ml-auto">
                {data.pending_tasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pending_tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Semua tugas sudah selesai! 🎉
              </p>
            ) : (
              data.pending_tasks.slice(0, 3).map((task) => (
                <Link
                  key={task.task_id}
                  href={`/akademik/${task.course_id}?tab=tugas`}
                  className="flex items-start gap-3 hover:bg-accent -mx-2 px-2 py-1 rounded"
                >
                  <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.course_name} •{" "}
                      {new Date(task.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
            {data.pending_tasks.length > 3 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href={ROUTES.AKADEMIK}>
                  Lihat semua tugas
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Event Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.active_events.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada event mendatang
              </p>
            ) : (
              data.active_events.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="rounded bg-primary/10 p-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent courses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Akses Cepat Matkul
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent_courses.map((course) => (
              <Link
                key={course.id}
                href={`/akademik/${course.id}`}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.code}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
