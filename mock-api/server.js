const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// ============ MOCK DATA ============

const users = [
  {
    id: 'user-1',
    nim: '2021001001',
    full_name: 'Randolf',
    email: 'randolf@ppti.ac.id',
    role: 'super_admin',
    password: 'admin123',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    nim: '2021001002',
    full_name: 'Budi Santoso',
    email: 'budi@ppti.ac.id',
    role: 'warga_lokal',
    password: 'user123',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

const courses = [
  { id: 1, code: 'TI201', name: 'Pemrograman Web', sks: 3, cawu: 1, description: 'Belajar HTML, CSS, JavaScript', instructors: ['Dr. Andi Wijaya'], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, code: 'TI202', name: 'Basis Data', sks: 3, cawu: 1, description: 'SQL dan desain database', instructors: ['Prof. Siti Rahma'], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, code: 'TI203', name: 'Struktur Data & Algoritma', sks: 4, cawu: 2, description: 'Array, linked list, tree, graph, sorting', instructors: ['Dr. Budi Hartono'], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 4, code: 'TI204', name: 'Jaringan Komputer', sks: 3, cawu: 2, description: 'TCP/IP, OSI model, routing', instructors: ['Ir. Dewi Lestari'], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 5, code: 'TI205', name: 'Rekayasa Perangkat Lunak', sks: 3, cawu: 3, description: 'SDLC, Agile, Scrum', instructors: ['Dr. Andi Wijaya'], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

const sessions = [
  { id: 1, course_id: 1, title: 'Sesi 1: HTML Dasar', description: 'Tag-tag HTML', date: '2026-02-01T08:00:00Z', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, course_id: 1, title: 'Sesi 2: CSS Styling', description: 'Selector, box model, flexbox', date: '2026-02-08T08:00:00Z', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, course_id: 2, title: 'Sesi 1: SQL Fundamentals', description: 'SELECT, INSERT, UPDATE, DELETE', date: '2026-02-03T10:00:00Z', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

const materials = [
  { id: 1, course_id: 1, session_id: 1, title: 'Slide HTML Dasar', type: 'pdf', url: '/mock/h.pdf', description: 'Materi pengenalan HTML', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, course_id: 1, session_id: 2, title: 'Video Flexbox Tutorial', type: 'youtube', url: 'https://youtube.com/watch?v=example', description: 'Tutorial CSS Flexbox', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, course_id: 2, session_id: 3, title: 'SQL Cheat Sheet', type: 'doc', url: '/mock/sql.doc', description: 'Cheat sheet SQL lengkap', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

const tasks = [
  { id: 1, course_id: 1, title: 'Tugas 1: Buat Landing Page', description: 'Buat landing page sederhana dengan HTML & CSS', deadline: '2026-03-01T23:59:00Z', submission_link: 'https://forms.gle/example1', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, course_id: 1, title: 'Tugas 2: Responsive Design', description: 'Buat website responsive dengan media queries', deadline: '2026-03-15T23:59:00Z', submission_link: 'https://forms.gle/example2', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, course_id: 2, title: 'Tugas SQL: CRUD Operations', description: 'Implementasi CRUD pada database mahasiswa', deadline: '2026-03-10T23:59:00Z', submission_link: 'https://forms.gle/example3', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 4, course_id: 3, title: 'Implementasi Linked List', description: 'Buat program linked list dengan operasi insert & delete', deadline: '2026-04-01T23:59:00Z', submission_link: 'https://forms.gle/example4', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

const taskProgress = [
  { user_id: 'user-1', task_id: 1, completed: true, completed_at: '2026-02-25T14:00:00Z' },
  { user_id: 'user-1', task_id: 2, completed: false, completed_at: null },
  { user_id: 'user-2', task_id: 1, completed: true, completed_at: '2026-02-28T10:00:00Z' },
  { user_id: 'user-2', task_id: 2, completed: true, completed_at: '2026-03-12T16:00:00Z' },
];

const events = [
  { id: 1, title: 'UTS Cawu 1', description: 'Ujian Tengah Semester Cawu 1', date: '2026-03-15T08:00:00Z', end_date: '2026-03-20T17:00:00Z', category: 'ujian', owner_id: 'user-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 2, title: 'Libur Nasional - Nyepi', description: 'Hari Raya Nyepi', date: '2026-03-25T00:00:00Z', end_date: null, category: 'libur', owner_id: 'user-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 3, title: 'Seminar AI & ML', description: 'Seminar tentang Artificial Intelligence', date: '2026-04-05T09:00:00Z', end_date: '2026-04-05T15:00:00Z', category: 'kegiatan', owner_id: 'user-1', created_at: '2026-01-01T00:00:00Z' },
  { id: 4, title: 'Deadline Tugas Akhir Cawu 1', description: 'Batas akhir pengumpulan semua tugas Cawu 1', date: '2026-04-30T23:59:00Z', end_date: null, category: 'tugas', owner_id: 'user-1', created_at: '2026-01-01T00:00:00Z' },
];

const grades = [
  { user_id: 'user-1', course_id: 1, cawu: 1, grade: 'A', sks: 3 },
  { user_id: 'user-1', course_id: 2, cawu: 1, grade: 'A-', sks: 3 },
  { user_id: 'user-1', course_id: 3, cawu: 2, grade: 'B+', sks: 4 },
  { user_id: 'user-1', course_id: 4, cawu: 2, grade: null, sks: 3 },
  { user_id: 'user-1', course_id: 5, cawu: 3, grade: null, sks: 3 },
];

const roles = [
  { id: 'super_admin', name: 'super_admin' },
  { id: 'kurikulum', name: 'kurikulum' },
  { id: 'sekretaris', name: 'sekretaris' },
  { id: 'komti', name: 'komti' },
  { id: 'wakomti', name: 'wakomti' },
  { id: 'warga_lokal', name: 'warga_lokal' },
  { id: 'lainnya', name: 'lainnya' },
];

// Simple token (base64 of user id)
function makeToken(userId) {
  return Buffer.from(userId).toString('base64');
}

function getUserFromToken(token) {
  const userId = Buffer.from(token, 'base64').toString('utf8');
  return users.find(u => u.id === userId);
}

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = header.replace('Bearer ', '');
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
  req.user = user;
  next();
}

// Helper
function wrap(data, message = 'Success') {
  return { success: true, message, data };
}

// ============ AUTH ============

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Email atau password salah' });

  const token = makeToken(user.id);
  res.json(wrap({
    token,
    user: { id: user.id, nim: user.nim, full_name: user.full_name, email: user.email },
    role: user.role
  }));
});

app.post('/api/auth/register', (req, res) => {
  const { nim, full_name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
  }
  const newUser = {
    id: `user-${Date.now()}`,
    nim, full_name, email, password,
    role: 'warga_lokal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  users.push(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json(wrap(safeUser, 'Registrasi berhasil'));
});

// ============ USERS ============

app.get('/api/users/me', auth, (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json(wrap({ user: safeUser, role: req.user.role }));
});

app.get('/api/users', auth, (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(wrap(safeUsers));
});

app.get('/api/users/:id', auth, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...safeUser } = user;
  res.json(wrap(safeUser));
});

app.put('/api/users/:id/role', auth, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.role = req.body.role;
  const { password, ...safeUser } = user;
  res.json(wrap(safeUser, 'Role updated'));
});

app.get('/api/roles', auth, (req, res) => {
  res.json(wrap(roles));
});

// ============ COURSES ============

app.get('/api/courses', auth, (req, res) => {
  res.json(wrap(courses));
});

app.get('/api/courses/:id', auth, (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json(wrap(course));
});

app.post('/api/courses', auth, (req, res) => {
  const newCourse = { id: courses.length + 1, ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  courses.push(newCourse);
  res.status(201).json(wrap(newCourse, 'Course created'));
});

app.put('/api/courses/:id', auth, (req, res) => {
  const idx = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Course not found' });
  courses[idx] = { ...courses[idx], ...req.body, updated_at: new Date().toISOString() };
  res.json(wrap(courses[idx], 'Course updated'));
});

app.delete('/api/courses/:id', auth, (req, res) => {
  const idx = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Course not found' });
  courses.splice(idx, 1);
  res.json(wrap(null, 'Course deleted'));
});

// ============ SESSIONS ============

app.get('/api/courses/:courseId/sessions', auth, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const result = sessions.filter(s => s.course_id === courseId);
  res.json(wrap(result));
});

app.post('/api/courses/:courseId/sessions', auth, (req, res) => {
  const newSession = { id: sessions.length + 1, course_id: parseInt(req.params.courseId), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  sessions.push(newSession);
  res.status(201).json(wrap(newSession, 'Session created'));
});

app.put('/api/sessions/:id', auth, (req, res) => {
  const idx = sessions.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Session not found' });
  sessions[idx] = { ...sessions[idx], ...req.body, updated_at: new Date().toISOString() };
  res.json(wrap(sessions[idx], 'Session updated'));
});

app.delete('/api/sessions/:id', auth, (req, res) => {
  const idx = sessions.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Session not found' });
  sessions.splice(idx, 1);
  res.json(wrap(null, 'Session deleted'));
});

// ============ MATERIALS ============

app.get('/api/courses/:courseId/materials', auth, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const result = materials.filter(m => m.course_id === courseId);
  res.json(wrap(result));
});

app.post('/api/courses/:courseId/materials', auth, (req, res) => {
  const newMat = { id: materials.length + 1, course_id: parseInt(req.params.courseId), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  materials.push(newMat);
  res.status(201).json(wrap(newMat, 'Material created'));
});

app.put('/api/materials/:id', auth, (req, res) => {
  const idx = materials.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Material not found' });
  materials[idx] = { ...materials[idx], ...req.body, updated_at: new Date().toISOString() };
  res.json(wrap(materials[idx], 'Material updated'));
});

app.delete('/api/materials/:id', auth, (req, res) => {
  const idx = materials.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Material not found' });
  materials.splice(idx, 1);
  res.json(wrap(null, 'Material deleted'));
});

// ============ TASKS ============

app.get('/api/courses/:courseId/tasks', auth, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const result = tasks.filter(t => t.course_id === courseId);
  res.json(wrap(result));
});

app.post('/api/courses/:courseId/tasks', auth, (req, res) => {
  const newTask = { id: tasks.length + 1, course_id: parseInt(req.params.courseId), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  tasks.push(newTask);
  res.status(201).json(wrap(newTask, 'Task created'));
});

app.put('/api/tasks/:id', auth, (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, updated_at: new Date().toISOString() };
  res.json(wrap(tasks[idx], 'Task updated'));
});

app.delete('/api/tasks/:id', auth, (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
  tasks.splice(idx, 1);
  res.json(wrap(null, 'Task deleted'));
});

app.patch('/api/tasks/:id/progress', auth, (req, res) => {
  const taskId = parseInt(req.params.id);
  const userId = req.user.id;
  const { completed } = req.body;

  let progress = taskProgress.find(p => p.user_id === userId && p.task_id === taskId);
  if (progress) {
    progress.completed = completed;
    progress.completed_at = completed ? new Date().toISOString() : null;
  } else {
    progress = { user_id: userId, task_id: taskId, completed, completed_at: completed ? new Date().toISOString() : null };
    taskProgress.push(progress);
  }
  res.json(wrap(progress, 'Progress updated'));
});

// ============ DASHBOARD ============

app.get('/api/dashboard/summary', auth, (req, res) => {
  const userId = req.user.id;

  const todaySchedule = sessions.slice(0, 3).map(s => {
    const course = courses.find(c => c.id === s.course_id);
    return { course_name: course?.name || '', time: s.date, room: 'Ruang 101' };
  });

  const pendingTasks = tasks
    .filter(t => {
      const p = taskProgress.find(p => p.user_id === userId && p.task_id === t.id);
      return !p || !p.completed;
    })
    .map(t => {
      const course = courses.find(c => c.id === t.course_id);
      return {
        task_id: t.id,
        title: t.title,
        course_name: course?.name || '',
        course_id: t.course_id,
        deadline: t.deadline,
        completed: false
      };
    });

  const activeEvents = events.filter(e => new Date(e.date) > new Date()).map(e => ({
    id: e.id, title: e.title, date: e.date, category: e.category
  }));

  const recentCourses = courses.slice(0, 4).map(c => ({
    id: c.id, name: c.name, code: c.code
  }));

  res.json(wrap({
    today_schedule: todaySchedule,
    pending_tasks: pendingTasks,
    active_events: activeEvents,
    recent_courses: recentCourses
  }));
});

// ============ EVENTS ============

app.get('/api/events', auth, (req, res) => {
  res.json(wrap(events));
});

app.get('/api/events/:id', auth, (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json(wrap(event));
});

app.post('/api/events', auth, (req, res) => {
  const newEvent = { id: events.length + 1, ...req.body, owner_id: req.user.id, created_at: new Date().toISOString() };
  events.push(newEvent);
  res.status(201).json(wrap(newEvent, 'Event created'));
});

app.put('/api/events/:id', auth, (req, res) => {
  const idx = events.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Event not found' });
  events[idx] = { ...events[idx], ...req.body };
  res.json(wrap(events[idx], 'Event updated'));
});

app.delete('/api/events/:id', auth, (req, res) => {
  const idx = events.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Event not found' });
  events.splice(idx, 1);
  res.json(wrap(null, 'Event deleted'));
});

// ============ GRADES ============

const gradeValues = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0.0 };

app.get('/api/grades', auth, (req, res) => {
  const userId = req.user.id;
  const userGrades = grades.filter(g => g.user_id === userId);

  const cawuMap = {};
  userGrades.forEach(g => {
    if (!cawuMap[g.cawu]) cawuMap[g.cawu] = { cawu: g.cawu, entries: [], totalSks: 0, totalPoints: 0 };
    const course = courses.find(c => c.id === g.course_id);
    cawuMap[g.cawu].entries.push({
      course_id: g.course_id,
      course_name: course?.name || '',
      sks: g.sks,
      grade: g.grade
    });
    if (g.grade) {
      cawuMap[g.cawu].totalSks += g.sks;
      cawuMap[g.cawu].totalPoints += (gradeValues[g.grade] || 0) * g.sks;
    }
  });

  const perCawu = Object.values(cawuMap).map(c => ({
    cawu: c.cawu,
    ip: c.totalSks > 0 ? Math.round((c.totalPoints / c.totalSks) * 100) / 100 : 0,
    total_sks: c.totalSks
  }));

  const gradedCawu = perCawu.filter(c => c.total_sks > 0);
  const ipk = gradedCawu.length > 0
    ? Math.round((gradedCawu.reduce((s, c) => s + c.ip, 0) / gradedCawu.length) * 100) / 100
    : 0;

  res.json(wrap({
    ipk,
    per_cawu: perCawu,
    trend: perCawu.map(c => ({ cawu: c.cawu, ip: c.ip })),
    cawu_data: Object.values(cawuMap)
  }));
});

app.put('/api/grades', auth, (req, res) => {
  const userId = req.user.id;
  const { cawu, entries } = req.body;
  entries.forEach(entry => {
    let existing = grades.find(g => g.user_id === userId && g.course_id === entry.course_id);
    if (existing) {
      existing.grade = entry.grade;
    }
  });
  res.json(wrap(null, 'Grades updated'));
});

app.get('/api/grades/template', auth, (req, res) => {
  const cawu = parseInt(req.query.cawu) || 1;
  const cawuCourses = courses.filter(c => c.cawu === cawu);
  res.json(wrap({
    cawu,
    entries: cawuCourses.map(c => ({
      course_id: c.id,
      course_name: c.name,
      sks: c.sks,
      grade: null
    }))
  }));
});

// ============ MONITORING ============

app.get('/api/tasks/:taskId/progress/all', auth, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  const completed = taskProgress
    .filter(p => p.task_id === taskId && p.completed)
    .map(p => {
      const user = users.find(u => u.id === p.user_id);
      return { user_id: p.user_id, full_name: user?.full_name || '', nim: user?.nim || '', completed_at: p.completed_at };
    });

  const pending = users.map(u => ({ user_id: u.id, full_name: u.full_name, nim: u.nim }))
    .filter(u => !completed.find(c => c.user_id === u.user_id));

  res.json(wrap({
    task_id: taskId,
    task_title: task.title,
    total_students: users.length,
    completed_count: completed.length,
    completion_rate: users.length > 0 ? Math.round((completed.length / users.length) * 100) : 0,
    completed,
    pending
  }));
});

// ============ QUESTIONS (BANK SOAL) ============

const questions = [
  { id: 1, course_id: 1, session_id: 1, title: 'HTML Dasar', question_text: 'Tag apa yang digunakan untuk membuat heading utama?', type: 'regular', options: [{ key: 'A', text: '<h1>' }, { key: 'B', text: '<h6>' }, { key: 'C', text: '<head>' }, { key: 'D', text: '<header>' }], answer_key: 'A', difficulty_level: 'easy', time_limit_minutes: 30, external_url: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, course_id: 1, session_id: 2, title: 'CSS Flexbox', question_text: 'Property CSS mana yang digunakan untuk membuat container flex?', type: 'exam', options: [{ key: 'A', text: 'display: block' }, { key: 'B', text: 'display: flex' }, { key: 'C', text: 'display: grid' }, { key: 'D', text: 'display: inline' }], answer_key: 'B', difficulty_level: 'easy', time_limit_minutes: 45, external_url: null, created_at: '2026-01-01T00:00:00Z' },
];

app.get('/api/courses/:courseId/questions', auth, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  res.json(wrap(questions.filter(q => q.course_id === courseId)));
});

app.post('/api/questions', auth, (req, res) => {
  const newQ = { id: questions.length + 1, ...req.body, created_at: new Date().toISOString() };
  questions.push(newQ);
  res.status(201).json(wrap(newQ, 'Question created'));
});

app.post('/api/questions/:id/submit', auth, (req, res) => {
  const q = questions.find(q => q.id === parseInt(req.params.id));
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  const { answers } = req.body;
  const correct = answers.filter(a => a.selected && a.option_key === q.answer_key).length;
  res.json(wrap({ score: correct, total: 1 }));
});

app.post('/api/questions/:id/start-exam', auth, (req, res) => {
  const q = questions.find(q => q.id === parseInt(req.params.id));
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  res.json(wrap({ time_limit_minutes: q.time_limit_minutes, session_token: `exam-${Date.now()}` }));
});

// ============ SEARCH ============

app.get('/api/search', auth, (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = [];

  courses.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    .forEach(c => results.push({ type: 'course', id: c.id, title: c.name, subtitle: c.code, course_id: c.id, course_name: c.name }));

  sessions.filter(s => s.title.toLowerCase().includes(q))
    .forEach(s => {
      const course = courses.find(c => c.id === s.course_id);
      results.push({ type: 'session', id: s.id, title: s.title, subtitle: course?.name || '', course_id: s.course_id, course_name: course?.name || '', session_id: s.id });
    });

  tasks.filter(t => t.title.toLowerCase().includes(q))
    .forEach(t => {
      const course = courses.find(c => c.id === t.course_id);
      results.push({ type: 'task', id: t.id, title: t.title, subtitle: course?.name || '', course_id: t.course_id, course_name: course?.name || '' });
    });

  res.json(wrap({ results }));
});

// ============ START ============

app.listen(PORT, () => {
  console.log(`🚀 PPTI Mock API running on http://localhost:${PORT}`);
  console.log('');
  console.log('📝 Demo accounts:');
  console.log('   Admin  → randolf@ppti.ac.id / admin123');
  console.log('   User   → budi@ppti.ac.id / user123');
  console.log('');
  console.log('📌 Endpoints:');
  console.log('   POST   /api/auth/login');
  console.log('   POST   /api/auth/register');
  console.log('   GET    /api/users/me');
  console.log('   GET    /api/users');
  console.log('   GET    /api/roles');
  console.log('   GET    /api/courses');
  console.log('   GET    /api/dashboard/summary');
  console.log('   GET    /api/events');
  console.log('   GET    /api/grades');
  console.log('   GET    /api/search?q=...');
  console.log('   ... dan lainnya');
});
