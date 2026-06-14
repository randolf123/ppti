"use client";
import { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourses } from "@/lib/api/courses";
import { getCourseMonitoring, type TaskMonitoring } from "@/lib/api/monitoring";
import type { Course } from "@/types";

export default function MonitoringPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [monitoring, setMonitoring] = useState<TaskMonitoring[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingMonitoring(true);
    getCourseMonitoring(Number(selectedCourse))
      .then(setMonitoring)
      .catch(() => setMonitoring([]))
      .finally(() => setLoadingMonitoring(false));
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Monitoring Tugas
        </h1>
        <p className="text-muted-foreground">
          Pantau progres pengumpulan tugas mahasiswa
        </p>
      </div>

      {/* Course selector */}
      <div className="max-w-xs">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata kuliah" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loadingMonitoring ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : !selectedCourse ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Pilih mata kuliah untuk melihat progres tugas
            </p>
          </CardContent>
        </Card>
      ) : monitoring.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Belum ada data tugas untuk mata kuliah ini
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {monitoring.map((task) => (
            <TaskMonitoringCard key={task.task_id} data={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskMonitoringCard({ data }: { data: TaskMonitoring }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{data.task_title}</CardTitle>
          <Badge variant={data.completion_rate >= 80 ? "success" : data.completion_rate >= 50 ? "secondary" : "destructive"}>
            {data.completion_rate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {data.completed_count} dari {data.total_students} mahasiswa
            </span>
            <span className="font-medium">{data.completion_rate}%</span>
          </div>
          <Progress value={data.completion_rate} className="h-3" />
        </div>

        {/* Split table */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Completed */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                Sudah Selesai ({data.completed.length})
              </span>
            </div>
            <div className="rounded-md border overflow-hidden">
              {data.completed.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  Belum ada yang selesai
                </div>
              ) : (
                <div className="divide-y max-h-[200px] overflow-y-auto">
                  {data.completed.map((student) => (
                    <div
                      key={student.user_id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.nim}
                        </p>
                      </div>
                      {student.completed_at && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(student.completed_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Belum Selesai ({data.pending.length})
              </span>
            </div>
            <div className="rounded-md border overflow-hidden">
              {data.pending.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  Semua sudah selesai! 🎉
                </div>
              ) : (
                <div className="divide-y max-h-[200px] overflow-y-auto">
                  {data.pending.map((student) => (
                    <div
                      key={student.user_id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.nim}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
