import { useCallback, useEffect, useState } from "react";
import { normalizeTask, sampleTasks, type AcademicTask } from "@/lib/tasks";

const STORAGE_KEY = "beacon.academic-tasks.v1";

/** Reads the saved tasks once (e.g. for search) without subscribing to changes. */
export function loadStoredTasks(): AcademicTask[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AcademicTask[]) : sampleTasks;
  } catch {
    return sampleTasks;
  }
}

/** Tasks are kept in this browser only (no account/database yet). */
export function useTasks() {
  const [tasks, setTasks] = useState<AcademicTask[]>(sampleTasks);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTasks(loadStoredTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const upsert = useCallback((task: AcademicTask) => {
    const next = normalizeTask(task);
    setTasks((prev) =>
      prev.some((t) => t.id === next.id) ? prev.map((t) => (t.id === next.id ? next : t)) : [next, ...prev],
    );
  }, []);

  const update = useCallback((id: string, patch: Partial<AcademicTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? normalizeTask({ ...t, ...patch }) : t)));
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loaded, upsert, update, remove };
}
