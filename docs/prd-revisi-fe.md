# PRD Revisi Front-End

Project Name: PPTI Academic Management App (Curriculum Module MVP)
Document Version: 1.0 - FE Rework
Document Date: 14 Juni 2026
Target UAT / Testing Date: 21 Juni 2026

## 1. Ringkasan

Aplikasi ini adalah web app/PWA untuk manajemen akademik kelas PPTI dengan fokus MVP pada:

- Modul Kurikulum
- Kalender Akademik
- Kalkulator IPK
- Global Search

Tujuan front-end adalah membuat akses materi dan tugas cepat, konsisten, dan tetap berguna saat offline untuk aset yang sudah pernah dibuka.

## 2. Review FE terhadap PRD Asli

PRD sudah kuat di arah produk, tetapi ada beberapa hal yang perlu ditegaskan dari sisi front-end:

1. Struktur halaman belum cukup operasional.
   - FE butuh route, state, dan urutan interaksi yang eksplisit.

2. Beberapa perilaku UI bergantung pada browser.
   - Full screen hanya bisa diminta lewat user gesture, jadi flow Bank Soal harus mengikuti batasan browser.

3. Offline requirement masih umum.
   - FE perlu tahu aset apa yang wajib di-cache, kapan cache di-update, dan apa yang tetap tersedia saat offline.

4. Omnisearch butuh definisi hasil dan navigasi.
   - Perlu tipe hasil, prioritas, keyboard support, dan deep-link behavior.

5. Admin Panel perlu dibikin sangat terarah.
   - Untuk Kurikulum, flow tambah materi harus wizard-like, bukan form panjang.

6. Role "Lainnya" perlu diperlakukan jelas.
   - Di FE, role ini memakai UI yang sama seperti Warga Lokal, dengan hak akses yang dibatasi backend.

## 3. Scope Front-End MVP

### In Scope

- Dashboard
- Akademik
- Halaman detail Matkul
- Tab Materi, Tugas, dan Bank Soal
- Kalkulator IPK
- Admin Panel untuk Kurikulum, Sekretaris, Super Admin
- Global Search di header
- Modal detail tugas
- Embedded PDF reader
- PWA shell dan offline cache untuk aset tertentu

### Out of Scope

- Fitur sosial
- Chat internal
- Notifikasi push kompleks
- Edit konten offline penuh
- Analytics advanced

## 4. Role dan Akses UI

### Super Admin

- Melihat semua menu
- Mengelola role, hierarchy, authority level, dan konfigurasi sistem
- Melihat audit view basic

### Kurikulum

- Akses penuh ke modul Kurikulum
- CRUD materi, tugas, bank soal, dan template matkul
- Akses Admin Panel utama

### Sekretaris

- CRUD kalender akademik, event, dan jadwal dashboard
- Akses ke monitoring timeline

### Komti dan Wakomti

- Read-only untuk monitoring tugas dan progres kelas
- Tidak dapat edit materi

### Warga Lokal

- Read-only untuk materi
- Bisa buka soal, mengisi checklist tugas pribadi, dan input IPK

### Lainnya

- UI sama seperti Warga Lokal
- Hak akses tetap dibatasi per backend policy

## 5. Information Architecture

### Global Layout

- Header tetap di semua halaman
- Sidebar utama di kiri
- Area konten utama di kanan

### Route yang Disarankan

- `/dashboard`
- `/akademik`
- `/akademik/[matkulId]`
- `/akademik/[matkulId]?tab=materials`
- `/akademik/[matkulId]?tab=tasks`
- `/akademik/[matkulId]?tab=questions`
- `/ipk`
- `/admin`
- `/admin/curriculum`
- `/admin/calendar`
- `/admin/monitoring`

### Navigasi Utama

- Dashboard
- Akademik
- Kalkulator IPK
- Admin Panel

## 6. Aturan Komponen UI

### Header

- Global Search selalu tampil
- User menu
- Indikator offline/online
- Badge role aktif

### Sidebar

- Collapsible
- Hanya menampilkan menu yang relevan untuk role aktif
- Tidak menyembunyikan akses yang boleh dilihat di route langsung

### Dashboard

Widget minimal:

- Jadwal hari ini
- Event aktif
- Tugas belum selesai
- Shortcut ke matkul terakhir dibuka

### Akademik

- Menampilkan daftar matkul pada Cawu aktif
- Dropdown "Pilih Cawu" di kanan atas
- Kartu matkul ringkas dengan info dosen dan SKS

### Detail Matkul

Bagian atas menampilkan:

- Nama matkul
- Dosen pengampu
- SKS
- Status Cawu

Tab wajib:

- Materi default aktif
- Tugas
- Bank Soal

### Materi

- Dikelompokkan per sesi
- Menggunakan accordion/expandable sections
- Item mendukung tipe:
  - PDF
  - PPT
  - DOC/DOCS
  - Link YouTube
  - Foto
  - Link eksternal

### Tugas

- List tugas
- Status selesai/belum selesai
- Klik item membuka modal detail
- Modal berisi deskripsi, link submission, deadline, dan checklist selesai

### Bank Soal

- Daftar soal per matkul
- Mendukung 2 tipe:
  - Tipe 1: soal reguler, buka link eksternal
  - Tipe 2: simulasi ujian, masuk mode full screen saat user klik mulai

### Kalkulator IPK

- 6 tab:
  - Cawu 1
  - Cawu 2
  - Cawu 3
  - Cawu 4
  - Cawu 5
  - Summary
- Nilai dihitung real-time
- Summary menampilkan:
  - IPK kumulatif
  - Rata-rata per Cawu
  - Trend line chart

## 7. Flow UX Utama

### Flow 1: Tugas

1. User buka Dashboard
2. Klik widget tugas belum selesai
3. Route ke `/akademik/[matkulId]?tab=tasks`
4. Tab Tugas terbuka otomatis
5. User klik item tugas
6. Modal detail muncul
7. User klik checklist selesai
8. Status tersimpan dan UI ter-update

### Flow 2: Tambah Materi oleh Kurikulum

1. User buka Admin Panel
2. Pilih Quick Action "Tambah Materi"
3. Wizard 3 langkah:
   - Pilih matkul dan sesi
   - Unggah file atau isi link
   - Review dan simpan
4. Setelah submit sukses, materi muncul di akun semua user yang berhak

### Flow 3: Monitoring Tugas

1. User buka Admin Panel
2. Pilih Monitoring Tugas
3. Pilih matkul dan tugas
4. UI menampilkan progress bar
5. UI menampilkan split table:
   - kiri: sudah selesai
   - kanan: belum selesai

### Flow 4: Bank Soal Simulasi

1. User buka Bank Soal
2. Klik "Mulai Latihan"
3. Browser request full screen
4. Timer berjalan
5. Saat waktu habis, banner merah tampil
6. Input tetap terbuka sampai user selesai
7. User klik "Selesai" untuk keluar dari full screen

### Flow 5: Global Search

1. User mengetik kata kunci
2. Dropdown autosuggest muncul
3. User memilih hasil
4. Jika hasil matkul, route ke detail matkul
5. Jika hasil sesi, route ke matkul dan buka sesi terkait

## 8. Global Search Requirements

Search harus mendukung:

- Nama matkul
- Nomor sesi
- Nama sesi
- Judul tugas

Perilaku UI:

- Debounce input
- Keyboard navigation
- Empty state
- Loading state
- No result state
- Highlight kata yang cocok

Deep routing:

- Matkul -> `/akademik/[matkulId]`
- Sesi -> `/akademik/[matkulId]?session=[sessionId]`
- Saat session query ada, accordion target harus terbuka otomatis

## 9. PWA dan Offline Behavior

Wajib cache:

- Shell aplikasi
- Asset statis
- Data dashboard yang terakhir berhasil dimuat
- Index search matkul dan sesi
- PDF yang sudah pernah dibuka

Aturan offline:

- Aplikasi tetap bisa dibuka
- User tetap bisa melihat konten yang sudah dicache
- User melihat badge offline jika koneksi hilang
- Untuk data baru, tampilkan fallback yang jelas

Strategi cache yang disarankan:

- Shell: cache-first
- Data dashboard: stale-while-revalidate
- PDF dan file: cache-on-open
- Search index: sync saat online, fallback local saat offline

## 10. State yang Harus Ditangani

Setiap halaman penting harus punya:

- Loading
- Empty
- Error
- Forbidden
- Offline

Komponen penting yang wajib punya state:

- Search bar
- Accordion sesi
- Modal tugas
- PDF viewer
- IPK calculator
- Admin wizard

## 11. Accessibility dan UX Rules

- Kontras warna tetap terbaca
- Fokus keyboard terlihat jelas
- Tombol punya label yang jelas
- Modal bisa ditutup dengan Escape
- Tab order logis
- Search bisa dipakai tanpa mouse
- Full screen harus tetap memberi jalan keluar yang jelas

## 12. Data Minimum yang Dibutuhkan FE

### Matkul

- id
- name
- lecturer_name
- sks
- cawu_id
- description

### Sesi Materi

- id
- matkul_id
- title
- order
- content_type
- content_url
- is_locked

### Tugas

- id
- matkul_id
- title
- description
- submission_link
- deadline
- status
- completed_at

### Event

- id
- title
- description
- date
- category
- owner_id

### Soal

- id
- matkul_id
- question_text
- type
- options
- answer_key
- difficulty_level

## 13. Admin Panel FE Spec

### Quick Actions

- Tambah Materi
- Tambah Tugas
- Tambah Event
- Monitoring Tugas

### Prinsip UI

- Form dibuat singkat
- Gunakan stepper/wizard
- Hindari form panjang dalam satu layar
- Beri preview sebelum submit
- Tampilkan notifikasi sukses/gagal yang jelas

## 14. Non-Functional Front-End Requirements

- First meaningful content harus cepat
- Navigasi ke matkul harus terasa instan dari cache
- Layout harus nyaman di desktop dan mobile
- Design system clean, minimal, dominan biru
- Tidak boleh ada UI yang terasa berat atau dekoratif berlebihan
- PDF reader tertanam wajib tersedia

## 15. Acceptance Criteria MVP

MVP FE dianggap siap bila:

- User bisa login dan melihat menu sesuai role
- Dashboard tampil dan bisa dipakai offline untuk data cache
- User bisa pindah ke matkul dari dashboard dan search
- Accordion sesi bisa dibuka otomatis dari deep link
- Tugas bisa dibuka lewat modal
- Kurikulum bisa tambah materi lewat wizard cepat
- Monitoring tugas menampilkan progress dan split table
- Bank soal simulasi bisa masuk full screen dari klik user
- Kalkulator IPK menghitung real-time
- PDF yang pernah dibuka bisa dibaca saat offline

## 16. Catatan Implementasi

1. Role guard harus dilakukan di backend dan dipantau di FE.
2. Full screen tidak boleh diasumsikan selalu berhasil.
3. Cache search index harus sinkron dengan data matkul dan sesi.
4. UI "Lainnya" jangan dibedakan dari Warga Lokal kecuali pada izin edit.
5. Route dan query param harus konsisten sejak awal agar deep routing stabil.

## 17. Output yang Disarankan untuk Tim FE

- Design system ringkas
- Route map
- Komponen reusable
- State matrix
- Offline cache map
- API contract per halaman
- Acceptance test checklist

