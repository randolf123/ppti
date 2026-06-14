# PPTI Academic Management App

Platform manajemen akademik berbasis web untuk ekosistem kelas PPTI. Menggunakan sistem Catur Wulan (Cawu).

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui
- **State:** Zustand
- **Forms:** React Hook Form + Zod (planned)
- **PWA:** next-pwa (planned)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

App akan berjalan di `http://localhost:3000`.

## Environment

Copy `.env.local.example` ke `.env.local`:

```bash
cp frontend/.env.local.example frontend/.env.local
```

Set `NEXT_PUBLIC_API_URL` ke backend URL kamu.

## Docker

```bash
docker compose up --build
```

Ini akan menjalankan:
- Frontend di port 3000
- Caddy reverse proxy di port 80

## Project Structure

```
ppti-academic-management-app/
├── frontend/           # Next.js frontend app
│   ├── src/
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # UI + feature components
│   │   ├── lib/        # API client, stores, hooks, utils
│   │   └── types/      # TypeScript types
│   └── ...
├── docs/               # API gap analysis & PRD notes
├── docker-compose.yml  # Docker orchestration
├── Caddyfile           # Caddy reverse proxy config
└── README.md
```

## Pages

| Route | Deskripsi |
|-------|-----------|
| `/login` | Login page |
| `/register` | Register page |
| `/dashboard` | Dashboard (jadwal, tugas, events) |
| `/akademik` | List matkul per cawu |
| `/akademik/[id]` | Detail matkul (materi, tugas, bank soal) |
| `/ipk` | Kalkulator IPK (6 tabs) |
| `/admin/curriculum` | CRUD matkul, sesi, materi |
| `/admin/calendar` | CRUD event kalender akademik |
| `/admin/monitoring` | Monitoring progress tugas |
| `/admin/users` | Kelola role user (super_admin only) |

## Backend API Status

Lihat [docs/api-gaps.md](docs/api-gaps.md) untuk detail endpoint yang belum ada.

### ✅ Sudah Ada
- Auth (login, register, me)
- CRUD Courses, Sessions, Materials, Tasks
- Task Progress toggle

### 🔴 Belum Ada (Critical)
- `GET /api/dashboard/summary`
- `CRUD /api/questions` + submit/start-exam
- `PUT /api/users/{id}/role` + `GET /api/users`
- Schema fixes: `cawu` di Course, `submission_link` di Task, expanded material types

### 🟡 Belum Ada (Medium)
- `CRUD /api/events`
- `GET/PUT /api/grades` (IPK)
- `GET /api/tasks/{id}/progress/all` (monitoring)

## Roles

| Role | Akses |
|------|-------|
| super_admin | Full access |
| kurikulum | CRUD materi & tugas |
| sekretaris | CRUD kalender akademik |
| komti / wakomti | View monitoring |
| warga_lokal | Read-only + submit tugas |
| lainnya | Same as warga_lokal |

## Documentation

- [PRD revisi front-end](docs/prd-revisi-fe.md)
- [API gap analysis](docs/api-gaps.md)
