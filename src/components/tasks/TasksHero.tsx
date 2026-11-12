import { SquareCheckBig } from "lucide-react";
import laptop from "@/assets/tasks-laptop.png";

export function TasksHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-tasks-hero shadow-card animate-fade-up">
      <img
        src={laptop}
        alt=""
        width={1024}
        height={640}
        className="pointer-events-none absolute -bottom-3 right-6 hidden h-[190px] w-auto md:block lg:right-16"
      />
      <div className="relative flex min-h-[164px] items-center gap-6 px-6 py-7 md:px-6">
        <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-pill">
          <SquareCheckBig className="h-9 w-9" strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-[44px] md:leading-tight">Academic Tasks</h1>
          <p className="mt-1 text-[17px] text-muted-foreground md:text-[20px]">
            Turn your academic goals into clear, actionable tasks.
          </p>
        </div>
      </div>
    </section>
  );
}
