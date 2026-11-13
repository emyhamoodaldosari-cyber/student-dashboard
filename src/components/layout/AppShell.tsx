import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SearchDialog } from "@/components/search/SearchDialog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "beacon.sidebar-collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, dir } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      window.localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  }, []);

  // Ctrl/⌘ + K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
          className="w-[290px] overflow-y-auto border-sidebar-border bg-sidebar p-0 text-sidebar-foreground scrollbar-sidebar"
        >
          <SheetTitle className="sr-only">{t("nav.label")}</SheetTitle>
          <AppSidebar onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        <AppSidebar
          collapsed={collapsed}
          className={cn(
            "sticky top-[76px] hidden h-[calc(100vh-76px)] shrink-0 overflow-y-auto overflow-x-hidden scrollbar-sidebar transition-[width] duration-300 ease-out lg:flex",
            collapsed ? "w-[88px]" : "w-[275px]",
          )}
        />
        <main className="min-w-0 flex-1 space-y-5 p-3 sm:p-4 md:p-5">{children}</main>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onToggleSidebar={toggleCollapsed} />
    </div>
  );
}
