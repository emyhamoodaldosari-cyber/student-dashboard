import { TrendingUp, Zap } from "lucide-react";
import { weeklyChangePercent, weeklyStudy } from "@/lib/dashboard-data";
import { IconTile } from "./IconTile";

export function StudyProgress() {
  const max = Math.max(...weeklyStudy.map((d) => d.hours));

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up">
      <div className="flex gap-5">
        <IconTile icon={TrendingUp} />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Study Progress</h2>
          <p className="text-[17px] text-muted-foreground">Your learning activity this week</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-stretch">
        <div className="flex-1 sm:border-r sm:border-border sm:pr-6">
          <div className="flex h-[128px] items-end justify-between gap-3">
            {weeklyStudy.map((d, i) => {
              const peak = d.hours === max;
              return (
                <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div
                    title={`${d.day}: ${d.hours}h`}
                    className={`w-full max-w-10 rounded-t-xl rounded-b-sm animate-bar-grow ${peak ? "bg-bar-peak" : "bg-bar"}`}
                    style={{ height: `${(d.hours / max) * 100}%`, animationDelay: `${i * 70}ms` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between gap-3">
            {weeklyStudy.map((d) => (
              <span key={d.day} className="flex-1 text-center text-[16px] text-foreground/85">
                {d.day}
              </span>
            ))}
          </div>
        </div>

        <aside className="flex flex-col justify-center rounded-2xl bg-insight p-6 sm:w-[238px]">
          <p className="flex items-center gap-2 text-[17px] font-bold text-primary">
            <Zap className="h-5 w-5" />
            Insight
          </p>
          <p className="mt-3 text-[19px] leading-snug">
            You studied <span className="font-bold">{weeklyChangePercent}%</span> more than last week. Keep the
            momentum!
          </p>
        </aside>
      </div>
    </section>
  );
}
