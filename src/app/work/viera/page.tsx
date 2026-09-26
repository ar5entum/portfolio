import type { Metadata } from "next";
import { Viera } from "@/components/work/Viera";

export const metadata: Metadata = {
  title: "Codename: Viera",
  description:
    "A system that never watches the video scores 65.8%. Asking video models directly about seven low-level properties, half the field can't beat a blind constant answer.",
  openGraph: {
    title: "Codename: Viera — ar5entum",
    description: "A system that never watches the video scores 65.8%.",
  },
};

export default function Page() {
  return <Viera />;
}
