import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/queries";
import { ContentEditor } from "@/components/admin/ContentEditor";
import type { SiteContentKey } from "@/lib/types";

const VALID_KEYS: SiteContentKey[] = ["home", "about", "contacts", "settings"];

const TITLES: Record<SiteContentKey, string> = {
  home: "Главная страница",
  about: "О нас",
  contacts: "Контакты",
  settings: "Настройки сайта",
};

interface ContentPageProps {
  params: Promise<{ key: string }>;
}

export default async function AdminContentPage({ params }: ContentPageProps) {
  const { key } = await params;

  if (!VALID_KEYS.includes(key as SiteContentKey)) {
    notFound();
  }

  const contentKey = key as SiteContentKey;
  const data = await getSiteContent(contentKey);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl md:text-3xl text-ink">{TITLES[contentKey]}</h1>
      <ContentEditor contentKey={contentKey} initialData={data} />
    </div>
  );
}
