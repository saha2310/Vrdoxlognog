"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/Feedback";
import { updateSiteContent } from "@/app/actions/content";
import type { SiteContentKey } from "@/lib/types";

const FIELD_LABELS: Record<string, string> = {
  companyName: "Название компании",
  heroTitle: "Заголовок баннера",
  heroSubtitle: "Подзаголовок баннера",
  heroButtonText: "Текст кнопки",
  heroButtonLink: "Ссылка кнопки",
  productsOnHome: "Товаров на главной",
  phone: "Телефон",
  whatsapp: "WhatsApp (номер)",
  telegram: "Telegram (юзернейм)",
  email: "Email",
  address: "Адрес",
  workingHours: "Часы работы",
  mapUrl: "Ссылка на карту (embed)",
  content: "Текст",
};

const LONG_TEXT_FIELDS = new Set(["content", "heroSubtitle", "address"]);

function label(key: string) {
  return FIELD_LABELS[key] ?? key;
}

interface ContentEditorProps {
  contentKey: SiteContentKey;
  initialData: Record<string, unknown>;
}

export function ContentEditor({ contentKey, initialData }: ContentEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = Object.keys(initialData);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateSiteContent(contentKey, values);
    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  if (fields.length === 0) {
    return (
      <p className="text-ink-soft text-sm">
        Для этого раздела пока не заданы редактируемые поля.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="rounded-sm border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss-deep">
          Сохранено
        </div>
      )}

      {fields.map((key) => {
        const value = values[key];

        if (typeof value === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setField(key, e.target.checked)}
                className="h-4 w-4 accent-brass"
              />
              {label(key)}
            </label>
          );
        }

        if (typeof value === "number") {
          return (
            <Input
              key={key}
              id={key}
              type="number"
              label={label(key)}
              value={value}
              onChange={(e) => setField(key, Number(e.target.value))}
            />
          );
        }

        if (LONG_TEXT_FIELDS.has(key)) {
          return (
            <TextArea
              key={key}
              id={key}
              label={label(key)}
              value={String(value ?? "")}
              onChange={(e) => setField(key, e.target.value)}
              rows={key === "content" ? 10 : 3}
            />
          );
        }

        return (
          <Input
            key={key}
            id={key}
            label={label(key)}
            value={String(value ?? "")}
            onChange={(e) => setField(key, e.target.value)}
          />
        );
      })}

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Сохраняем…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
