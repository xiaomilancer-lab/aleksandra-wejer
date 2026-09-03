import { redirect } from "next/navigation";

// Public account creation is intentionally paused. Existing accounts and the
// psychologist panel remain available through their direct sign-in routes.
export default function RegisterPage() {
  redirect("/");
}
