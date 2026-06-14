# 🔴 API Gap Analysis — Endpoint yang Belum Ada di Backend

**Tanggal:** 14 Juni 2026
**Status:** Frontend sudah siap, menunggu backend implementasi

---

## Ringkasan Priority

| # | Fitur | Endpoint | Priority |
|---|-------|----------|----------|
| 1 | Dashboard | `GET /api/dashboard/summary` | 🔴 Critical |
| 2 | Events | CRUD `/api/events` | 🟡 Medium |
| 3 | IPK / Grades | `GET/PUT /api/grades` | 🟡 Medium |
| 4 | Bank Soal | CRUD `/api/questions` + submit | 🔴 Critical |
| 5 | Monitoring | `GET /api/tasks/{id}/progress/all` | 🟡 Medium |
| 6 | Search | `GET /api/search?q=...` | 🟢 Bisa client-side |
| 7 | Roles | `PUT /api/users/{id}/role` | 🔴 Critical |
| 8 | Schema fix | cawu, submission_link, material types | 🔴 Critical |

---

## 1. Dashboard

```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "today_schedule": [
    { "course_name": "string", "time": "string", "room": "string" }
  ],
  "pending_tasks": [
    {
      "task_id": 0,
      "title": "string",
      "course_name": "string",
      "course_id": 0,
      "deadline": "datetime",
      "completed": false
    }
  ],
  "active_events": [
    { "id": 0, "title": "string", "date": "datetime", "category": "string" }
  ],
  "recent_courses": [
    { "id": 0, "name": "string", "code": "string" }
  ]
}
```

**Notes:**
- Frontend butuh data gabungan dari courses, tasks, events untuk widget dashboard
- Return format flexible — frontend tinggal format sesuai UI
- Harus personalized per user (berdasarkan role & enrolled courses)

---

## 2. Kalender Akademik (Events)

```
GET    /api/events            # List semua events
POST   /api/events            # Create event (Sekretaris only)
GET    /api/events/{id}       # Detail event
PUT    /api/events/{id}       # Update event (Sekretaris only)
DELETE /api/events/{id}       # Delete event (Sekretaris only)
```

**Schema:**
```json
{
  "id": 0,
  "title": "string",
  "description": "string",
  "date": "datetime",
  "end_date": "datetime | null",
  "category": "ujian | tugas | libur | kegiatan | lainnya",
  "owner_id": "uuid"
}
```

**EventInput (POST/PUT body):**
```json
{
  "title": "string",
  "description": "string (optional)",
  "date": "datetime",
  "end_date": "datetime (optional)",
  "category": "ujian | tugas | libur | kegiatan | lainnya"
}
```

**Notes:**
- Role guard: hanya `super_admin` dan `sekretaris` yang bisa write (POST/PUT/DELETE)
- Semua role bisa read (GET)
- `owner_id` otomatis dari authenticated user, tidak perlu di body

---

## 3. Kalkulator IPK → `/api/grades`

```
GET  /api/grades               # Get user's grades (all cawu)
PUT  /api/grades               # Update grades for a cawu
GET  /api/grades/template      # Get matkul+SKS template per cawu
```

**Response GET /api/grades:**
```json
{
  "ipk": 3.5,
  "per_cawu": [
    { "cawu": 1, "ip": 3.5, "total_sks": 20 }
  ],
  "trend": [
    { "cawu": 1, "ip": 3.5 }
  ],
  "cawu_data": [
    {
      "cawu": 1,
      "entries": [
        {
          "course_id": 0,
          "course_name": "string",
          "sks": 0,
          "grade": "A | A- | B+ | B | B- | C+ | C | D | E | null"
        }
      ]
    }
  ]
}
```

**Request PUT /api/grades:**
```json
{
  "cawu": 1,
  "entries": [
    { "course_id": 0, "grade": "A" }
  ]
}
```

**Response GET /api/grades/template?cawu=1:**
```json
{
  "cawu": 1,
  "entries": [
    {
      "course_id": 0,
      "course_name": "string",
      "sks": 0,
      "grade": null
    }
  ]
}
```

**Notes:**
- Frontend pakai path `/api/grades` (bukan `/api/ipk`) — lebih RESTful dan konsisten dengan convention backend
- Grade enum: `A`, `A-`, `B+`, `B-`, `B`, `C+`, `C`, `D`, `E`
- `null` grade = belum diisi
- IPK calculation: frontend bisa hitung client-side juga (sudah ada `ipk-calculator.ts`), tapi backend sebaiknya return pre-calculated summary

---

## 4. Bank Soal (Questions)

```
GET    /api/courses/{course_id}/questions      # List questions per course
POST   /api/questions                           # Create question (admin)
GET    /api/questions/{id}                      # Detail question
PUT    /api/questions/{id}                      # Update question (admin)
DELETE /api/questions/{id}                      # Delete question (admin)
POST   /api/questions/{id}/submit              # Submit jawaban (mahasiswa)
POST   /api/questions/{id}/start-exam          # Start exam session (returns timer config)
```

**Schema Question:**
```json
{
  "id": 0,
  "course_id": 0,
  "session_id": 0,
  "title": "string",
  "question_text": "string",
  "type": "regular | exam",
  "options": [
    { "key": "A", "text": "string" }
  ],
  "answer_key": "string",
  "difficulty_level": "easy | medium | hard",
  "time_limit_minutes": 30,
  "external_url": "string",
  "created_at": "datetime"
}
```

**Schema ExamSubmission (POST body for /submit):**
```json
{
  "answers": [
    { "option_key": "A", "selected": true }
  ],
  "time_spent_seconds": 0
}
```

**Response submit:**
```json
{
  "score": 8,
  "total": 10
}
```

**Response start-exam:**
```json
{
  "time_limit_minutes": 30,
  "session_token": "string"
}
```

**Notes:**
- `type: "regular"` → redirect ke `external_url` (Google Form, dll), tidak perlu in-app answer
- `type: "exam"` → in-app multiple choice dengan client-side timer
- Exam timer handled client-side (sprint ini) — `start-exam` endpoint hanya return config
- Role guard: CRUD questions = admin roles only; submit & start-exam = mahasiswa

---

## 5. Monitoring Tugas (Progress All Users)

```
GET /api/tasks/{task_id}/progress/all       # Get progress semua mahasiswa per task
GET /api/courses/{course_id}/tasks/progress # Get progress semua tugas per matkul
```

**Response (single task):**
```json
{
  "task_id": 0,
  "task_title": "string",
  "total_students": 30,
  "completed_count": 24,
  "completion_rate": 80.0,
  "completed": [
    {
      "user_id": "uuid",
      "full_name": "string",
      "nim": "string",
      "completed_at": "datetime"
    }
  ],
  "pending": [
    {
      "user_id": "uuid",
      "full_name": "string",
      "nim": "string"
    }
  ]
}
```

**Response (course-level — array of above):**
```json
[
  { "task_id": 1, "task_title": "...", ... },
  { "task_id": 2, "task_title": "...", ... }
]
```

**Notes:**
- Role guard: admin roles only (`super_admin`, `kurikulum`, `sekretaris`, `komti`, `wakomti`)
- `completion_rate` = (completed_count / total_students) * 100
- Backend harus join users table untuk dapat `full_name` dan `nim`

---

## 6. Global Search

```
GET /api/search?q={query}&type={course|session|task}
```

**Response:**
```json
{
  "results": [
    {
      "type": "course | session | task",
      "id": 0,
      "title": "string",
      "subtitle": "string",
      "course_id": 0,
      "course_name": "string",
      "session_id": 0
    }
  ]
}
```

**Notes:**
- 🟢 **Priority rendah** — frontend sudah handle search client-side (build index dari courses/sessions, filter in-memory)
- Backend search bisa ditambahkan nanti untuk scale yang lebih besar
- `session_id` nullable (hanya untuk type=session)

---

## 7. Role / User Management

```
GET  /api/users              # List all users (admin)
GET  /api/users/{id}         # Detail user
PUT  /api/users/{id}/role   # Update role (super_admin only)
GET  /api/roles              # List available roles
```

**Schema User (extended with role):**
```json
{
  "id": "uuid",
  "nim": "string",
  "full_name": "string",
  "email": "string",
  "role": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Schema Role:**
```json
{
  "id": "string",
  "name": "super_admin | kurikulum | sekretaris | komti | wakomti | warga_lokal | lainnya"
}
```

**Request PUT /api/users/{id}/role:**
```json
{
  "role": "kurikulum"
}
```

**Notes:**
- 🔴 Critical — tanpa ini, super admin tidak bisa manage roles
- Role guard: `PUT /api/users/{id}/role` hanya bisa diakses `super_admin`
- `GET /api/roles` return static list (tidak perlu CRUD roles)

---

## 8. Schema Revisions (Endpoint Existing yang Perlu Field Baru)

### Course — tambah field:
```diff
  {
    "id": 0,
    "code": "string",
    "name": "string",
    "sks": 0,
    "description": "string",
    "instructors": ["string"],
+   "cawu": 1,
+   "cawu_id": 0,
    "created_at": "datetime",
    "updated_at": "datetime"
  }
```

**Kenapa:** Frontend butuh filter by cawu di halaman Akademik. Tanpa field ini, filter cawu tidak bisa bekerja.

### Task — tambah field:
```diff
  {
    "id": 0,
    "course_id": 0,
    "title": "string",
    "description": "string",
    "deadline": "datetime",
+   "submission_link": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
```

**Kenapa:** PRD Use Case 1 — mahasiswa submit tugas via link. Tanpa `submission_link`, mahasiswa tidak tau dimana harus submit.

### TaskProgress — tambah field:
```diff
  {
    "user_id": "uuid",
    "task_id": 0,
    "completed": true,
+   "completed_at": "datetime"
  }
```

**Kenapa:** Monitoring butuh timestamp kapan tugas diselesaikan.

### Material — expand enum type:
```diff
- "type": "pdf | link | video | image"
+ "type": "pdf | link | video | image | ppt | doc | youtube"
```

**Kenapa:** Dosen sering upload PPT dan DOC. YouTube link perlu type terpisah karena frontend render YouTube embed, bukan video player biasa.

---

## 🐳 Docker / Deployment Notes

Frontend menggunakan **Caddy** (bukan NGINX) sebagai reverse proxy:
- Auto-SSL built-in
- Config lebih simple (Caddyfile vs nginx.conf)
- Single `docker-compose.yml` di root (no nested compose)

```
ppti-academic-management-app/
├── frontend/          # Next.js app
│   ├── Dockerfile
│   └── .dockerignore
├── backend/           # Backend (Go/Node/dll)
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml # Root compose (orchestrates all)
├── Caddyfile          # Reverse proxy config
└── .env.example
```

---

## ✅ Yang Sudah Ada di Backend (No Changes Needed)

| Endpoint | Status |
|----------|--------|
| `POST /api/auth/login` | ✅ Ada |
| `POST /api/auth/register` | ✅ Ada |
| `GET /api/users/me` | ✅ Ada |
| `GET /api/courses` | ✅ Ada |
| `GET/POST/PUT/DELETE /api/courses/{id}` | ✅ Ada |
| `GET /api/courses/{id}/sessions` | ✅ Ada |
| `POST/PUT/DELETE /api/sessions/{id}` | ✅ Ada |
| `GET /api/courses/{id}/materials` | ✅ Ada |
| `POST/PUT/DELETE /api/materials/{id}` | ✅ Ada |
| `GET /api/courses/{id}/tasks` | ✅ Ada |
| `POST/PUT/DELETE /api/tasks/{id}` | ✅ Ada |
| `PATCH /api/tasks/{id}/progress` | ✅ Ada |

---

## 📋 Frontend Adjustments (yang kita pertahankan di sisi FE)

| # | Item | Alasan |
|---|------|--------|
| 1 | Dashboard response | Backend return counts + arrays flexible. Frontend format sesuai UI. |
| 2 | IPK → `/api/grades` | Path lebih RESTful & konsisten. Frontend alias di client-side. |
| 3 | Docker + Caddy | Caddy lebih modern (auto-SSL, simpler config). Single compose = no over-engineering untuk MVP. |
| 4 | Exam timer/session | Ditunda ke sprint berikutnya. Frontend handle timer client-side. |
