"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStorageUrl } from "@/lib/storage";
import { uploadWidgetImage } from "@/app/actions/widgets";
import { ErrorMessage, Spinner } from "@/components/ui/Feedback";
import { ImageCropper } from "@/components/ui/ImageCropper";

// Соотношение сторон и выходной размер должны совпадать с карточкой виджета на главной
// (aspect-[4/3] в components/catalog/CategoryWidgets.tsx).
const WIDGET_ASPECT = 4 / 3;
const WIDGET_OUTPUT_WIDTH = 900;
const WIDGET_OUTPUT_HEIGHT = 675;

export function WidgetImageUpload({
  widgetId,
  currentPath,
}: {
  widgetId: string;
  currentPath: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setPendingFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleCropped(blob: Blob) {
    setUploading(true);
    setError(null);
    const croppedFile = new File([blob], "widget.jpg", { type: "image/jpeg" });
    const result = await uploadWidgetImage(widgetId, croppedFile);
    setUploading(false);
    setPendingFile(null);

    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <p className="text-xs text-ink-soft/60">
        Любой формат JPG/PNG — после выбора файла вы сможете обрезать нужную область.
      </p>

      {currentPath && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-dim">
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
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </label>
      {error && <ErrorMessage message={error} />}

      {pendingFile && (
        <ImageCropper
          file={pendingFile}
          aspectRatio={WIDGET_ASPECT}
          outputWidth={WIDGET_OUTPUT_WIDTH}
          outputHeight={WIDGET_OUTPUT_HEIGHT}
          title="Обрежьте картинку виджета"
          onCancel={() => setPendingFile(null)}
          onCropped={handleCropped}
        />
      )}
    </div>
  );
}
