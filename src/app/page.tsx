import { redirect } from "next/navigation";

// Root page — redirects to login
// TODO: Check auth session server-side and redirect to /dashboard if authenticated
export default function RootPage() {
  redirect("/login");
}
