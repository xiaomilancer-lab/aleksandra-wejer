export type PsycholkaContext = "welcome" | "dashboard" | "today" | "before_visit" | "session" | "after_visit" | "day_closing" | "success" | "empty_state" | "review" | "homework";
export type PsycholkaMood = "happy" | "calm" | "focused" | "celebrate" | "thinking" | "sleepy" | "sad";
export type PsycholkaAction = "idle" | "wave" | "coffee" | "read" | "walk" | "run" | "sit" | "point" | "celebrate" | "lost_shoe" | "sleep" | "look_around" | "greeting" | "open_arms" | "point_booking" | "search" | "sad" | "happy" | "meet_aleksandra" | "help_path" | "locations" | "reviews" | "account_whisper" | "booking_choice" | "goodbye";
export type PsycholkaPosition = "inline" | "bottom-right" | "top-right";
export type PsycholkaSize = "small" | "medium" | "large";

export interface PsycholkaBehavior { context: PsycholkaContext; mood: PsycholkaMood; action: PsycholkaAction; allowedActions: PsycholkaAction[]; position: PsycholkaPosition; size: PsycholkaSize; priority: number; interactive: boolean; message?: string; }
export interface PsycholkaAnimationAsset { id: string; action: PsycholkaAction; src: string; format: "webp" | "png" | "webm" | "lottie"; width: number; height: number; loop: boolean; durationMs: number | null; contextAllowlist: PsycholkaContext[]; }
export interface PsycholkaEventHooks { onVisitSaved?: () => void; onVisitCompleted?: () => void; onTaskCompleted?: () => void; onReviewReceived?: () => void; onDayClosed?: () => void; }
