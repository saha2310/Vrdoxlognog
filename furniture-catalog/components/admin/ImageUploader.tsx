"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/app/actions/images";
import { resizeImageFile } from "@/lib/image-client";
import { ErrorMessage } from "@/components/ui/Feedback";
import { Spinner } from "@/components/ui/Feedback";

const MAX_IMAGES = 10;

export function ImageUploader({ productId, currentCount }: { productId: string; currentCount: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_IMAGES - currentCount;
  const disabled = remaining <= 0 || uploading;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const toUpload = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setError(`Можно загрузить ещё максимум ${remaining} фото. Лишние файлы не будут загружены.`);
    }

    setUploading(true);
    for (const file of toUpload) {
      const resized = await resizeImageFile(file);
      const result = await uploadProductImage(productId, resized);
      if (!result.success) {
        setError(result.error.message);
        break;
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-6 py-8 text-sm text-ink-soft transition-colors ${
          disabled ? "border-line opacity-50 cursor-not-allowed" : "border-line hover:border-brass cursor-pointer"
        }`}
      >
        {uploading ? (
          <>
            <Spinner /> Загружаем…
          </>
        ) : (
          <>
            <span>Перетащите фото сюда или нажмите, чтобы выбрать</span>
            <span className="text-xs text-ink-soft/60">
              Осталось {Math.max(remaining, 0)} из {MAX_IMAGES}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
