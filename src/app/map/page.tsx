import { redirect } from "next/navigation";

// Map is now integrated into /creators page
// Redirect for backwards compatibility
export default function MapPage() {
  redirect("/creators");
}
