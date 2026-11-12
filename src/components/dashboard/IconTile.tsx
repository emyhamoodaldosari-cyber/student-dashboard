import type { LucideIcon } from "lucide-react";

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
      <Icon className="h-7 w-7" strokeWidth={2} />
    </span>
  );
}
