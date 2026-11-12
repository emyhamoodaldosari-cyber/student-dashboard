import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { NextActionCard } from "@/components/dashboard/NextActionCard";
import { AcademicOverview } from "@/components/dashboard/AcademicOverview";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { StudyProgress } from "@/components/dashboard/StudyProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Beacon Student Hub" },
      { name: "description", content: "Your Beacon study space: tasks, GPA, semester progress and weekly learning activity." },
      { property: "og:title", content: "Dashboard — Beacon Student Hub" },
      { property: "og:description", content: "Track your study progress and stay on top of your academic journey with Beacon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <HeroBanner />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.47fr_1fr]">
        <NextActionCard />
        <AcademicOverview />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_1fr]">
        <UpcomingTasks />
        <StudyProgress />
      </div>
    </AppShell>
  );
}
