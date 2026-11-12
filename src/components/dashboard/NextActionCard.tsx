import { ArrowRight, CalendarDays, Crosshair, Flag } from "lucide-react";
import { nextAction } from "@/lib/dashboard-data";
import { IconTile } from "./IconTile";

export function NextActionCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up">
      <div className="pointer-events-none absolute inset-0 bg-card-wave" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex flex-1 gap-5">
          <IconTile icon={Crosshair} />
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">Next best action</p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight">{nextAction.title}</h2>
            <p className="mt-1 text-[16px] text-muted-foreground">{nextAction.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-[16px] font-medium">
                <CalendarDays className="h-4 w-4" />
                Due: {nextAction.due}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-critical-soft px-4 py-2 text-[16px] font-medium text-critical">
                <Flag className="h-4 w-4" />
                Priority: {nextAction.priority}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-navy px-7 text-[17px] font-semibold text-navy-foreground shadow-pill transition-transform hover:-translate-y-0.5 md:self-center"
        >
          Take action
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
