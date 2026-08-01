"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStorageUrl } from "@/lib/storage";
import { uploadHeroImage, removeHeroImage } from "@/app/actions/content";
import { ErrorMessage, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { ImageCropper } from "@/components/ui/ImageCropper";

// Соотношение сторон и выходной размер должны совпадать с тем, как баннер
// показывается на главной (aspect-[4/5] в app/(site)/page.tsx).
const HERO_ASPECT = 4 / 5;
const HERO_OUTPUT_WIDTH = 1000;
const HERO_OUTPUT_HEIGHT = 1250;

export function HomeHeroEditor({ heroImagePath }: { heroImagePath: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

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
    const croppedFile = new File([blob], "hero.jpg", { type: "image/jpeg" });
    const result = await uploadHeroImage(croppedFile);
    setUploading(false);
    setPendingFile(null);

    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  async function handleRemove() {
    setRemoving(true);
    const result = await removeHeroImage();
    setRemoving(false);
    setConfirmRemove(false);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <p className="text-sm font-medium text-ink-soft mb-1">Картинка баннера</p>
        <p className="text-xs text-ink-soft/60">
          Показывается на главной странице справа от заголовка. Подойдёт любое фото JPG/PNG —
          после выбора файла вы сможете обрезать нужную область. Если не загружена — вместо неё
          показывается фото последнего опубликованного товара.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {heroImagePath && (
        <div className="corner-marks relative aspect-[4/5] max-w-xs overflow-hidden bg-bone-dim">
          <Image src={getStorageUrl(heroImagePath)} alt="" fill className="object-cover" />
        </div>
      )}

      <label
        className={`flex items-center justify-center gap-2 rounded-sm border border-dashed px-4 py-6 text-sm text-ink-soft transition-colors ${
          uploading ? "border-line opacity-50 cursor-not-allowed" : "border-line hover:border-brass cursor-pointer"
        }`}
      >
        {uploading ? (
          <>
            <Spinner /> Загружаем…
          </>
        ) : (
          <span>{heroImagePath ? "Заменить картинку" : "Загрузить картинку"}</span>
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

      {heroImagePath && (
        <Button type="button" variant="ghost" onClick={() => setConfirmRemove(true)} className="w-fit">
          Убрать картинку
        </Button>
      )}

      {pendingFile && (
        <ImageCropper
          file={pendingFile}
          aspectRatio={HERO_ASPECT}
          outputWidth={HERO_OUTPUT_WIDTH}
          outputHeight={HERO_OUTPUT_HEIGHT}
          title="Обрежьте картинку баннера"
          onCancel={() => setPendingFile(null)}
          onCropped={handleCropped}
        />
      )}

      <ConfirmDialog
        open={confirmRemove}
        title="Убрать картинку баннера?"
        message="Баннер снова начнёт показывать фото последнего опубликованного товара."
        confirmLabel="Убрать"
        danger
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}
