import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/dashboard-data";
import { useI18n } from "@/lib/i18n";

const itemClass =
  "flex h-[50px] w-full items-center gap-4 rounded-2xl text-start text-[18px] transition-colors whitespace-nowrap";
const activeClass = "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-pill";
const idleClass = "text-sidebar-foreground/95 hover:bg-sidebar-accent";

export function AppSidebar({
  onNavigate,
  className,
  collapsed = false,
}: {
  onNavigate?: () => void;
  className?: string;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dir } = useI18n();
  const padding = collapsed ? "justify-center px-0" : "px-6";

  /** In the icon-only rail, show the item's name in a tooltip beside it. */
  const withTip = (label: string, node: ReactNode) =>
    collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side={dir === "rtl" ? "left" : "right"} className="bg-navy-deep text-sm text-navy-foreground">
          {label}
        </TooltipContent>
      </Tooltip>
    ) : (
      node
    );

  return (
    <nav
      aria-label={t("nav.label")}
      className={cn(
        "flex flex-col bg-sidebar pb-8 pt-8 text-sidebar-foreground transition-[padding] duration-300",
        collapsed ? "px-3" : "px-4",
        className,
      )}
    >
      <ul className="flex flex-col gap-1">
        {navItems.map(({ key, icon: Icon, to }) => {
          const label = t(key);
          const isActive = !!to && pathname === to;
          const content = (
            <>
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
              <span className={cn(collapsed && "sr-only")}>{label}</span>
            </>
          );
          return (
            <li key={key}>
              {to
                ? withTip(
                    label,
                    <Link
                      to={to}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(itemClass, padding, isActive ? activeClass : idleClass)}
                    >
                      {content}
                    </Link>,
                  )
                : withTip(
                    label,
                    <button type="button" className={cn(itemClass, padding, idleClass)}>
                      {content}
                    </button>,
                  )}
            </li>
          );
        })}
      </ul>

      <div className={cn("my-6 h-px bg-sidebar-border", collapsed ? "mx-2" : "mx-4")} />

      {withTip(
        t("nav.signOut"),
        <button type="button" className={cn(itemClass, padding, idleClass)}>
          <LogOut className="h-6 w-6 shrink-0 rtl:-scale-x-100" strokeWidth={1.75} />
          <span className={cn(collapsed && "sr-only")}>{t("nav.signOut")}</span>
        </button>,
      )}
    </nav>
  );
}
