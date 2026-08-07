import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../App';
import { productPath } from '../config/taxonomy';
import { formatPrice } from '../config/store';
import { getPrimaryProductImage } from '../lib/default-image';

/**
 * The landing page, built from Studio content.
 *
 * Every section returns null when it has nothing to show, so a half-filled
 * studio produces a shorter page rather than a broken one.
 */

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function StudioHero({ content }: { content: Record<string, any> }) {
  // A phone should never download a desktop-sized film. Two sources, chosen
  // by viewport, each with a still to hold the space while it loads.
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const video = isMobile ? content.video_mobile : content.video_desktop;
  const image = isMobile ? content.image_mobile : content.image_desktop;

  // How the media is cropped to the hero: position chooses what stays
  // centred, zoom chooses how tight. Set per breakpoint in the Studio, and
  // separately for the film and the still, since a still is often a
  // different photograph. The still falls back to the film's framing.
  const videoFocal =
    (isMobile ? content.focal_mobile : content.focal_desktop) || '50% 50%';
  const videoZoom = Number(
    (isMobile ? content.zoom_mobile : content.zoom_desktop) ?? 1
  );

  const imageFocal =
    (isMobile ? content.image_focal_mobile : content.image_focal_desktop) ||
    videoFocal;
  const imageZoom = Number(
    (isMobile ? content.image_zoom_mobile : content.image_zoom_desktop) ?? 1
  );

  const frame = (focal: string, zoom: number) => ({
    objectPosition: focal,
    transform: zoom > 1 ? `scale(${zoom})` : undefined,
    transformOrigin: focal,
  });

  if (!video && !image) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        {video ? (
          <video
            key={video}
            className="absolute inset-0 w-full h-full object-cover"
            style={frame(videoFocal, videoZoom)}
            src={video}
            poster={image || undefined}
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={image}
            alt={content.headline || ''}
            className="absolute inset-0 w-full h-full object-cover"
            style={frame(imageFocal, imageZoom)}
          />
        )}

        {(content.headline || content.link_label) && (
          <div className="absolute bottom-0 left-0 p-8 md:p-14 text-white">
            {content.headline && (
              <p className="text-lg md:text-2xl mb-4 drop-shadow">
                {content.headline}
              </p>
            )}
            {content.link_label && content.link_href && (
              <Link
                to={content.link_href}
                className="inline-block uppercase tracking-wider text-sm border-b-2 border-white pb-1 hover:opacity-80 transition-opacity drop-shadow"
              >
                {content.link_label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial note                                                      */
/* ------------------------------------------------------------------ */

export function StudioEditorial({ content }: { content: Record<string, any> }) {
  if (!content.heading && !content.body) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-14">
      {content.heading && <h2 className="mb-3">{content.heading}</h2>}
      {content.body && (
        <p className="text-sm text-gray-600 mb-5">{content.body}</p>
      )}
      {content.link_label && content.link_href && (
        <Link
          to={content.link_href}
          className="inline-block uppercase tracking-wider text-sm border-b-2 border-black pb-1 hover:opacity-70 transition-opacity"
        >
          {content.link_label}
        </Link>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Two panels                                                          */
/* ------------------------------------------------------------------ */

export function StudioSplit({ content }: { content: Record<string, any> }) {
  const panels: Array<Record<string, any>> = (content.panels ?? []).filter(
    (panel: Record<string, any>) => panel?.image_desktop || panel?.image_mobile
  );

  if (panels.length === 0) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {panels.map((panel, index) => (
        <div key={index} className="relative aspect-[4/5] overflow-hidden group">
          <picture>
            {panel.image_mobile && (
              <source media="(max-width: 767px)" srcSet={panel.image_mobile} />
            )}
            <img
              src={panel.image_desktop || panel.image_mobile}
              alt={panel.label || ''}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
              style={{
                objectPosition: panel.focal_desktop || '50% 50%',
                transform:
                  Number(panel.zoom_desktop ?? 1) > 1
                    ? `scale(${panel.zoom_desktop})`
                    : undefined,
                transformOrigin: panel.focal_desktop || '50% 50%',
              }}
            />
          </picture>

          {panel.label && panel.href && (
            <Link
              to={panel.href}
              className="absolute bottom-8 left-8 text-white uppercase tracking-wider text-sm border-b-2 border-white pb-1 drop-shadow"
            >
              {panel.label}
            </Link>
          )}
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured carousel                                                   */
/* ------------------------------------------------------------------ */

export function StudioCarousel({
  content,
  products,
}: {
  content: Record<string, any>;
  products: Product[];
}) {
  const strip = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (direction: number) => {
    const el = strip.current;
    if (!el) return;
    // Roughly one card, so a click advances the row rather than nudging it.
    el.scrollBy({ left: direction * (el.clientWidth / 2), behavior: 'smooth' });
  };

  return (
    <section className="py-14">
      {content.heading && (
        <div className="max-w-[1200px] mx-auto px-5 mb-6">
          <h2 className="mb-2">{content.heading}</h2>
          {content.body && (
            <p className="text-sm text-gray-600">{content.body}</p>
          )}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 border border-gray-200 p-2 hover:border-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={strip}
          className="flex gap-4 overflow-x-auto scroll-smooth px-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={productPath(product)}
              className="snap-start shrink-0 w-[70%] sm:w-[45%] lg:w-[24%]"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                <img
                  src={getPrimaryProductImage(product)}
                  alt={product.image_alt || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="text-sm">{product.name}</p>
              <p className="text-sm text-gray-600">
                {formatPrice(Number(product.price))}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 border border-gray-200 p-2 hover:border-black transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured spotlight                                                  */
/* ------------------------------------------------------------------ */

const SPOTLIGHT_MS = 4000;

export function StudioSpotlight({
  content,
  products,
}: {
  content: Record<string, any>;
  products: Product[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || products.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % products.length),
      SPOTLIGHT_MS
    );
    return () => window.clearInterval(timer);
  }, [paused, products.length]);

  if (products.length === 0) return null;

  const product = products[index % products.length];
  const step = (delta: number) =>
    setIndex((current) => (current + delta + products.length) % products.length);

  return (
    <section
      className="bg-gray-50 py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[900px] mx-auto px-5 text-center">
        {content.heading && <h2 className="mb-3">{content.heading}</h2>}
        {content.body && (
          <p className="text-sm text-gray-600 mb-10">{content.body}</p>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-60 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Link to={productPath(product)} className="block">
            <div className="aspect-square max-w-[420px] mx-auto mb-6">
              <img
                key={product.id}
                src={getPrimaryProductImage(product)}
                alt={product.image_alt || product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mb-1">{product.name}</p>
            <p className="text-sm text-gray-600">
              {formatPrice(Number(product.price))}
            </p>
          </Link>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-60 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {products.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.name}`}
                className={`h-0.5 w-8 transition-colors ${
                  i === index % products.length ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
