import PsycholkaWidget from "./PsychOLKAWidget";
import { resolvePsycholkaMood } from "../psycholka/psycholkaEmotion";

export default function PsycholkaSessionSlot() {
  return <PsycholkaWidget context="session" mood={resolvePsycholkaMood("session")} />;
}
