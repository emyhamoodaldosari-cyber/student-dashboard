import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  Languages,
  PanelLeftClose,
  Plus,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import emptyArt from "@/assets/search-empty.png";
import { navItems } from "@/lib/dashboard-data";
import { translate, useI18n } from "@/lib/i18n";
import { courseName, taskText, type AcademicTask } from "@/lib/tasks";
import { loadStoredTasks } from "@/components/tasks/useTasks";
import { useModKey } from "@/hooks/use-mod-key";
import { cn } from "@/lib/utils";

type Group = "pages" | "tasks" | "actions";
type Result = { id: string; group: Group; label: string; hint?: string; icon: LucideIcon; run: () => void };

const groupKey = { pages: "search.groupPages", tasks: "search.groupTasks", actions: "search.groupActions" } as const;

/** Every word of the query must appear in one of the item's texts (English or Arabic). */
function matches(query: string, texts: (string | null | undefined)[]): boolean {
  const hay = texts.filter(Boolean).join(" ").toLocaleLowerCase();
  return query
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export function SearchDialog({
  open,
  onOpenChange,
  onToggleSidebar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleSidebar: () => void;
}) {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const modKey = useModKey();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTasks(loadStoredTasks());
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const close = () => onOpenChange(false);
    const out: Result[] = [];

    for (const item of navItems) {
      if (!item.to) continue;
      if (!matches(q, [translate("en", item.key), translate("ar", item.key)])) continue;
      const to = item.to;
      out.push({
        id: `page-${item.key}`,
        group: "pages",
        label: t(item.key),
        hint: t("search.page"),
        icon: item.icon,
        run: () => {
          close();
          void navigate({ to });
        },
      });
    }

    for (const task of tasks) {
      const en = taskText(task, "en");
      const ar = taskText(task, "ar");
      const course = task.course;
      if (!matches(q, [en.title, ar.title, course, course && courseName(course, "ar")])) continue;
      out.push({
        id: `task-${task.id}`,
        group: "tasks",
        label: taskText(task, locale).title,
        hint: course ? courseName(course, locale) : t("tasks.noCourse"),
        icon: FileText,
        run: () => {
          close();
          void navigate({ to: "/academic-tasks", search: { task: task.id } });
        },
      });
    }

    const actions: { key: "search.actionNew" | "search.actionLang" | "search.actionCollapse"; icon: LucideIcon; run: () => void; extra: string[] }[] = [
      {
        key: "search.actionNew",
        icon: Plus,
        extra: ["task", "new", "مهمة", "جديدة"],
        run: () => void navigate({ to: "/academic-tasks", search: { action: "new" } }),
      },
      {
        key: "search.actionLang",
        icon: Languages,
        extra: ["language", "arabic", "english", "اللغة", "العربية", "الإنجليزية"],
        run: () => setLocale(locale === "ar" ? "en" : "ar"),
      },
      {
        key: "search.actionCollapse",
        icon: PanelLeftClose,
        extra: ["sidebar", "menu", "القائمة"],
        run: onToggleSidebar,
      },
    ];
    for (const a of actions) {
      if (!matches(q, [translate("en", a.key), translate("ar", a.key), ...a.extra])) continue;
      out.push({
        id: `action-${a.key}`,
        group: "actions",
        label: t(a.key),
        icon: a.icon,
        run: () => {
          close();
          a.run();
        },
      });
    }
    return out;
  }, [query, tasks, locale, t, navigate, onOpenChange, setLocale, onToggleSidebar]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  const q = query.trim();
  let lastGroup: Group | null = null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[760px] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 focus:outline-none sm:top-[8vh] sm:max-h-[84vh]"
        >
          {/* Header */}
          <div className="relative bg-search-header px-5 pb-6 pt-6 text-navy-foreground sm:px-8 sm:pt-7">
            <div className="flex items-start gap-4 pe-12">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-foreground/10 ring-1 ring-navy-foreground/15 sm:flex">
                <Search className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-2xl font-bold tracking-tight sm:text-[28px]">
                  {t("search.title")}
                </DialogPrimitive.Title>
                <p className="mt-1 text-[15px] text-navy-foreground/80 sm:text-[17px]">{t("search.subtitle")}</p>
              </div>
            </div>
            <DialogPrimitive.Close
              aria-label={t("search.close")}
              className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-navy-foreground/10 text-navy-foreground transition-colors hover:bg-navy-foreground/20 sm:end-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            <label className="mt-5 flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4 text-foreground shadow-pill focus-within:ring-2 focus-within:ring-primary-glow sm:px-5">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("search.placeholder")}
                aria-label={t("search.placeholder")}
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `search-${results[active].id}` : undefined}
                className="min-w-0 flex-1 bg-transparent text-[17px] placeholder:text-muted-foreground focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("form.close")}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd dir="ltr" className="hidden shrink-0 rounded-lg border border-border bg-muted px-2 py-0.5 font-sans text-sm text-muted-foreground sm:inline">
                  {modKey} K
                </kbd>
              )}
            </label>
          </div>

          {/* Body */}
          <div ref={listRef} id="search-results" role="listbox" className="min-h-[260px] flex-1 overflow-y-auto px-3 py-3 sm:px-5">
            {!q || results.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 scale-110 rounded-full bg-search-glow" />
                  <img
                    src={emptyArt}
                    alt=""
                    width={768}
                    height={576}
                    loading="lazy"
                    className="relative h-[150px] w-auto sm:h-[180px]"
                  />
                </div>
                <p className="mt-3 text-xl font-bold sm:text-2xl">
                  {q ? t("search.noneTitle", { q }) : t("search.startTitle")}
                </p>
                <p className="mt-1.5 max-w-sm text-[16px] text-muted-foreground">
                  {q ? t("search.noneText") : t("search.startText")}
                </p>
              </div>
            ) : (
              results.map((r, i) => {
                const header = r.group !== lastGroup ? t(groupKey[r.group]) : null;
                lastGroup = r.group;
                const Icon = r.icon;
                return (
                  <div key={r.id}>
                    {header && (
                      <p className="px-3 pb-1.5 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground first:pt-1">
                        {header}
                      </p>
                    )}
                    <button
                      type="button"
                      id={`search-${r.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={r.run}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-colors",
                        i === active ? "bg-primary-soft" : "hover:bg-muted",
                      )}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-card">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] font-semibold">{r.label}</span>
                        {r.hint && <span className="block truncate text-sm text-muted-foreground">{r.hint}</span>}
                      </span>
                      {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-primary rtl:-scale-x-100" />}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer hints (keyboard only — hidden on touch-size screens) */}
          <div className="hidden items-center justify-center gap-5 border-t border-border bg-muted/60 px-6 py-3.5 text-sm text-muted-foreground sm:flex">
            <span className="flex items-center gap-2">
              <Kbd><ArrowUp className="h-3.5 w-3.5" /></Kbd>
              <Kbd><ArrowDown className="h-3.5 w-3.5" /></Kbd>
              {t("search.navigate")}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Kbd>Enter</Kbd>
              {t("search.toSearch")}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              {t("search.toClose")}
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd dir="ltr" className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-border bg-card px-1.5 font-sans text-xs font-semibold text-foreground shadow-card">
      {children}
    </kbd>
  );
}
