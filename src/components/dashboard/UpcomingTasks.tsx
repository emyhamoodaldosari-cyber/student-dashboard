import { useState } from "react";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { upcomingTasks, type Priority } from "@/lib/dashboard-data";
import { IconTile } from "./IconTile";

const priorityStyles: Record<Priority, string> = {
  High: "bg-high-soft text-high",
  Medium: "bg-medium-soft text-medium",
  Critical: "bg-critical-soft text-critical",
};

export function UpcomingTasks() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up">
      <div className="flex items-start gap-5">
        <IconTile icon={CalendarDays} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Tasks</h2>
          <p className="text-[17px] text-muted-foreground">What's coming up next</p>
        </div>
        <button type="button" className="mt-2 inline-flex items-center gap-2 text-[17px] font-bold text-primary hover:underline">
          View all
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {upcomingTasks.map((task) => {
          const checked = !!done[task.id];
          return (
            <li key={task.id} className="flex items-center gap-5 py-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-label={`Mark "${task.title}" as done`}
                onClick={() => setDone((d) => ({ ...d, [task.id]: !d[task.id] }))}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors",
                  checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:border-primary-glow",
                )}
              >
                {checked && <Check className="h-4 w-4" strokeWidth={3} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[17px] font-bold", checked && "text-muted-foreground line-through")}>{task.title}</p>
                <p className="text-[15px] text-muted-foreground">
                  {task.due} <span className="mx-1.5">•</span> Course: {task.course}
                </p>
              </div>
              <span className={cn("rounded-lg px-4 py-1.5 text-[16px] font-medium", priorityStyles[task.priority])}>
                {task.priority}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
