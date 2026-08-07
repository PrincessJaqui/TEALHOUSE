import { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

/**
 * Crop editor.
 *
 * Two abstract percentage sliders were a poor way to frame a photograph, so
 * this is direct manipulation instead: drag the image inside the frame to
 * choose what shows, and zoom to choose how tight.
 *
 * The frame is the real shape the media will appear in, so what is inside
 * these edges is exactly what a visitor sees. Nothing is re-encoded; the
 * result is a position and a zoom stored against the section, which means
 * the crop can be changed later without re-uploading.
 */

export interface CropValue {
  /** CSS object-position, for example "42% 65%". */
  focal: string;
  /** 1 means no zoom. */
  zoom: number;
}

interface CropEditorProps {
  src: string;
  isVideo: boolean;
  /** CSS aspect-ratio for the frame, matching where this media will appear. */
  ratio: string;
  value: CropValue;
  onChange: (value: CropValue) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function parseFocal(focal: string | undefined): [number, number] {
  const [x, y] = (focal ?? '50% 50%')
    .split(' ')
    .map((part) => {
      const value = parseFloat(part);
      return Number.isFinite(value) ? value : 50;
    });
  return [x ?? 50, y ?? 50];
}

/** The same styles the storefront uses, so the frame here cannot lie. */
export function cropStyle(focal: string | undefined, zoom: number | undefined) {
  const scale = zoom && zoom > 1 ? zoom : 1;
  return {
    objectPosition: focal || '50% 50%',
    transform: scale > 1 ? `scale(${scale})` : undefined,
  } as const;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function CropEditor({ src, isVideo, ratio, value, onChange }: CropEditorProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);

  const [fx, fy] = parseFocal(value.focal);
  const zoom = value.zoom && value.zoom > 1 ? value.zoom : 1;

  // The media's own shape, read once it loads.
  const [natural, setNatural] = useState<number | null>(null);

  /**
   * How much room there is to move, per axis.
   *
   * object-position can only shift media that overflows its frame. A photo
   * cropped to cover a wide hero overflows vertically and not at all
   * horizontally, so at 100% dragging sideways does nothing. Rather than
   * feeling broken, the editor says so and the zoom creates the room.
   */
  const frameRatio = (() => {
    const [w, h] = ratio.split('/').map((part) => parseFloat(part));
    return w && h ? w / h : 16 / 9;
  })();

  const room = (() => {
    if (!natural) return { x: true, y: true };
    const widthDriven = frameRatio > natural;
    const overflowX = (widthDriven ? 1 : natural / frameRatio) * zoom - 1;
    const overflowY = (widthDriven ? frameRatio / natural : 1) * zoom - 1;
    return { x: overflowX > 0.01, y: overflowY > 0.01 };
  })();

  const setZoom = (next: number) =>
    onChange({ ...value, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)) });

  useEffect(() => {
    if (!dragging) return;

    const move = (event: PointerEvent) => {
      const box = frame.current?.getBoundingClientRect();
      const from = start.current;
      if (!box || !from) return;

      // Dragging the full width of the frame moves the crop across its whole
      // range. Divided by zoom so a tighter crop does not fly around.
      const dx = ((event.clientX - from.x) / box.width) * 100;
      const dy = ((event.clientY - from.y) / box.height) * 100;

      // Only move on an axis that actually has somewhere to go.
      onChange({
        ...value,
        focal: `${clamp(room.x ? from.fx - dx / zoom : from.fx)}% ${clamp(
          room.y ? from.fy - dy / zoom : from.fy
        )}%`,
      });
    };

    const end = () => setDragging(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [dragging, value, zoom, onChange]);

  const beginDrag = (event: React.PointerEvent) => {
    event.preventDefault();
    start.current = { x: event.clientX, y: event.clientY, fx, fy };
    setDragging(true);
  };

  const media = isVideo ? (
    <video
      src={src}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      style={cropStyle(value.focal, zoom)}
      onLoadedMetadata={(e) => {
        const el = e.currentTarget;
        if (el.videoWidth && el.videoHeight) {
          setNatural(el.videoWidth / el.videoHeight);
        }
      }}
      muted
      loop
      autoPlay
      playsInline
    />
  ) : (
    <img
      src={src}
      alt=""
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      style={cropStyle(value.focal, zoom)}
      onLoad={(e) => {
        const el = e.currentTarget;
        if (el.naturalWidth && el.naturalHeight) {
          setNatural(el.naturalWidth / el.naturalHeight);
        }
      }}
    />
  );

  return (
    <div>
      <div
        ref={frame}
        onPointerDown={beginDrag}
        className={`relative w-full overflow-hidden bg-neutral-100 border border-neutral-200 touch-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ aspectRatio: ratio }}
      >
        {media}

        {/* Thirds, shown only while dragging so the frame stays clean. */}
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
            <span className="text-[11px] uppercase tracking-wider">
              {room.x && room.y
                ? 'Drag to frame'
                : room.y
                  ? 'Drag up and down'
                  : room.x
                    ? 'Drag left and right'
                    : 'Zoom in to reframe'}
            </span>
          </div>
        )}

        {/* Says plainly why an axis will not move, rather than leaving the
            drag feeling broken. */}
        {!dragging && !(room.x && room.y) && (
          <div className="absolute top-2 left-2 right-2 bg-black/70 text-white px-2 py-1 pointer-events-none">
            <span className="text-[11px]">
              {room.y && !room.x
                ? 'This fills the width exactly, so it only moves up and down. Zoom in to move sideways.'
                : room.x && !room.y
                  ? 'This fills the height exactly, so it only moves side to side. Zoom in to move up and down.'
                  : 'This fits the frame exactly. Zoom in to reframe it.'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
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
          aria-label="Zoom"
          className="flex-1"
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
