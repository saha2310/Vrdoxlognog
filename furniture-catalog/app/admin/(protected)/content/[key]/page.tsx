import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/queries";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { HomeHeroEditor } from "@/components/admin/HomeHeroEditor";
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

  // "home" пока не содержит текстовых полей (заголовок/подзаголовок/кнопка редактируются
  // в "Настройках" и используются на главной) — здесь только картинка баннера,
  // поэтому у неё отдельный редактор вместо универсального ContentEditor.
  if (contentKey === "home") {
    const data = await getSiteContent<{ heroImagePath?: string }>("home");
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl md:text-3xl text-ink">{TITLES.home}</h1>
        <p className="text-sm text-ink-soft max-w-xl -mt-2">
          Текст баннера (заголовок, подзаголовок, кнопка) редактируется в разделе «Настройки».
        </p>
        <HomeHeroEditor heroImagePath={data.heroImagePath ?? null} />
      </div>
    );
  }

  const data = await getSiteContent(contentKey);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl md:text-3xl text-ink">{TITLES[contentKey]}</h1>
      <ContentEditor contentKey={contentKey} initialData={data} />
    </div>
  );
}
