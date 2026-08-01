"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ImageCropperProps {
  file: File;
  aspectRatio: number; // width / height
  outputWidth: number;
  outputHeight: number;
  title?: string;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}

const VIEWPORT_WIDTH = 320;

export function ImageCropper({
  file,
  aspectRatio,
  outputWidth,
  outputHeight,
  title = "Обрежьте картинку",
  onCancel,
  onCropped,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUrl);
  }, [imgUrl]);
  const [ready, setReady] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1); // множитель поверх baseScale, 1..3
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);

  const viewportW = VIEWPORT_WIDTH;
  const viewportH = Math.round(VIEWPORT_WIDTH / aspectRatio);

  const dragState = useRef<{ startX: number; startY: number; startPos: { x: number; y: number } } | null>(
    null
  );

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.max(viewportW / nw, viewportH / nh);
    setNaturalSize({ width: nw, height: nh });
    setBaseScale(scale);
    setZoom(1);
    // Центрируем изображение при загрузке
    const displayedW = nw * scale;
    const displayedH = nh * scale;
    setPos({ x: (viewportW - displayedW) / 2, y: (viewportH - displayedH) / 2 });
    setReady(true);
  }

  function currentScale() {
    return baseScale * zoom;
  }

  function clamp(x: number, y: number, scale: number) {
    const displayedW = naturalSize.width * scale;
    const displayedH = naturalSize.height * scale;
    const minX = Math.min(0, viewportW - displayedW);
    const minY = Math.min(0, viewportH - displayedH);
    return {
      x: Math.max(minX, Math.min(0, x)),
      y: Math.max(minY, Math.min(0, y)),
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startPos: pos };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = clamp(dragState.current.startPos.x + dx, dragState.current.startPos.y + dy, currentScale());
    setPos(next);
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(newZoom: number) {
    const oldScale = currentScale();
    const newScale = baseScale * newZoom;
    // Зум "от центра" видимой области, чтобы не улетало в сторону
    const cx = (viewportW / 2 - pos.x) / oldScale;
    const cy = (viewportH / 2 - pos.y) / oldScale;
    const nextX = viewportW / 2 - cx * newScale;
    const nextY = viewportH / 2 - cy * newScale;
    setZoom(newZoom);
    setPos(clamp(nextX, nextY, newScale));
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const next = Math.min(3, Math.max(1, zoom + delta));
    handleZoomChange(next);
  }

  async function handleConfirm() {
    if (!imgRef.current) return;
    setProcessing(true);

    const ratio = outputWidth / viewportW;
    const scale = currentScale();
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setProcessing(false);
      return;
    }

    ctx.drawImage(
      imgRef.current,
      0,
      0,
      naturalSize.width,
      naturalSize.height,
      pos.x * ratio,
      pos.y * ratio,
      naturalSize.width * scale * ratio,
      naturalSize.height * scale * ratio
    );

    canvas.toBlob(
      (blob) => {
        setProcessing(false);
        if (blob) onCropped(blob);
      },
      "image/jpeg",
      0.88
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-sm border border-line bg-bone p-6 flex flex-col gap-4">
        <h2 className="font-display text-lg text-ink">{title}</h2>
        <p className="text-xs text-ink-soft/70">
          Перетащите картинку, чтобы выбрать нужную область, и настройте масштаб ползунком.
        </p>

        <div
          className="relative mx-auto overflow-hidden bg-bone-dim touch-none select-none cursor-move"
          style={{ width: viewportW, height: viewportH }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {imgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imgUrl}
              alt=""
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: naturalSize.width * currentScale(),
                height: naturalSize.height * currentScale(),
                maxWidth: "none",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-soft/60">−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
            className="w-full accent-brass"
          />
          <span className="text-xs text-ink-soft/60">+</span>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={processing}>
            Отмена
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!ready || processing}>
            {processing ? "Обрабатываем…" : "Обрезать и загрузить"}
          </Button>
        </div>
      </div>
    </div>
  );
}
