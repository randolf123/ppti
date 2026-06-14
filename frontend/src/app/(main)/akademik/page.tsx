"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourses } from "@/lib/api/courses";
import type { Course } from "@/types";

export default function AkademikPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [cawuFilter, setCawuFilter] = useState<string>("all");

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Group courses by cawu (or show all if no cawu field)
  const filteredCourses =
    cawuFilter === "all"
      ? courses
      : courses.filter((c) => String(c.cawu) === cawuFilter);

  if (loading) {
    return <AkademikSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Akademik</h1>
          <p className="text-muted-foreground">Daftar mata kuliah Anda</p>
        </div>

        {/* Cawu filter */}
        <Select value={cawuFilter} onValueChange={setCawuFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semua Cawu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Cawu</SelectItem>
            <SelectItem value="1">Cawu 1</SelectItem>
            <SelectItem value="2">Cawu 2</SelectItem>
            <SelectItem value="3">Cawu 3</SelectItem>
            <SelectItem value="4">Cawu 4</SelectItem>
            <SelectItem value="5">Cawu 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Belum ada mata kuliah</p>
            <p className="text-sm text-muted-foreground">
              {cawuFilter !== "all"
                ? "Tidak ada matkul untuk Cawu ini"
                : "Matkul akan muncul setelah ditambahkan admin"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/akademik/${course.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {course.code}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {course.sks} SKS
                        </Badge>
                      </div>
                      <h3 className="font-semibold truncate">{course.name}</h3>
                      {course.instructors && course.instructors.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{course.instructors.join(", ")}</span>
                        </div>
                      )}
                      {course.cawu && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Cawu {course.cawu}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AkademikSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
