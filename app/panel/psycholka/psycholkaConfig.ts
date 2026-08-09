import type { PsycholkaBehavior, PsycholkaContext } from "./psycholkaTypes";

export const PSYCHOLKA_DEBUG = false;

export const psycholkaConfig: Record<PsycholkaContext, PsycholkaBehavior> = {
  welcome: { context: "welcome", mood: "happy", action: "wave", allowedActions: ["idle", "wave"], position: "inline", size: "medium", priority: 2, interactive: true },
  dashboard: { context: "dashboard", mood: "calm", action: "coffee", allowedActions: ["wave", "coffee", "read", "search"], position: "inline", size: "medium", priority: 2, interactive: true },
  today: { context: "today", mood: "calm", action: "idle", allowedActions: ["idle", "read", "sad", "happy"], position: "inline", size: "small", priority: 3, interactive: false },
  before_visit: { context: "before_visit", mood: "focused", action: "idle", allowedActions: ["idle", "read"], position: "inline", size: "small", priority: 3, interactive: false },
  session: { context: "session", mood: "focused", action: "idle", allowedActions: ["idle", "sit"], position: "bottom-right", size: "small", priority: 5, interactive: false },
  after_visit: { context: "after_visit", mood: "celebrate", action: "wave", allowedActions: ["idle", "wave"], position: "inline", size: "small", priority: 3, interactive: false },
  day_closing: { context: "day_closing", mood: "sleepy", action: "coffee", allowedActions: ["idle", "coffee"], position: "inline", size: "small", priority: 3, interactive: false },
  success: { context: "success", mood: "celebrate", action: "celebrate", allowedActions: ["celebrate", "wave"], position: "inline", size: "medium", priority: 2, interactive: true },
  empty_state: { context: "empty_state", mood: "calm", action: "look_around", allowedActions: ["look_around", "walk"], position: "inline", size: "small", priority: 1, interactive: false },
  review: { context: "review", mood: "thinking", action: "point", allowedActions: ["idle", "point"], position: "inline", size: "small", priority: 3, interactive: false },
  homework: { context: "homework", mood: "focused", action: "walk", allowedActions: ["idle", "walk"], position: "inline", size: "small", priority: 1, interactive: false },
};

export function getPsycholkaBehavior(context: PsycholkaContext): PsycholkaBehavior {
  return psycholkaConfig[context];
}
