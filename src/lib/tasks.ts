export const TASK_TYPES = ["Assignment", "Project", "Quiz", "Exam", "Reading", "Lab"] as const;
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export const TASK_STATUSES = ["Not started", "In progress", "Completed"] as const;

export type TaskType = (typeof TASK_TYPES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type AcademicTask = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  /** ISO string, or null when no due date is set */
  dueAt: string | null;
  estimatedMinutes: number;
  actualMinutes: number;
  course: string | null;
  progress: number;
};

export const COURSES = [
  "CS490 Senior Capstone Design",
  "CS450 Machine Learning",
  "CS410 Algorithms",
  "CS340 Database Systems",
  "RM210 Research Methods",
];

export const sampleTasks: AcademicTask[] = [
  {
    id: "capstone-1",
    title: "Overdue Capstone Phase 1",
    description:
      "Complete the first phase of the capstone project, including design, requirements, and a brief implementation plan.",
    type: "Project",
    priority: "High",
    status: "In progress",
    dueAt: "2026-09-01T09:00:00",
    estimatedMinutes: 120,
    actualMinutes: 45,
    course: "CS490 Senior Capstone Design",
    progress: 40,
  },
  {
    id: "quiz-4",
    title: "Missed Quiz 4",
    description: "Retake Quiz 4 to demonstrate your understanding of the covered topics and update your grade.",
    type: "Quiz",
    priority: "High",
    status: "Not started",
    dueAt: "2026-09-02T09:00:00",
    estimatedMinutes: 30,
    actualMinutes: 0,
    course: "CS450 Machine Learning",
    progress: 0,
  },
  {
    id: "homework-late",
    title: "Late Homework Submission",
    description: "Submit the remaining homework problems, including your final answers and brief explanations.",
    type: "Assignment",
    priority: "High",
    status: "Not started",
    dueAt: "2026-09-02T09:00:00",
    estimatedMinutes: 60,
    actualMinutes: 0,
    course: "CS410 Algorithms",
    progress: 0,
  },
];

export const TASK_FILTERS = ["all", "active", "overdue", "dueSoon", "completed"] as const;
export type TaskFilter = (typeof TASK_FILTERS)[number];

/** How far ahead a task counts as "due soon". */
export const DUE_SOON_DAYS = 7;

export function isOverdue(task: AcademicTask, now: Date): boolean {
  if (task.status === "Completed" || !task.dueAt) return false;
  return new Date(task.dueAt).getTime() < now.getTime();
}

export function isDueSoon(task: AcademicTask, now: Date): boolean {
  if (task.status === "Completed" || !task.dueAt) return false;
  const due = new Date(task.dueAt).getTime();
  return due >= now.getTime() && due <= now.getTime() + DUE_SOON_DAYS * 24 * 60 * 60 * 1000;
}

export function filterTasks(tasks: AcademicTask[], filter: TaskFilter, now: Date): AcademicTask[] {
  switch (filter) {
    case "active":
      return tasks.filter((t) => t.status === "In progress");
    case "overdue":
      return tasks.filter((t) => isOverdue(t, now));
    case "dueSoon":
      return tasks.filter((t) => isDueSoon(t, now));
    case "completed":
      return tasks.filter((t) => t.status === "Completed");
    default:
      return tasks;
  }
}

/** Keeps status and progress consistent: Completed means 100%, 100% means Completed. */
export function normalizeTask(task: AcademicTask): AcademicTask {
  const progress = Math.min(100, Math.max(0, Math.round(task.progress)));
  if (task.status === "Completed") return { ...task, progress: 100 };
  if (progress === 100) return { ...task, progress, status: "Completed" };
  return { ...task, progress };
}

/** Arabic names for the built-in courses (stored values stay in English). */
export const COURSE_NAMES_AR: Record<string, string> = {
  "CS490 Senior Capstone Design": "CS490 تصميم مشروع التخرج",
  "CS450 Machine Learning": "CS450 تعلّم الآلة",
  "CS410 Algorithms": "CS410 الخوارزميات",
  "CS340 Database Systems": "CS340 أنظمة قواعد البيانات",
  "RM210 Research Methods": "RM210 مناهج البحث",
};

export function courseName(course: string, locale: "en" | "ar"): string {
  return locale === "ar" ? (COURSE_NAMES_AR[course] ?? course) : course;
}

/** Arabic text for the sample tasks, keyed by id and the original English title. */
const SAMPLE_TEXT_AR: Record<string, { en: string; title: string; description: string }> = {
  "capstone-1": {
    en: "Overdue Capstone Phase 1",
    title: "المرحلة الأولى المتأخرة من مشروع التخرج",
    description: "أكمل المرحلة الأولى من مشروع التخرج، بما في ذلك التصميم والمتطلبات وخطة تنفيذ مختصرة.",
  },
  "quiz-4": {
    en: "Missed Quiz 4",
    title: "الاختبار القصير 4 الفائت",
    description: "أعد الاختبار القصير 4 لإثبات فهمك للموضوعات المشمولة وتحديث درجتك.",
  },
  "homework-late": {
    en: "Late Homework Submission",
    title: "تسليم الواجب المتأخر",
    description: "سلّم مسائل الواجب المتبقية، مع إجاباتك النهائية وشروحات موجزة.",
  },
};

/** Title/description to show: sample tasks are translated until the student edits them. */
export function taskText(task: AcademicTask, locale: "en" | "ar"): { title: string; description: string } {
  const ar = SAMPLE_TEXT_AR[task.id];
  if (locale === "ar" && ar && task.title === ar.en) return { title: ar.title, description: ar.description };
  return { title: task.title, description: task.description };
}
