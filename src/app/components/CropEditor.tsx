import { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import {
  CroppedMedia,
  parseFocal,
  parseRatio,
  panRange,
  type CropValue,
} from './CroppedMedia';

/**
 * Crop editor.
 *
 * The frame is the real shape this media appears in, so what sits inside
 * these edges is exactly what a visitor sees. Drag to move it, zoom to crop
 * tighter. Nothing is re-encoded: the result is a position and a zoom stored
 * against the section, so a crop can be changed later without re-uploading.
 */

export type { CropValue };
export { parseFocal };

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const clamp = (value: number) => Math.min(100, Math.max(0, value));

interface CropEditorProps {
  src: string;
  isVideo: boolean;
  /** CSS aspect-ratio for the frame, matching where this media will appear. */
  ratio: string;
  value: CropValue;
  onChange: (value: CropValue) => void;
}

export function CropEditor({ src, isVideo, ratio, value, onChange }: CropEditorProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [natural, setNatural] = useState<number | null>(null);
  const start = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);

  const zoom = value.zoom && value.zoom > 1 ? value.zoom : 1;
  const [fx, fy] = parseFocal(value.focal);

  const frameRatio = parseRatio(ratio);
  const range = panRange(natural ?? frameRatio, frameRatio, zoom);
  const canMoveX = range.x > 0;
  const canMoveY = range.y > 0;

  // Latest values in a ref, so the drag handler never reads a stale one and
  // nothing is subscribed or unsubscribed mid-drag.
  const latest = useRef({ value, zoom, onChange, canMoveX, canMoveY });
  latest.current = { value, zoom, onChange, canMoveX, canMoveY };

  const setZoom = (next: number) =>
    onChange({ ...value, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)) });

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY, fx, fy };
    setDragging(true);
  };

  const onDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const from = start.current;
    const box = frame.current?.getBoundingClientRect();
    if (!from || !box) return;

    const now = latest.current;

    // Dragging the width of the frame sweeps the whole range, divided by
    // zoom so a tighter crop does not fly around.
    const dx = ((event.clientX - from.x) / box.width) * 100;
    const dy = ((event.clientY - from.y) / box.height) * 100;

    now.onChange({
      ...now.value,
      focal: `${clamp(now.canMoveX ? from.fx - dx / now.zoom : from.fx)}% ${clamp(
        now.canMoveY ? from.fy - dy / now.zoom : from.fy
      )}%`,
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    start.current = null;
    setDragging(false);
  };

  const hint = canMoveX && canMoveY
    ? 'Drag to frame'
    : canMoveY
      ? 'Zoom in to move sideways'
      : canMoveX
        ? 'Zoom in to move up and down'
        : 'Zoom in to reframe';

  const previewRatio = ratio === 'full' ? 16 / 9 : frameRatio;
  // Height first, width derived, so the frame stays the true shape while
  // never taking over the form.
  const maxPreviewHeight = 20;

  return (
    <div>
      <div
        style={{ maxWidth: `${maxPreviewHeight * previewRatio}rem` }}
      >
      <div
        ref={frame}
        onPointerDown={beginDrag}
        onPointerMove={(e) => dragging && onDragMove(e)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`relative w-full overflow-hidden bg-neutral-100 border border-neutral-200 touch-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ aspectRatio: ratio === 'full' ? '16 / 9' : ratio }}
      >
        <CroppedMedia
          src={src}
          isVideo={isVideo}
          ratio={ratio === 'full' ? '16 / 9' : ratio}
          value={{ focal: value.focal, zoom }}
          className="pointer-events-none select-none"
          onNatural={setNatural}
        />

        {/* Thirds, only while dragging, so the frame stays clean. */}
        {dragging && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
          </div>
        )}

        {!dragging && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-1 pointer-events-none">
            <Move className="w-3 h-3" />
            <span className="text-[11px] uppercase tracking-wider">{hint}</span>
          </div>
        )}
      </div>

      </div>

      <div
        className="flex items-center gap-3 mt-3"
        style={{ maxWidth: `${maxPreviewHeight * previewRatio}rem` }}
      >
        <button
          type="button"
          onClick={() => setZoom(zoom - 0.1)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className="p-1.5 border border-neutral-200 hover:border-black transition-colors disabled:opacity-40"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <input
          type="range"
          min={MIN_ZOOM * 100}
          max={MAX_ZOOM * 100}
          value={Math.round(zoom * 100)}
          onChange={(e) => setZoom(Number(e.target.value) / 100)}
          className="flex-1"
          aria-label="Zoom"
        />

        <button
          type="button"
          onClick={() => setZoom(zoom + 0.1)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="p-1.5 border border-neutral-200 hover:border-black transition-colors disabled:opacity-40"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <span className="text-xs text-neutral-500 w-10 text-right">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => onChange({ focal: '50% 50%', zoom: 1 })}
          aria-label="Reset framing"
          className="p-1.5 border border-neutral-200 hover:border-black transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
