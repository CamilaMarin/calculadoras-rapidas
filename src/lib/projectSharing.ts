import type { ProjectBudgetState } from "./types";

export function encodeProjectBudget(state: ProjectBudgetState): string {
  return btoa(JSON.stringify(state))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function decodeProjectBudget(value: string): Partial<ProjectBudgetState> | null {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const parsed: unknown = JSON.parse(atob(normalized + padding));

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Partial<ProjectBudgetState>;
  } catch {
    return null;
  }
}
