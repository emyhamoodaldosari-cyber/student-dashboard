import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[290px] border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        <AppSidebar className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-[275px] shrink-0 overflow-y-auto lg:flex" />
        <main className="min-w-0 flex-1 space-y-5 p-4 md:p-5">{children}</main>
      </div>
    </div>
  );
}
