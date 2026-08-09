import PsycholkaWidget from "./PsychOLKAWidget";
import { resolvePsycholkaMood } from "../psycholka/psycholkaEmotion";

export default function PsycholkaTodaySlot({ isFirstVisit = false, hasVisits = true }: { isFirstVisit?: boolean; hasVisits?: boolean }) {
  const action = hasVisits ? "happy" : "sad";
  return <div className="mb-4"><PsycholkaWidget context="today" mood={resolvePsycholkaMood("today", { isFirstVisit, hasVisits })} action={action} fallbackAction={hasVisits ? "wave" : "idle"} /></div>;
}
