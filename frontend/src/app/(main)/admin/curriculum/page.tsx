"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/api/courses";
import { getSessions, createSession, deleteSession } from "@/lib/api/sessions";
import { createMaterial, deleteMaterial } from "@/lib/api/materials";
import type { Course, Session } from "@/types";

export default function CurriculumPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourseForSession, setSelectedCourseForSession] =
    useState<Course | null>(null);
  const [selectedCourseForMaterial, setSelectedCourseForMaterial] =
    useState<Course | null>(null);
  const [sessions, setSessions] = useState<Record<number, Session[]>>({});

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
      // Load sessions for each course
      const sessionMap: Record<number, Session[]> = {};
      for (const course of data) {
        try {
          sessionMap[course.id] = await getSessions(course.id);
        } catch {
          sessionMap[course.id] = [];
        }
      }
      setSessions(sessionMap);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCourse(id: number) {
    if (!confirm("Yakin ingin menghapus matkul ini?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Gagal menghapus matkul");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kurikulum</h1>
          <p className="text-muted-foreground">
            Tambah dan kelola mata kuliah, sesi, dan materi
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowMaterialDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Materi
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSessionDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Sesi
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditingCourse(null);
              setShowCourseDialog(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Matkul
          </Button>
        </div>
      </div>

      {/* Course list */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Belum ada mata kuliah</p>
            <p className="text-sm text-muted-foreground">
              Klik &quot;Tambah Matkul&quot; untuk memulai
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{course.code}</Badge>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <Badge variant="secondary">{course.sks} SKS</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCourse(course);
                        setShowCourseDialog(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {sessions[course.id]?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sessions[course.id].map((session) => (
                      <Badge key={session.id} variant="secondary">
                        Sesi {session.number}: {session.title}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada sesi
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Dialog */}
      <CourseDialog
        open={showCourseDialog}
        onOpenChange={setShowCourseDialog}
        course={editingCourse}
        onSaved={() => {
          setShowCourseDialog(false);
          loadCourses();
        }}
      />

      {/* Session Dialog */}
      <SessionDialog
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        courses={courses}
        onSaved={() => {
          setShowSessionDialog(false);
          loadCourses();
        }}
      />

      {/* Material Wizard */}
      <MaterialWizard
        open={showMaterialDialog}
        onOpenChange={setShowMaterialDialog}
        courses={courses}
        sessions={sessions}
        onSaved={() => {
          setShowMaterialDialog(false);
        }}
      />
    </div>
  );
}

// --- Course Dialog ---
function CourseDialog({
  open,
  onOpenChange,
  course,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    sks: 3,
    description: "",
    instructors: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        code: course.code,
        name: course.name,
        sks: course.sks,
        description: course.description || "",
        instructors: course.instructors?.join(", ") || "",
      });
    } else {
      setForm({
        code: "",
        name: "",
        sks: 3,
        description: "",
        instructors: "",
      });
    }
  }, [course, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const input = {
        code: form.code,
        name: form.name,
        sks: form.sks,
        description: form.description || undefined,
        instructors: form.instructors
          ? form.instructors.split(",").map((s) => s.trim())
          : [],
      };
      if (course) {
        await updateCourse(course.id, input);
      } else {
        await createCourse(input);
      }
      onSaved();
    } catch {
      alert("Gagal menyimpan matkul");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Edit" : "Tambah"} Mata Kuliah</DialogTitle>
          <DialogDescription>
            {course
              ? "Perbarui informasi mata kuliah"
              : "Tambahkan mata kuliah baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kode</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="CS101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>SKS</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={form.sks}
                onChange={(e) =>
                  setForm({ ...form, sks: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nama Mata Kuliah</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Struktur Data"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Dosen (pisah dengan koma)</Label>
            <Input
              value={form.instructors}
              onChange={(e) =>
                setForm({ ...form, instructors: e.target.value })
              }
              placeholder="Dr. Andi, Prof. Budi"
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Deskripsi singkat..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Session Dialog ---
function SessionDialog({
  open,
  onOpenChange,
  courses,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onSaved: () => void;
}) {
  const [courseId, setCourseId] = useState("");
  const [number, setNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCourseId("");
      setNumber(1);
      setTitle("");
      setDescription("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    try {
      await createSession(Number(courseId), {
        number,
        title,
        description: description || undefined,
      });
      onSaved();
    } catch {
      alert("Gagal menambah sesi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Sesi Baru</DialogTitle>
          <DialogDescription>
            Tambahkan sesi baru ke mata kuliah
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Mata Kuliah</Label>
            <Select value={courseId} onValueChange={setCourseId} required>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nomor Sesi</Label>
              <Input
                type="number"
                min={1}
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Judul Sesi</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pengantar OOP"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi sesi..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={saving || !courseId}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Material Wizard (3-step) ---
function MaterialWizard({
  open,
  onOpenChange,
  courses,
  sessions,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  sessions: Record<number, Session[]>;
  onSaved: () => void;
}) {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("pdf");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setCourseId("");
      setSessionId("");
      setTitle("");
      setType("pdf");
      setUrl("");
      setDescription("");
    }
  }, [open]);

  const availableSessions = courseId ? sessions[Number(courseId)] || [] : [];

  async function handleSubmit() {
    setSaving(true);
    try {
      await createMaterial({
        session_id: Number(sessionId),
        title,
        type: type as any,
        url,
        description: description || undefined,
      });
      onSaved();
      onOpenChange(false);
    } catch {
      alert("Gagal menambah materi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Materi Baru</DialogTitle>
          <DialogDescription>
            Langkah {step} dari 3
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Pilih Matkul & Sesi */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mata Kuliah</Label>
              <Select value={courseId} onValueChange={(v) => { setCourseId(v); setSessionId(""); }}>
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
            <div className="space-y-2">
              <Label>Sesi</Label>
              <Select
                value={sessionId}
                onValueChange={setSessionId}
                disabled={!courseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sesi" />
                </SelectTrigger>
                <SelectContent>
                  {availableSessions.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      Sesi {s.number}: {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!courseId || !sessionId}
              >
                Lanjut
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Input detail materi */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Materi</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bab 1 - Pengantar"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="ppt">PowerPoint</SelectItem>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL / Link</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (opsional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi materi..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Kembali
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!title || !url}
              >
                Lanjut
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Mata Kuliah
                  </span>
                  <span className="text-sm font-medium">
                    {courses.find((c) => String(c.id) === courseId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sesi</span>
                  <span className="text-sm font-medium">
                    {availableSessions.find(
                      (s) => String(s.id) === sessionId
                    )?.title || `Sesi ${sessionId}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Judul</span>
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipe</span>
                  <Badge variant="outline">{type.toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">URL</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {url}
                  </span>
                </div>
              </CardContent>
            </Card>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(2)}>
                Kembali
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Materi"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
