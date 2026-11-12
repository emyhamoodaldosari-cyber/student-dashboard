import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SquareCheckBig } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TasksHero } from "@/components/tasks/TasksHero";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { useTasks } from "@/components/tasks/useTasks";
import { filterTasks, type AcademicTask, type TaskFilter } from "@/lib/tasks";

export const Route = createFileRoute("/academic-tasks")({
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
  const { tasks, upsert, update, remove } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicTask | null>(null);
  const now = useMemo(() => new Date(), []);

  const visible = useMemo(() => filterTasks(tasks, filter, now), [tasks, filter, now]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (t: AcademicTask) => {
    setEditing(t);
    setDialogOpen(true);
  };

  return (
    <AppShell>
      <TasksHero />
      <TaskFilters value={filter} onChange={setFilter} onNew={openNew} />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <SquareCheckBig className="h-7 w-7" />
          </span>
          <p className="mt-4 text-xl font-bold">No tasks here</p>
          <p className="mt-1 text-muted-foreground">Nothing matches this filter right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              now={now}
              onStart={() => {
                update(task.id, { status: "In progress" });
                toast.success(`Started “${task.title}”`);
              }}
              onEdit={() => openEdit(task)}
              onOpen={() => openEdit(task)}
              onComplete={() => {
                update(task.id, { status: "Completed" });
                toast.success("Task completed — nice work!");
              }}
              onReopen={() => update(task.id, { status: "In progress", progress: 90 })}
              onDuplicate={() => {
                upsert({ ...task, id: crypto.randomUUID(), title: `${task.title} (copy)` });
                toast.success("Task duplicated");
              }}
              onDelete={() => {
                remove(task.id);
                toast("Task deleted", { action: { label: "Undo", onClick: () => upsert(task) } });
              }}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editing}
        onSubmit={(t) => {
          upsert(t);
          toast.success(editing ? "Task updated" : "Task created");
        }}
      />
    </AppShell>
  );
}
