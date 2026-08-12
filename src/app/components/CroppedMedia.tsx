import { useState } from 'react';

/**
 * Media cropped to a frame, pannable in both directions.
 *
 * The earlier version used object-position with a CSS scale. That could
 * never work: object-position moves an image inside a box that is always
 * exactly the frame, and scaling only magnifies the already-cropped result.
 * Whichever axis the photograph filled exactly had zero range, and zoom did
 * not create any.
 *
 * Here the media is sized past the frame instead, so it genuinely overflows
 * and can be moved. Zoom makes it larger still, which is what unlocks the
 * second axis.
 *
 * The editor and the storefront both render through this, so what is framed
 * in the admin is exactly what a visitor sees.
 */

export interface CropValue {
  /** "42% 65%". 50/50 is centred. */
  focal: string;
  /** 1 means no zoom. */
  zoom: number;
}

export function parseFocal(focal: string | undefined): [number, number] {
  const [x, y] = (focal ?? '50% 50%').split(' ').map((part) => {
    const value = parseFloat(part);
    return Number.isFinite(value) ? value : 50;
  });
  return [x ?? 50, y ?? 50];
}

export function parseRatio(ratio: string | undefined): number {
  const text = (ratio ?? '16 / 9').trim();

  // A bare number is already a ratio. Without this it has no slash, falls
  // through to the default, and a portrait gets shown in a widescreen frame.
  if (!text.includes('/')) {
    const value = parseFloat(text);
    return Number.isFinite(value) && value > 0 ? value : 16 / 9;
  }

  const [w, h] = text.split('/').map((part) => parseFloat(part));
  return w && h ? w / h : 16 / 9;
}

/**
 * How far the media can move, as a percentage of its own size.
 *
 * Zero means that axis is locked: the media does not overflow there yet.
 */
export function panRange(
  natural: number,
  frameRatio: number,
  zoom: number
): { x: number; y: number; elW: number; elH: number } {
  // Cover: the media is grown until it fills both directions.
  const elW = Math.max(1, natural / frameRatio) * zoom;
  const elH = Math.max(1, frameRatio / natural) * zoom;

  return {
    // Half the overflow, expressed against the media's own width.
    x: elW > 1.001 ? (50 * (elW - 1)) / elW : 0,
    y: elH > 1.001 ? (50 * (elH - 1)) / elH : 0,
    elW,
    elH,
  };
}

interface CroppedMediaProps {
  src: string;
  isVideo: boolean;
  ratio: string;
  value: CropValue;
  className?: string;
  alt?: string;
  onNatural?: (natural: number) => void;
}

export function CroppedMedia({
  src,
  isVideo,
  ratio,
  value,
  className,
  alt,
  onNatural,
}: CroppedMediaProps) {
  const [natural, setNatural] = useState<number | null>(null);

  const frameRatio = parseRatio(ratio);
  const [fx, fy] = parseFocal(value.focal);
  const zoom = value.zoom && value.zoom > 1 ? value.zoom : 1;

  // Until the media has loaded, cover the frame plainly rather than guessing.
  const measured = natural ?? frameRatio;
  const { x: maxX, y: maxY, elW, elH } = panRange(measured, frameRatio, zoom);

  // 50 is centred; 0 shows the leading edge, 100 the trailing one.
  const tx = ((50 - fx) / 50) * maxX;
  const ty = ((50 - fy) / 50) * maxY;

  const style = {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    width: `${elW * 100}%`,
    height: `${elH * 100}%`,
    objectFit: 'cover' as const,
    transform: `translate(-50%, -50%) translate(${tx}%, ${ty}%)`,
    maxWidth: 'none',
  };

  const handleNatural = (value: number) => {
    setNatural(value);
    onNatural?.(value);
  };

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (el.videoWidth && el.videoHeight) {
            handleNatural(el.videoWidth / el.videoHeight);
          }
        }}
        muted
        loop
        autoPlay
        playsInline
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      draggable={false}
      className={className}
      style={style}
      onLoad={(e) => {
        const el = e.currentTarget;
        if (el.naturalWidth && el.naturalHeight) {
          handleNatural(el.naturalWidth / el.naturalHeight);
        }
      }}
    />
  );
}
