import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
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
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[290px] border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar
            active={active}
            onSelect={(l) => {
              setActive(l);
              setMenuOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="flex">
        <AppSidebar
          active={active}
          onSelect={setActive}
          className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-[275px] shrink-0 overflow-y-auto lg:flex"
        />

        <main className="min-w-0 flex-1 space-y-5 p-4 md:p-5">
          <HeroBanner />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.47fr_1fr]">
            <NextActionCard />
            <AcademicOverview />
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_1fr]">
            <UpcomingTasks />
            <StudyProgress />
          </div>
        </main>
      </div>
    </div>
  );
}
