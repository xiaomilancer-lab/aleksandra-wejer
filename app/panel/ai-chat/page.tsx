import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PsychologyAiChat from "../components/ai-chat/PsychologyAiChat";

export default function AiChatPage() {
  return <AuthGuard><Dashboard><PsychologyAiChat /></Dashboard></AuthGuard>;
}
