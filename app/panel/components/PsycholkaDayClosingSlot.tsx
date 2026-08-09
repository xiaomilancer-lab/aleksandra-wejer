import PsycholkaWidget from "./PsychOLKAWidget";
import { resolvePsycholkaMood } from "../psycholka/psycholkaEmotion";

export default function PsycholkaDayClosingSlot({ isComplete = false }: { isComplete?: boolean }) {
  return <div className="mt-6"><PsycholkaWidget context="day_closing" mood={resolvePsycholkaMood("day_closing")} action={isComplete ? "coffee" : "idle"} /></div>;
}
