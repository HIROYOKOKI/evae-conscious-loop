import { redirect } from "next/navigation";

// The old standalone implementation had a different trace format.
export default function LegacyDemoPage() {
  redirect("/playground");
}
