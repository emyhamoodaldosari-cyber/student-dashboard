import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SquareCheckBig } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TasksHero } from "@/components/tasks/TasksHero";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { useTasks } from "@/components/tasks/useTasks";
import { useI18n } from "@/lib/i18n";
import { filterTasks, taskText, type AcademicTask, type TaskFilter } from "@/lib/tasks";

type TasksSearch = { task?: string; action?: "new" };

export const Route = createFileRoute("/academic-tasks")({
  validateSearch: (s: Record<string, unknown>): TasksSearch => ({
    ...(typeof s.task === "string" ? { task: s.task } : {}),
    ...(s.action === "new" ? { action: "new" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Academic Tasks — Beacon" },
      { name: "description", content: "Turn your academic goals into clear, actionable tasks with due dates, effort and progress." },
      { property: "og:title", content: "Academic Tasks — Beacon" },
      { property: "og:description", content: "Plan, track and finish assignments, quizzes and projects in Beacon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademicTasksPage,
});

function AcademicTasksPage() {
  const { t, locale } = useI18n();
  const { tasks, loaded, upsert, update, remove } = useTasks();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/academic-tasks" });
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicTask | null>(null);
  const now = useMemo(() => new Date(), []);

  const visible = useMemo(() => filterTasks(tasks, filter, now), [tasks, filter, now]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (task: AcademicTask) => {
    setEditing(task);
    setDialogOpen(true);
  };

  // Opened from search: ?task=<id> edits that task, ?action=new starts a new one.
  useEffect(() => {
    if (!loaded || (!search.task && !search.action)) return;
    const target = search.task ? tasks.find((x) => x.id === search.task) : undefined;
    if (target) openEdit(target);
    else if (search.action === "new") openNew();
    void navigate({ search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, search.task, search.action]);

  return (
    <AppShell>
      <TasksHero />
      <TaskFilters value={filter} onChange={setFilter} onNew={openNew} />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <SquareCheckBig className="h-7 w-7" />
          </span>
          <p className="mt-4 text-xl font-bold">{t("tasks.emptyTitle")}</p>
          <p className="mt-1 text-muted-foreground">{t("tasks.emptyText")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              now={now}
              onStart={() => {
                update(task.id, { status: "In progress" });
                toast.success(t("tasks.toastStarted", { title: taskText(task, locale).title }));
              }}
              onEdit={() => openEdit(task)}
              onOpen={() => openEdit(task)}
              onComplete={() => {
                update(task.id, { status: "Completed" });
                toast.success(t("tasks.toastCompleted"));
              }}
              onReopen={() => update(task.id, { status: "In progress", progress: 90 })}
              onDuplicate={() => {
                const text = taskText(task, locale);
                upsert({
                  ...task,
                  id: crypto.randomUUID(),
                  title: `${text.title} ${t("tasks.copySuffix")}`,
                  description: text.description,
                });
                toast.success(t("tasks.toastDuplicated"));
              }}
              onDelete={() => {
                remove(task.id);
                toast(t("tasks.toastDeleted"), { action: { label: t("tasks.undo"), onClick: () => upsert(task) } });
              }}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editing}
        onSubmit={(task) => {
          upsert(task);
          toast.success(editing ? t("tasks.toastUpdated") : t("tasks.toastCreated"));
        }}
      />
    </AppShell>
  );
}
