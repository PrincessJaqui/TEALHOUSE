import { useState, useEffect, useRef } from 'react';
import { Product } from '../App';
import { getPrimaryProductImage } from '../lib/default-image';

/**
 * The product image on a collection card.
 *
 * On a desktop, hovering cycles through the product's other photographs so a
 * customer sees more than one angle without clicking. On a phone there is no
 * hover, so a thumb swipe moves through them instead.
 *
 * Its own component because each card holds its own index; one shared index
 * in the grid would page every card at once.
 */

interface ProductCardImageProps {
  product: Product;
  soldOut: boolean;
  onClick: () => void;
}

const CYCLE_MS = 1400;

export function ProductCardImage({ product, soldOut, onClick }: ProductCardImageProps) {
  const gallery = (product.images ?? []).filter(Boolean);
  const images = gallery.length > 0 ? gallery : [getPrimaryProductImage(product)];
  const hasMany = images.length > 1;

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!hovering || !hasMany) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [hovering, hasMany, images.length]);

  const step = (delta: number) =>
    setIndex((current) => (current + delta + images.length) % images.length);

  return (
    <div
      className="relative aspect-[2/3] bg-gray-100 mb-3 overflow-hidden cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        // Back to the primary shot, so the grid does not end up a patchwork
        // of whichever frame each card happened to stop on.
        setIndex(0);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || !hasMany) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        // Far enough to be a swipe rather than a tap that drifted.
        if (Math.abs(delta) > 40) {
          step(delta < 0 ? 1 : -1);
        }
        touchStartX.current = null;
      }}
    >
      {images.map((image, i) => (
        <img
          key={image + i}
          src={image}
          alt={i === 0 ? product.image_alt || product.name : ''}
          aria-hidden={i !== index}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0'
          } ${soldOut ? 'opacity-60' : ''}`}
        />
      ))}

      {hasMany && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((image, i) => (
            <span
              key={image + i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? 'bg-black' : 'bg-white/80 border border-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
