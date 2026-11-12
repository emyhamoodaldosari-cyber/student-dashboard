import {
  BookOpen,
  Briefcase,
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

export type NavItem = { label: string; icon: LucideIcon; to?: "/" | "/academic-tasks" };

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, to: "/" },
  { label: "My Courses", icon: BookOpen },
  { label: "Academic Tasks", icon: SquareCheckBig, to: "/academic-tasks" },
  { label: "Weekly Planner", icon: CalendarDays },
  { label: "Private Notes", icon: Lock },
  { label: "Learning Paths", icon: Map },
  { label: "Projects", icon: FolderKanban },
  { label: "Career Journey", icon: GraduationCap },
  { label: "Portfolio", icon: Rows3 },
  { label: "CV Builder", icon: FileText },
  { label: "Settings", icon: Settings },
];

export const student = { name: "Ghada" };

export type Priority = "High" | "Medium" | "Critical";

export type Task = {
  id: string;
  title: string;
  due: string;
  course: string;
  priority: Priority;
};

export const upcomingTasks: Task[] = [
  { id: "t1", title: "Revise for Database Systems Quiz", due: "Aug 28, 2026", course: "Database Systems", priority: "High" },
  { id: "t2", title: "Submit Research Proposal", due: "Aug 30, 2026", course: "Research Methods", priority: "Medium" },
  { id: "t3", title: "Update Project Documentation", due: "Sep 3, 2026", course: "Capstone Project", priority: "Critical" },
];

export const nextAction = {
  title: "Finalize Capstone Architecture",
  description: "This item needs your attention to keep your project on track.",
  due: "Sep 3, 2026",
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
];

export const weeklyChangePercent = 18;
