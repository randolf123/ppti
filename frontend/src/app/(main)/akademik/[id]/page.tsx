"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Link as LinkIcon,
  Video,
  Image,
  Presentation,
  File,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourse } from "@/lib/api/courses";
import { getMaterials } from "@/lib/api/materials";
import { getTasks, updateTaskProgress } from "@/lib/api/tasks";
import { getQuestions } from "@/lib/api/questions";
import { TaskModal } from "@/components/tugas/task-modal";
import { QuestionList } from "@/components/bank-soal/question-list";
import type { Course, SessionWithMaterials, Task, Question } from "@/types";

export default function MatkulDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const matkulId = Number(params.id);
  const tabParam = searchParams.get("tab") || "materi";
  const sessionParam = searchParams.get("session");

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<SessionWithMaterials[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabParam);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const sessionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matkulId) return;
    Promise.all([
      getCourse(matkulId).catch(() => null),
      getMaterials(matkulId).catch(() => []),
      getTasks(matkulId).catch(() => []),
      getQuestions(matkulId).catch(() => []),
    ])
      .then(([c, m, t, q]) => {
        setCourse(c);
        setMaterials(m);
        setTasks(t);
        setQuestions(q);
      })
      .finally(() => setLoading(false));
  }, [matkulId]);

  // Auto-scroll to session if deep-linked
  useEffect(() => {
    if (sessionParam && sessionRef.current) {
      sessionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessionParam, materials]);

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await updateTaskProgress(taskId, completed);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, progress: { user_id: "", task_id: taskId, completed } }
            : t
        )
      );
    } catch {
      // handle error silently for now
    }
  };

  if (loading) {
    return <MatkulDetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Mata kuliah tidak ditemukan</p>
        <Button variant="link" asChild>
          <Link href="/akademik">Kembali ke Akademik</Link>
        </Button>
      </div>
    );
  }

  const materialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "video":
      case "youtube":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "image":
        return <Image className="h-4 w-4 text-green-500" />;
      case "ppt":
        return <Presentation className="h-4 w-4 text-orange-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/akademik">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
      </Button>

      {/* Course header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{course.code}</Badge>
              <Badge variant="secondary">{course.sks} SKS</Badge>
              {course.cawu && <Badge>Cawu {course.cawu}</Badge>}
            </div>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            {course.description && (
              <p className="text-muted-foreground mt-1">{course.description}</p>
            )}
            {course.instructors && course.instructors.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Dosen: {course.instructors.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materi" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Materi
          </TabsTrigger>
          <TabsTrigger value="tugas" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Tugas
          </TabsTrigger>
          <TabsTrigger value="bank-soal" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Bank Soal
          </TabsTrigger>
        </TabsList>

        {/* Materi Tab */}
        <TabsContent value="materi" className="mt-4">
          {materials.length === 0 ? (
            <EmptyState icon={BookOpen} message="Belum ada materi tersedia" />
          ) : (
            <Accordion
              type="multiple"
              defaultValue={sessionParam ? [`session-${sessionParam}`] : undefined}
            >
              {materials.map((session) => (
                <AccordionItem
                  key={session.id}
                  value={`session-${session.id}`}
                  ref={
                    String(session.id) === sessionParam ? sessionRef : undefined
                  }
                >
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Sesi {session.number}
                      </Badge>
                      <span className="font-medium">{session.title}</span>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {session.Materials?.length || 0} materi
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {session.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.description}
                      </p>
                    )}
                    {!session.Materials || session.Materials.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Belum ada materi untuk sesi ini
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {session.Materials.map((mat) => (
                          <a
                            key={mat.id}
                            href={mat.url}
                            target={
                              mat.type === "pdf" || mat.type === "link" || mat.type === "youtube"
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              mat.type === "pdf" || mat.type === "link" || mat.type === "youtube"
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                          >
                            {materialIcon(mat.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {mat.title}
                              </p>
                              {mat.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {mat.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {mat.type.toUpperCase()}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Tugas Tab */}
        <TabsContent value="tugas" className="mt-4">
          {tasks.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              message="Belum ada tugas untuk matkul ini"
            />
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => {
                const isCompleted = task.progress?.completed;
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center gap-3 w-full text-left rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deadline:{" "}
                        {new Date(task.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {isCompleted && (
                      <Badge variant="success" className="text-xs">
                        Selesai
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Bank Soal Tab */}
        <TabsContent value="bank-soal" className="mt-4">
          <QuestionList questions={questions} courseId={matkulId} />
        </TabsContent>
      </Tabs>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleComplete={handleToggleTask}
        />
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function MatkulDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
