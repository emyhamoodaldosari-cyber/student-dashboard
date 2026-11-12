import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/dashboard-data";

export function AppSidebar({
  active,
  onSelect,
  className,
}: {
  active: string;
  onSelect: (label: string) => void;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col bg-sidebar px-4 pb-8 pt-8 text-sidebar-foreground", className)}>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = label === active;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => onSelect(label)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-[50px] w-full items-center gap-4 rounded-2xl px-6 text-left text-[18px] transition-colors",
                  isActive
                    ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-pill"
                    : "text-sidebar-foreground/95 hover:bg-sidebar-accent",
                )}
              >
                <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mx-4 my-6 h-px bg-sidebar-border" />

      <button
        type="button"
        className="flex h-[50px] w-full items-center gap-4 rounded-2xl px-6 text-left text-[18px] transition-colors hover:bg-sidebar-accent"
      >
        <LogOut className="h-6 w-6" strokeWidth={1.75} />
        Sign Out
      </button>
    </nav>
  );
}
