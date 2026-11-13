import { useEffect, useState } from "react";

/** "⌘" on Apple devices, "Ctrl" elsewhere — resolved after hydration to avoid a mismatch. */
export function useModKey(): string {
  const [key, setKey] = useState("Ctrl");
  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) setKey("⌘");
  }, []);
  return key;
}
