import { Bell, Check, ChevronDown, Globe, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/beacon-logo.png.asset.json";
import avatar from "@/assets/default-avatar.png.asset.json";
import { student } from "@/lib/dashboard-data";
import { useI18n, type Locale } from "@/lib/i18n";
import { useModKey } from "@/hooks/use-mod-key";
import { cn } from "@/lib/utils";

const languages: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ar", label: "العربية" },
];

const iconBtn = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-sidebar-accent";

export function AppHeader({
  collapsed,
  onToggleCollapsed,
  onOpenMenu,
  onOpenSearch,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  const { t, l, locale, setLocale } = useI18n();
  const modKey = useModKey();
  const current = languages.find((x) => x.id === locale) ?? languages[0];
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center gap-1.5 border-b border-navy-border bg-navy-deep px-2 text-navy-foreground sm:gap-3 sm:px-4 lg:px-0">
      <button type="button" onClick={onOpenMenu} aria-label={t("header.openMenu")} className={cn(iconBtn, "lg:hidden")}>
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={cn(
          "flex min-w-0 items-center gap-3 transition-[width,padding] duration-300 ease-out",
          collapsed ? "lg:w-[88px] lg:justify-center lg:ps-0" : "lg:w-[275px] lg:ps-10",
        )}
      >
        <img src={logo.url} alt={t("brand")} width={44} height={44} className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
        <span
          className={cn(
            "hidden text-2xl font-bold tracking-tight min-[400px]:inline sm:text-[28px]",
            collapsed && "lg:hidden",
          )}
        >
          {t("brand")}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? t("header.expand") : t("header.collapse")}
        aria-pressed={collapsed}
        title={collapsed ? t("header.expand") : t("header.collapse")}
        className={cn(iconBtn, "hidden border border-navy-border lg:ms-3 lg:flex")}
      >
        <ToggleIcon className="h-5 w-5 rtl:-scale-x-100" />
      </button>

      <div className="hidden flex-1 justify-center px-4 md:flex">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-12 w-full max-w-[578px] items-center gap-3 rounded-full border border-navy-border bg-navy px-5 text-start transition-colors hover:border-primary-glow focus:outline-none focus-visible:border-primary-glow"
        >
          <Search className="h-5 w-5 shrink-0 text-navy-muted" />
          <span className="flex-1 truncate text-[17px] text-navy-muted">
            {t("header.search")} {modKey}K...
          </span>
          <kbd className="hidden shrink-0 rounded-md border border-navy-border px-2 py-0.5 font-sans text-sm text-navy-muted lg:inline" dir="ltr">
            {modKey} | K
          </kbd>
        </button>
      </div>

      <div className="ms-auto flex items-center gap-1 sm:gap-2 lg:pe-5">
        <button type="button" onClick={onOpenSearch} aria-label={t("header.searchShort")} className={cn(iconBtn, "md:hidden")}>
          <Search className="h-5 w-5" />
        </button>

        <button type="button" aria-label={t("header.notifications")} className={cn(iconBtn, "relative")}>
          <Bell className="h-6 w-6" />
          <span className="absolute end-2 top-1.5 h-2.5 w-2.5 rounded-full bg-notify ring-2 ring-navy-deep" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-11 items-center gap-2 rounded-full border border-navy-border pe-2 ps-1 text-[17px] hover:bg-sidebar-accent focus:outline-none sm:h-12 sm:gap-2.5 sm:pe-4 sm:ps-1.5">
            <img src={avatar.url} alt="" width={36} height={36} className="h-8 w-8 rounded-full sm:h-9 sm:w-9" />
            <span className="hidden sm:inline">{l(student.name)}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>{t("header.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("header.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("header.signOut")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="mx-1 hidden h-8 w-px bg-navy-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("header.language")}
            className="flex h-11 items-center gap-2 rounded-full border border-navy-border px-2.5 text-[17px] hover:bg-sidebar-accent focus:outline-none sm:h-12 sm:gap-2.5 sm:px-4"
          >
            <Globe className="h-5 w-5" />
            <span className="hidden sm:inline">{current.label}</span>
            <ChevronDown className="hidden h-4 w-4 sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onSelect={() => setLocale(lang.id)}
                lang={lang.id}
                className="justify-between"
              >
                {lang.label}
                {lang.id === locale && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
