import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-lighthouse.jpg";
import { student } from "@/lib/dashboard-data";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy text-navy-foreground shadow-card animate-fade-up">
      <img
        src={hero}
        alt="Glowing lighthouse over violet waves"
        width={1920}
        height={560}
        className="absolute inset-0 h-full w-full object-cover object-[right_25%]"
      />
      <div className="absolute inset-0 bg-hero-fade md:hidden" />
      <div className="relative flex min-h-[292px] flex-col justify-center px-8 py-9 md:px-[52px]">
        <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-navy-foreground/90">
          <span className="h-[3px] w-8 rounded-full bg-primary-glow" />
          Your study space
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-[50px] md:leading-[1.1]">
          Welcome, {student.name}
        </h1>
        <p className="mt-3 max-w-[680px] text-lg text-navy-foreground/90 md:text-[19px]">
          Track your study progress and stay on top of your academic journey.
        </p>
        <div className="mt-7">
          <button
            type="button"
            className="inline-flex h-12 items-center gap-3 rounded-xl bg-card px-7 text-lg font-bold text-navy shadow-pill transition-transform hover:-translate-y-0.5"
          >
            View tasks
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
