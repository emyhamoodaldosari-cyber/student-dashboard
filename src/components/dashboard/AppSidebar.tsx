import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/dashboard-data";

const itemClass =
  "flex h-[50px] w-full items-center gap-4 rounded-2xl px-6 text-left text-[18px] transition-colors";
const activeClass = "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-pill";
const idleClass = "text-sidebar-foreground/95 hover:bg-sidebar-accent";

export function AppSidebar({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className={cn("flex flex-col bg-sidebar px-4 pb-8 pt-8 text-sidebar-foreground", className)}>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = !!to && pathname === to;
          const content = (
            <>
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
              {label}
            </>
          );
          return (
            <li key={label}>
              {to ? (
                <Link
                  to={to}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(itemClass, isActive ? activeClass : idleClass)}
                >
                  {content}
                </Link>
              ) : (
                <button type="button" className={cn(itemClass, idleClass)}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mx-4 my-6 h-px bg-sidebar-border" />

      <button type="button" className={cn(itemClass, idleClass)}>
        <LogOut className="h-6 w-6" strokeWidth={1.75} />
        Sign Out
      </button>
    </nav>
  );
}
