import { describe, expect, it } from "vitest";
import { filterTasks, normalizeTask, type AcademicTask } from "./tasks";

const now = new Date("2026-09-10T12:00:00");
const base: AcademicTask = {
  id: "x",
  title: "Task",
  description: "",
  type: "Assignment",
  priority: "Medium",
  status: "Not started",
  dueAt: null,
  estimatedMinutes: 30,
  actualMinutes: 0,
  course: null,
  progress: 0,
};

describe("academic task filters", () => {
  it("overdue = past due date and not completed", () => {
    const tasks = [
      { ...base, id: "late", dueAt: "2026-09-09T09:00:00" },
      { ...base, id: "late-done", dueAt: "2026-09-09T09:00:00", status: "Completed" as const },
      { ...base, id: "future", dueAt: "2026-09-12T09:00:00" },
    ];
    expect(filterTasks(tasks, "overdue", now).map((t) => t.id)).toEqual(["late"]);
  });

  it("due soon = due within the next 7 days and not completed", () => {
    const tasks = [
      { ...base, id: "in-6-days", dueAt: "2026-09-16T09:00:00" },
      { ...base, id: "in-8-days", dueAt: "2026-09-18T13:00:00" },
      { ...base, id: "no-date", dueAt: null },
    ];
    expect(filterTasks(tasks, "dueSoon", now).map((t) => t.id)).toEqual(["in-6-days"]);
  });

  it("active actions = tasks in progress", () => {
    const tasks = [
      { ...base, id: "a", status: "In progress" as const },
      { ...base, id: "b" },
    ];
    expect(filterTasks(tasks, "active", now).map((t) => t.id)).toEqual(["a"]);
  });
});

describe("normalizeTask", () => {
  it("completed tasks are always 100%", () => {
    expect(normalizeTask({ ...base, status: "Completed", progress: 30 }).progress).toBe(100);
  });
  it("reaching 100% marks the task completed", () => {
    expect(normalizeTask({ ...base, progress: 100 }).status).toBe("Completed");
  });
});
