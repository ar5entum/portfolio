import { Hero } from "@/components/home/Hero";
import { Skills } from "@/components/home/Skills";
import { Path } from "@/components/home/Path";
import { Research } from "@/components/home/Research";
import { OpenSource } from "@/components/home/OpenSource";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <Path />
      <Research />
      <OpenSource />
      <Contact />
    </main>
  );
}
