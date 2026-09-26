import type { Metadata } from "next";
import { ResumeView } from "./ResumeView";

// Intentionally unchanged from the previous site: same PDF, same embed, not
// linked from the home page. It only exists so the old URL keeps working.
export const metadata: Metadata = {
  title: "Resume",
  robots: { index: false, follow: false },
};

export default function ResumePage() {
  return <ResumeView />;
}
