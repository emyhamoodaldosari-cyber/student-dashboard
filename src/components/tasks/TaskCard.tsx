import { ArrowRight, CalendarDays, Clock, Copy, ExternalLink, Flag, GraduationCap, MoreVertical, Pencil, Play, RotateCcw, Trash2, CircleCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDue, isOverdue, type AcademicTask } from "@/lib/tasks";
import { priorityChip, statusMeta, typeIcons } from "./task-styles";

type Props = {
  task: AcademicTask;
  now: Date;
  onStart: () => void;
  onEdit: () => void;
  onOpen: () => void;
  onComplete: () => void;
  onReopen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

const chip = "inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[14px] font-semibold whitespace-nowrap";
const iconBtn =
  "flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-card transition-colors hover:border-primary-glow hover:text-primary";

export function TaskCard({ task, now, onStart, onEdit, onOpen, onComplete, onReopen, onDuplicate, onDelete }: Props) {
  const TypeIcon = typeIcons[task.type];
  const StatusIcon = statusMeta[task.status].icon;
  const inProgress = task.status === "In progress";
  const completed = task.status === "Completed";
  const overdue = isOverdue(task, now);

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border bg-card p-6 shadow-card transition-shadow animate-fade-up hover:shadow-pill",
        inProgress ? "border-primary-glow ring-1 ring-primary-glow/40" : "border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <TypeIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          <span className={cn(chip, "bg-primary-soft text-primary")}>{task.type}</span>
          <span className={cn(chip, statusMeta[task.status].chip)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {task.status === "In progress" ? "In Progress" : task.status}
          </span>
          <span className={cn(chip, priorityChip[task.priority])}>
            <Flag className="h-3.5 w-3.5" />
            {task.priority}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`More actions for ${task.title}`}
            className="rounded-lg p-1.5 text-foreground hover:bg-muted focus:outline-none"
          >
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {completed ? (
              <DropdownMenuItem onSelect={onReopen}>
                <RotateCcw className="h-4 w-4" /> Reopen
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={onComplete}>
                <CircleCheck className="h-4 w-4" /> Mark complete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={onDuplicate}>
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h2 className={cn("mt-4 text-2xl font-bold tracking-tight", completed && "text-muted-foreground line-through")}>
        {task.title}
      </h2>
      {task.description && (
        <p className="mt-1.5 line-clamp-3 text-[17px] leading-snug text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-4 rounded-2xl bg-muted p-4">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[14px] text-muted-foreground">Due date</p>
              <p className={cn("text-[15px] font-bold", overdue && "text-critical")}>{formatDue(task.dueAt)}</p>
            </div>
          </div>
          <div className="flex gap-3 border-l border-border pl-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[14px] text-muted-foreground">Estimated time</p>
              <p className="text-[15px] font-bold">{task.estimatedMinutes} min</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-[14px] text-muted-foreground">Course</p>
            <p className="text-[16px] font-bold">{task.course ?? "No course"}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-[17px]">
        <span>Progress</span>
        <span className="font-bold">{task.progress}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary-soft">
        <div className="h-full rounded-full bg-primary-btn transition-all" style={{ width: `${task.progress}%` }} />
      </div>

      <div className="mt-auto flex items-center gap-3 pt-6">
        {completed ? (
          <span className="inline-flex h-12 items-center gap-2 rounded-full bg-success-soft px-6 text-[17px] font-semibold text-success">
            <CircleCheck className="h-5 w-5" /> Completed
          </span>
        ) : inProgress ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-12 min-w-[200px] items-center justify-center gap-3 rounded-full bg-primary-btn px-7 text-[18px] font-semibold text-primary-foreground shadow-pill transition-transform hover:-translate-y-0.5"
          >
            <Play className="h-5 w-5" /> Continue <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex h-12 min-w-[180px] items-center justify-center gap-3 rounded-full border border-primary-glow bg-card px-7 text-[18px] font-semibold text-primary transition-colors hover:bg-primary-soft"
          >
            <Play className="h-5 w-5" /> Start <ArrowRight className="h-5 w-5" />
          </button>
        )}
        <div className="ml-auto flex gap-3">
          <button type="button" onClick={onEdit} aria-label={`Edit ${task.title}`} className={iconBtn}>
            <Pencil className="h-5 w-5" />
          </button>
          <button type="button" onClick={onOpen} aria-label={`Open ${task.title}`} className={iconBtn}>
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
