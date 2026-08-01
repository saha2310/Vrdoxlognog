// Утилиты для обработки изображений на клиенте перед загрузкой.
// Цель: не давать пользователю случайно отправить фото на 10+ МБ с телефона —
// это раньше приводило к "вечной загрузке" (Server Action просто не мог принять такой запрос).

// Сжимает/уменьшает изображение без кадрирования (сохраняет пропорции).
// Используется там, где не нужен интерактивный кроп (например, галерея товара).
export async function resizeImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<File> {
  const bitmap = await loadImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

export async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file);
  }
  // Запасной вариант для старых браузеров без createImageBitmap
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    return img as unknown as ImageBitmap;
  } finally {
    URL.revokeObjectURL(url);
  }
}
