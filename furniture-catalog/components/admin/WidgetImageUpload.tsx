"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStorageUrl } from "@/lib/storage";
import { uploadWidgetImage } from "@/app/actions/widgets";
import { ErrorMessage, Spinner } from "@/components/ui/Feedback";

export function WidgetImageUpload({
  widgetId,
  currentPath,
}: {
  widgetId: string;
  currentPath: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await uploadWidgetImage(widgetId, file);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      {currentPath && (
        <div className="relative aspect-video overflow-hidden rounded-sm bg-bone-dim">
          <Image src={getStorageUrl(currentPath)} alt="" fill className="object-cover" />
        </div>
      )}

      <label
        className={`flex items-center justify-center gap-2 rounded-sm border border-dashed px-4 py-4 text-sm text-ink-soft transition-colors ${
          uploading ? "border-line opacity-50 cursor-not-allowed" : "border-line hover:border-brass cursor-pointer"
        }`}
      >
        {uploading ? (
          <>
            <Spinner /> Загружаем…
          </>
        ) : (
          <span>{currentPath ? "Заменить картинку" : "Загрузить картинку"}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
        />
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
