import { getSiteContent } from "@/lib/queries";
import type { AboutContent } from "@/lib/types";

export const metadata = {
  title: "О нас — Мебельная мастерская",
};

export default async function AboutPage() {
  const about = await getSiteContent<AboutContent>("about");

  return (
    <div className="container-page py-12 md:py-16 max-w-2xl">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">О нас</h1>
      {about.content ? (
        <p className="text-ink-soft leading-relaxed whitespace-pre-line">{about.content}</p>
      ) : (
        <p className="text-ink-soft/60">Информация появится в ближайшее время.</p>
      )}
    </div>
  );
}
