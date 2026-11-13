import {
  BookOpen,
  CalendarDays,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  Lock,
  Map,
  Rows3,
  Settings,
  SquareCheckBig,
  type LucideIcon,
} from "lucide-react";
import type { MessageKey } from "./i18n-dict";
import type { Localized } from "./i18n";

export type NavItem = { key: MessageKey; icon: LucideIcon; to?: "/" | "/academic-tasks" };

export const navItems: NavItem[] = [
  { key: "nav.dashboard", icon: LayoutGrid, to: "/" },
  { key: "nav.courses", icon: BookOpen },
  { key: "nav.tasks", icon: SquareCheckBig, to: "/academic-tasks" },
  { key: "nav.planner", icon: CalendarDays },
  { key: "nav.notes", icon: Lock },
  { key: "nav.paths", icon: Map },
  { key: "nav.projects", icon: FolderKanban },
  { key: "nav.career", icon: GraduationCap },
  { key: "nav.portfolio", icon: Rows3 },
  { key: "nav.cv", icon: FileText },
  { key: "nav.settings", icon: Settings },
];

export const student = { name: { en: "Ghada", ar: "غادة" } satisfies Localized };

export type Priority = "High" | "Medium" | "Critical";

export type Task = {
  id: string;
  title: Localized;
  /** ISO date */
  due: string;
  course: Localized;
  priority: Priority;
};

export const upcomingTasks: Task[] = [
  {
    id: "t1",
    title: { en: "Revise for Database Systems Quiz", ar: "المراجعة لاختبار أنظمة قواعد البيانات" },
    due: "2026-08-28T09:00:00",
    course: { en: "Database Systems", ar: "أنظمة قواعد البيانات" },
    priority: "High",
  },
  {
    id: "t2",
    title: { en: "Submit Research Proposal", ar: "تسليم مقترح البحث" },
    due: "2026-08-30T09:00:00",
    course: { en: "Research Methods", ar: "مناهج البحث" },
    priority: "Medium",
  },
  {
    id: "t3",
    title: { en: "Update Project Documentation", ar: "تحديث توثيق المشروع" },
    due: "2026-09-03T09:00:00",
    course: { en: "Capstone Project", ar: "مشروع التخرج" },
    priority: "Critical",
  },
];

export const nextAction = {
  title: { en: "Finalize Capstone Architecture", ar: "إنهاء بنية مشروع التخرج" } satisfies Localized,
  description: {
    en: "This item needs your attention to keep your project on track.",
    ar: "يحتاج هذا البند إلى اهتمامك لإبقاء مشروعك على المسار الصحيح.",
  } satisfies Localized,
  due: "2026-09-03T09:00:00",
  priority: "Critical" as Priority,
};

export const academic = { gpa: 3.78, scale: 4.0, semesterProgress: 72 };

export const weeklyStudy = [
  { day: "Mon", hours: 2.4 },
  { day: "Tue", hours: 3.6 },
  { day: "Wed", hours: 2.4 },
  { day: "Thu", hours: 4.4 },
  { day: "Fri", hours: 3.0 },
  { day: "Sat", hours: 1.8 },
  { day: "Sun", hours: 1.2 },
] as const;

export const weeklyChangePercent = 18;
