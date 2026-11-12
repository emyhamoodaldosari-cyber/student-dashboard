import { CalendarDays, CircleCheck, Clock, LayoutGrid, Play, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskFilter } from "@/lib/tasks";

const filters: { id: TaskFilter; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All Tasks", icon: LayoutGrid },
  { id: "active", label: "Active actions", icon: Play },
  { id: "overdue", label: "Overdue", icon: Clock },
  { id: "dueSoon", label: "Due soon", icon: CalendarDays },
  { id: "completed", label: "Completed", icon: CircleCheck },
];

export function TaskFilters({
  value,
  onChange,
  onNew,
}: {
  value: TaskFilter;
  onChange: (f: TaskFilter) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {filters.map(({ id, label, icon: Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-12 shrink-0 items-center gap-3 rounded-full border px-6 text-[17px] font-semibold transition-colors",
                active
                  ? "border-navy bg-navy text-navy-foreground shadow-pill"
                  : "border-border bg-card text-foreground shadow-card hover:border-primary-glow",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onNew}
        className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-primary-btn px-8 text-[17px] font-semibold text-primary-foreground shadow-pill transition-transform hover:-translate-y-0.5 xl:ml-auto"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        New academic task
      </button>
    </div>
  );
}
