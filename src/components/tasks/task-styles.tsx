import {
  BookOpen,
  CircleCheck,
  Code,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers,
  LoaderCircle,
  Play,
  type LucideIcon,
} from "lucide-react";
import type { TaskPriority, TaskStatus, TaskType } from "@/lib/tasks";

export const typeIcons: Record<TaskType, LucideIcon> = {
  Assignment: FileText,
  Project: Layers,
  Quiz: Code,
  Exam: GraduationCap,
  Reading: BookOpen,
  Lab: FlaskConical,
};

export const priorityChip: Record<TaskPriority, string> = {
  Low: "bg-low-soft text-low",
  Medium: "bg-medium-soft text-medium",
  High: "bg-high-soft text-high",
  Critical: "bg-critical-soft text-critical",
};

export const statusMeta: Record<TaskStatus, { icon: LucideIcon; chip: string }> = {
  "Not started": { icon: Play, chip: "bg-muted text-foreground" },
  "In progress": { icon: LoaderCircle, chip: "bg-info-soft text-info" },
  Completed: { icon: CircleCheck, chip: "bg-success-soft text-success" },
};
