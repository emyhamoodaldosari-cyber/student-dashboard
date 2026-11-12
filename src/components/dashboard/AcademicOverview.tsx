import { ChartColumn } from "lucide-react";
import { academic } from "@/lib/dashboard-data";
import { IconTile } from "./IconTile";

function ProgressRing({ value }: { value: number }) {
  const size = 92;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[92px] w-[92px]">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-glow)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary-soft)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{value}%</span>
    </div>
  );
}

export function AcademicOverview() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up">
      <div className="flex gap-5">
        <IconTile icon={ChartColumn} />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Overview</h2>
          <p className="text-[17px] text-muted-foreground">Your current academic standing</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex-1 pl-2">
          <p className="flex items-baseline gap-2">
            <span className="text-[40px] font-extrabold leading-none tracking-tight">{academic.gpa.toFixed(2)}</span>
            <span className="text-2xl font-medium text-muted-foreground">/ {academic.scale.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-[17px] text-muted-foreground">Current GPA</p>
        </div>
        <span className="mx-6 hidden h-16 w-px bg-border sm:block" />
        <div className="flex flex-1 items-center gap-5">
          <ProgressRing value={academic.semesterProgress} />
          <p className="text-[17px] leading-snug text-muted-foreground">
            Semester
            <br />
            Progress
          </p>
        </div>
      </div>
    </section>
  );
}
