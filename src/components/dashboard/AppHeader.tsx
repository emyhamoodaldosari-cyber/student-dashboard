import { useState } from "react";
import { Bell, ChevronDown, Globe, Menu, Search } from "lucide-react";
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

const languages = ["English", "العربية"];

export function AppHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [language, setLanguage] = useState(languages[0]);

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center gap-4 border-b border-navy-border bg-navy-deep px-4 text-navy-foreground lg:px-0">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="rounded-lg p-2 text-navy-foreground hover:bg-sidebar-accent lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-3 lg:w-[275px] lg:pl-10">
        <img src={logo.url} alt="Beacon logo" width={44} height={44} className="h-11 w-11" />
        <span className="text-[28px] font-bold tracking-tight">Beacon</span>
      </div>

      <div className="hidden flex-1 justify-center px-4 md:flex">
        <label className="flex h-12 w-full max-w-[578px] items-center gap-3 rounded-full border border-navy-border bg-navy px-5 transition-colors focus-within:border-primary-glow">
          <Search className="h-5 w-5 shrink-0 text-navy-muted" />
          <input
            type="search"
            placeholder="Search Beacon or press ⌘K..."
            className="w-full bg-transparent text-[17px] text-navy-foreground placeholder:text-navy-muted focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded-md border border-navy-border px-2 py-0.5 text-sm text-navy-muted sm:inline">
            ⌘ | K
          </kbd>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-3 lg:pr-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 hover:bg-sidebar-accent"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-notify ring-2 ring-navy-deep" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-12 items-center gap-2.5 rounded-full border border-navy-border pl-1.5 pr-4 text-[17px] hover:bg-sidebar-accent focus:outline-none">
            <img src={avatar.url} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            <span className="hidden sm:inline">{student.name}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="mx-1 hidden h-8 w-px bg-navy-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="hidden h-12 items-center gap-2.5 rounded-full border border-navy-border px-4 text-[17px] hover:bg-sidebar-accent focus:outline-none sm:flex">
            <Globe className="h-5 w-5" />
            {language}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((l) => (
              <DropdownMenuItem key={l} onSelect={() => setLanguage(l)}>
                {l}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
