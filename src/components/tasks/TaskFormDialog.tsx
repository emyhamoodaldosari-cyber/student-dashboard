import { useEffect, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChartColumnIncreasing,
  ClipboardList,
  Clock,
  Flag,
  GraduationCap,
  Layers,
  Pencil,
  Target,
  TextQuote,
  Timer,
  X,
  type LucideIcon,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n-dict";
import {
  COURSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
  courseName,
  taskText,
  type AcademicTask,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
} from "@/lib/tasks";
import { priorityChip, statusMeta, typeIcons } from "./task-styles";

const NO_COURSE = "__none__";

type FormState = {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt: string;
  estimatedMinutes: string;
  actualMinutes: string;
  course: string;
  progress: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  type: "Assignment",
  priority: "Medium",
  status: "Not started",
  dueAt: "",
  estimatedMinutes: "30",
  actualMinutes: "0",
  course: NO_COURSE,
  progress: "0",
};

function toForm(t: AcademicTask, locale: Locale): FormState {
  const text = taskText(t, locale);
  return {
    title: text.title,
    description: text.description,
    type: t.type,
    priority: t.priority,
    status: t.status,
    dueAt: t.dueAt ? t.dueAt.slice(0, 16) : "",
    estimatedMinutes: String(t.estimatedMinutes),
    actualMinutes: String(t.actualMinutes),
    course: t.course ?? NO_COURSE,
    progress: String(t.progress),
  };
}

type Errors = Partial<Record<keyof FormState, string>>;

type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

function validate(f: FormState, t: Translate): Errors {
  const e: Errors = {};
  const title = f.title.trim();
  if (!title) e.title = t("form.errTitle");
  else if (title.length > 120) e.title = t("form.errTitleLong");
  if (f.description.length > 1000) e.description = t("form.errDesc");
  const est = Number(f.estimatedMinutes);
  if (f.estimatedMinutes === "" || !Number.isFinite(est) || est < 0 || est > 10000)
    e.estimatedMinutes = t("form.errRange", { min: 0, max: 10000 });
  const act = Number(f.actualMinutes);
  if (f.actualMinutes === "" || !Number.isFinite(act) || act < 0 || act > 10000)
    e.actualMinutes = t("form.errRange", { min: 0, max: 10000 });
  const prog = Number(f.progress);
  if (f.progress === "" || !Number.isFinite(prog) || prog < 0 || prog > 100) e.progress = t("form.errRange", { min: 0, max: 100 });
  return e;
}

const fieldBox =
  "flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-card px-4 text-[16px] shadow-card transition-colors focus-within:border-primary-glow focus-within:ring-2 focus-within:ring-ring/30";
const selectTrigger =
  "h-12 rounded-xl border-input bg-card px-4 text-[16px] font-medium shadow-card focus:ring-2 focus:ring-ring/30 [&>span]:flex [&>span]:items-center [&>span]:gap-3";

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p className="mb-1.5 text-[16px] font-semibold">
      {children}
      {required && <span className="ms-0.5 text-destructive">*</span>}
    </p>
  );
}

function ErrorText({ msg }: { msg?: string | undefined }) {
  return msg ? <p className="mt-1.5 text-sm text-destructive">{msg}</p> : null;
}

function Section({ icon: Icon, title, children, className }: { icon: LucideIcon; title: string; children: ReactNode; className?: string | undefined }) {
  return (
    <section className={cn("rounded-3xl border border-border bg-card/80 px-5 py-4 shadow-card", className)}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <h3 className="text-[19px] font-bold">{title}</h3>
        <span className="ms-3 h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: AcademicTask | null;
  onSubmit: (task: AcademicTask) => void;
}) {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const editing = !!task;

  useEffect(() => {
    if (open) {
      setForm(task ? toForm(task, locale) : emptyForm);
      setErrors({});
    }
    // Only reset when the dialog opens, not when the language changes mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, t);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Untouched translated sample text keeps its original stored wording.
    const shown = task ? taskText(task, locale) : null;
    const title = form.title.trim();
    const description = form.description.trim();
    onSubmit({
      id: task?.id ?? crypto.randomUUID(),
      title: task && shown && title === shown.title ? task.title : title,
      description: task && shown && description === shown.description ? task.description : description,
      type: form.type,
      priority: form.priority,
      status: form.status,
      dueAt: form.dueAt ? form.dueAt : null,
      estimatedMinutes: Math.round(Number(form.estimatedMinutes)),
      actualMinutes: Math.round(Number(form.actualMinutes)),
      course: form.course === NO_COURSE ? null : form.course,
      progress: Number(form.progress),
    });
    onOpenChange(false);
  };

  const TypeIcon = typeIcons[form.type];
  const StatusIcon = statusMeta[form.status].icon;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-[1080px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[32px] border border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 focus:outline-none">
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* Header */}
            <div className="relative flex items-center gap-4 border-b border-border bg-card px-5 py-5 sm:gap-6 md:px-12">
              <div className="pointer-events-none absolute inset-0 bg-modal-wave" />
              <span className="relative hidden h-[72px] w-[72px] shrink-0 sm:flex items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-pill">
                <ClipboardList className="h-9 w-9" strokeWidth={1.75} />
              </span>
              <span className="relative hidden h-16 w-px bg-border sm:block" />
              <div className="relative min-w-0 flex-1 pe-10">
                <DialogPrimitive.Title className="text-2xl font-bold tracking-tight md:text-[32px]">
                  {editing ? t("form.editTitle") : t("form.createTitle")}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1 text-[16px] text-muted-foreground md:text-[18px]">
                  {t("form.subtitle")}
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close
                aria-label={t("form.close")}
                className="absolute end-4 top-4 sm:end-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground sm:h-12 sm:w-12 shadow-card transition-colors hover:text-primary md:end-10 md:top-8"
              >
                <X className="h-6 w-6" />
              </DialogPrimitive.Close>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-8">
              <Section icon={Layers} title={t("form.basic")}>
                <div className="grid gap-x-8 gap-y-3 md:grid-cols-[1fr_340px]">
                  <div>
                    <Label required>{t("form.title")}</Label>
                    <label className={cn(fieldBox, errors.title && "border-destructive")}>
                      <Pencil className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <input
                        autoFocus
                        value={form.title}
                        maxLength={140}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder={t("form.titlePh")}
                        className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none"
                      />
                    </label>
                    <ErrorText msg={errors.title} />
                  </div>
                  <div>
                    <Label required>{t("form.type")}</Label>
                    <Select value={form.type} onValueChange={(v) => set("type", v as TaskType)}>
                      <SelectTrigger className={selectTrigger} aria-label={t("form.type")}>
                        <SelectValue>
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          {t(`type.${form.type}`)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`type.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("form.description")}</Label>
                    <div className={cn("flex gap-3 rounded-xl border border-input bg-card px-4 py-3 shadow-card focus-within:border-primary-glow focus-within:ring-2 focus-within:ring-ring/30", errors.description && "border-destructive")}>
                      <TextQuote className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                      <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder={t("form.descriptionPh")}
                        rows={2}
                        className="min-h-[52px] w-full resize-y bg-transparent text-[16px] placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                    <ErrorText msg={errors.description} />
                  </div>
                  <div>
                    <Label required>{t("form.priority")}</Label>
                    <Select value={form.priority} onValueChange={(v) => set("priority", v as TaskPriority)}>
                      <SelectTrigger className={selectTrigger} aria-label={t("form.priority")}>
                        <SelectValue>
                          <Flag className="h-5 w-5 text-medium" />
                          <span className={cn("rounded-lg px-3 py-0.5", priorityChip[form.priority])}>{t(`priority.${form.priority}`)}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            <span className={cn("rounded-md px-2 py-0.5", priorityChip[p])}>{t(`priority.${p}`)}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>

              <div className="grid gap-4 md:grid-cols-[0.92fr_1fr]">
                <Section icon={Clock} title={t("form.time")}>
                  <Label>{t("form.due")}</Label>
                  <label className={fieldBox}>
                    <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <input
                      type="datetime-local"
                      value={form.dueAt}
                      onChange={(e) => set("dueAt", e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </label>
                  <div className="mt-5 grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
                    <div>
                      <Label>{t("form.est")}</Label>
                      <label className={cn(fieldBox, errors.estimatedMinutes && "border-destructive")}>
                        <Timer className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <input
                          type="number"
                          min={0}
                          max={10000}
                          value={form.estimatedMinutes}
                          onChange={(e) => set("estimatedMinutes", e.target.value)}
                          className="w-full bg-transparent focus:outline-none"
                        />
                      </label>
                      <ErrorText msg={errors.estimatedMinutes} />
                    </div>
                    <div>
                      <Label>{t("form.actual")}</Label>
                      <label className={cn(fieldBox, errors.actualMinutes && "border-destructive")}>
                        <Timer className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <input
                          type="number"
                          min={0}
                          max={10000}
                          value={form.actualMinutes}
                          onChange={(e) => set("actualMinutes", e.target.value)}
                          className="w-full bg-transparent focus:outline-none"
                        />
                      </label>
                      <ErrorText msg={errors.actualMinutes} />
                    </div>
                  </div>
                </Section>

                <div className="space-y-4">
                  <Section icon={GraduationCap} title={t("form.learning")}>
                    <Label>{t("form.course")}</Label>
                    <Select value={form.course} onValueChange={(v) => set("course", v)}>
                      <SelectTrigger className={selectTrigger} aria-label={t("form.course")}>
                        <SelectValue>
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <span className="truncate">{form.course === NO_COURSE ? t("tasks.noCourse") : courseName(form.course, locale)}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NO_COURSE}>{t("tasks.noCourse")}</SelectItem>
                        {COURSES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {courseName(c, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Section>

                  <Section icon={ChartColumnIncreasing} title={t("form.progressState")}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.1fr_1fr]">
                      <div>
                        <Label required>{t("form.status")}</Label>
                        <Select value={form.status} onValueChange={(v) => set("status", v as TaskStatus)}>
                          <SelectTrigger className={selectTrigger} aria-label={t("form.status")}>
                            <SelectValue>
                              <StatusIcon className="h-5 w-5 text-muted-foreground" />
                              {t(`status.${form.status}`)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {t(`status.${s}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t("form.progress")}</Label>
                        <label className={cn(fieldBox, errors.progress && "border-destructive")}>
                          <Target className="h-5 w-5 shrink-0 text-muted-foreground" />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={form.progress}
                            onChange={(e) => set("progress", e.target.value)}
                            className="w-full bg-transparent focus:outline-none"
                          />
                          <span className="text-muted-foreground">%</span>
                        </label>
                        <ErrorText msg={errors.progress} />
                      </div>
                    </div>
                  </Section>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border bg-card/60 px-4 py-4 sm:gap-4 md:px-8">
              <DialogPrimitive.Close
                type="button"
                className="h-12 rounded-2xl border border-border bg-card px-5 text-[17px] sm:h-14 sm:px-8 sm:text-[18px] font-semibold shadow-card transition-colors hover:border-primary-glow"
              >
                {t("form.cancel")}
              </DialogPrimitive.Close>
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary-btn px-6 text-[17px] sm:h-14 sm:gap-3 sm:px-10 sm:text-[18px] font-semibold text-primary-foreground shadow-pill transition-transform hover:-translate-y-0.5"
              >
                <Check className="h-5 w-5" strokeWidth={2.5} />
                {editing ? t("form.save") : t("form.create")}
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
