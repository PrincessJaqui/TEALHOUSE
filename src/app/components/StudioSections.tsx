import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../App';
import { productPath } from '../config/taxonomy';
import { formatPrice } from '../config/store';
import { getPrimaryProductImage } from '../lib/default-image';
import { CroppedMedia, parseRatio } from './CroppedMedia';

/**
 * The landing page, built from Studio content.
 *
 * Every section returns null when it has nothing to show, so a half-filled
 * studio produces a shorter page rather than a broken one.
 */

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/**
 * Hero shapes.
 *
 * A viewport-height hero fills the screen on a laptop and swallows the page,
 * so the shape is chosen in the Studio instead. Desktop and mobile pick
 * separately, because a 16:9 frame on a phone is a letterbox.
 */
export const HERO_RATIOS_DESKTOP: Array<{ label: string; value: string }> = [
  { label: 'Letterbox 32:9, shortest', value: '32 / 9' },
  { label: 'Panorama 3.2:1', value: '16 / 5' },
  { label: 'Panoramic 13:4', value: '13 / 4' },
  { label: 'Ultrawide 24:9', value: '24 / 9' },
  { label: 'Cinematic 21:9', value: '21 / 9' },
  { label: 'Widescreen 16:9', value: '16 / 9' },
  { label: 'Classic 3:2', value: '3 / 2' },
  { label: 'Square-ish 4:3, tallest', value: '4 / 3' },
  { label: 'Full height', value: 'full' },
];

/**
 * How wide the wording block is on a laptop.
 *
 * A fixed width was one guess too many, so this is hers to set. Each is a
 * fixed size rather than a percentage, so the block does not narrow as the
 * window does.
 */
export const HERO_TEXT_WIDTHS: Array<{ label: string; value: string }> = [
  { label: 'Narrow', value: 'narrow' },
  { label: 'Medium', value: 'medium' },
  { label: 'Wide', value: 'wide' },
  { label: 'Half the frame', value: 'half' },
];

const WIDTH_CLASS: Record<string, string> = {
  narrow: 'md:w-[30rem]',
  medium: 'md:w-[40rem]',
  wide: 'md:w-[52rem]',
  half: 'md:w-1/2',
};

/**
 * Where the hero copy sits.
 *
 * The subject of a photograph moves, so the text has to move with it. On a
 * phone the block always spans the width, because a third of a phone is a
 * column of single words.
 */
export const HERO_TEXT_POSITIONS: Array<{ label: string; value: string }> = [
  { label: 'Left', value: 'left' },
  { label: 'Centre', value: 'center' },
  { label: 'Right', value: 'right' },
];

export const HERO_RATIOS_MOBILE: Array<{ label: string; value: string }> = [
  { label: 'Wide 16:9, shortest', value: '16 / 9' },
  { label: 'Landscape 4:3', value: '4 / 3' },
  { label: 'Square 4:4', value: '1 / 1' },
  { label: 'Portrait 4:5', value: '4 / 5' },
  { label: 'Tall 3:4', value: '3 / 4' },
  { label: 'Full portrait 9:16, tallest', value: '9 / 16' },
  { label: 'Full height', value: 'full' },
];

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


  if (!video && !image) return null;

  const ratio = isMobile
    ? content.ratio_mobile || '4 / 5'
    : content.ratio_desktop || '16 / 9';

  const fullHeight = ratio === 'full';

  // A third of the width, so the copy sits beside the subject rather than
  // running across it. Full width on a phone, where a third is unreadable.
  const textPosition = content.text_position || 'left';

  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      <div
        className={`relative w-full ${
          fullHeight ? 'h-[70vh] md:h-[85vh]' : ''
        }`}
        style={fullHeight ? undefined : { aspectRatio: ratio }}
      >
        {video ? (
          <CroppedMedia
            key={video}
            src={video}
            isVideo
            ratio={fullHeight ? '16 / 9' : ratio}
            value={{ focal: videoFocal, zoom: videoZoom }}
          />
        ) : (
          <CroppedMedia
            key={image}
            src={image}
            isVideo={false}
            ratio={fullHeight ? '16 / 9' : ratio}
            value={{ focal: imageFocal, zoom: imageZoom }}
            alt={content.headline || ''}
          />
        )}

        {(content.headline || content.subheadline || content.link_label) && (
          <div
            // A third of a full-width screen, then HELD at that size rather than
            // shrinking with the window. A percentage width made the copy narrow
            // continuously as the browser narrowed, so it read as getting smaller.
            // max-w keeps it inside the padding on a small laptop.
            // pb is larger than the rest so a third line of copy can never
            // sit against the bottom edge of the frame.
            className={`absolute bottom-0 px-8 pt-8 pb-12 md:px-14 md:pt-14 md:pb-16 text-white w-1/2 ${
              WIDTH_CLASS[content.text_width] ?? WIDTH_CLASS.medium
            } md:max-w-[calc(100%-7rem)] ${
              textPosition === 'right'
                ? 'right-0 md:text-right'
                : textPosition === 'center'
                  ? 'left-1/2 md:-translate-x-1/2 md:text-center'
                  : 'left-0'
            }`}
          >
            {content.headline && (
              <p className="text-lg md:text-2xl mb-2 drop-shadow">
                {content.headline}
              </p>
            )}
            {content.subheadline && (
              <p className="text-sm md:text-base mb-4 opacity-90 drop-shadow">
                {content.subheadline}
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
          <CroppedMedia
            src={panel.image_desktop || panel.image_mobile}
            isVideo={false}
            ratio="4 / 5"
            value={{
              focal: panel.focal_desktop || '50% 50%',
              zoom: Number(panel.zoom_desktop ?? 1),
            }}
            alt={panel.label || ''}
          />

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

  // Height decides the size of a card; its width follows from the shape. On
  // a phone the card stays a percentage of the screen, since a fixed height
  // there would push cards wider than the viewport.
  const cardHeight = content.card_height || '25rem';
  const cardShape = content.card_shape || '4 / 5';

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
              className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-auto"
            >
              <div
                className="bg-gray-100 overflow-hidden mb-3 md:h-[var(--card-h)] md:w-auto"
                style={
                  {
                    aspectRatio: cardShape,
                    ['--card-h' as any]: cardHeight,
                  } as React.CSSProperties
                }
              >
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

/**
 * How much of the spotlight row the image takes, and what shape it holds.
 *
 * The image used to stretch to whatever height the product column happened
 * to be, which cropped it unpredictably. It now keeps a shape of its own and
 * the product column takes whatever is left.
 */
/**
 * Card height for the featured carousel.
 *
 * Height rather than width, so a card's proportions come from the chosen
 * shape and taller cards simply show the pieces larger.
 */
export const CAROUSEL_CARD_HEIGHTS: Array<{ label: string; value: string }> = [
  { label: 'Short, 320px', value: '20rem' },
  { label: 'Medium, 400px', value: '25rem' },
  { label: 'Tall, 480px', value: '30rem' },
  { label: 'Very tall, 560px', value: '35rem' },
  { label: 'Grand, 640px', value: '40rem' },
];

export const SPOTLIGHT_IMAGE_HEIGHTS: Array<{ label: string; value: string }> = [
  { label: 'Short, 384px', value: '24rem' },
  { label: 'Medium, 480px', value: '30rem' },
  { label: 'Tall, 576px', value: '36rem' },
  { label: 'Very tall, 672px', value: '42rem' },
  { label: 'Full, 768px', value: '48rem' },
  { label: 'Grand, 896px', value: '56rem' },
  { label: 'Monumental, 1024px', value: '64rem' },
];

/**
 * How large each card in the featured strip is.
 *
 * A square card is short, which leaves a lot of white above and below a
 * portrait product shot. Taller shapes give the pieces more presence.
 */
export const CAROUSEL_CARD_SHAPES: Array<{ label: string; value: string }> = [
  { label: 'Square', value: '1 / 1' },
  { label: 'Slightly tall, 4:5', value: '4 / 5' },
  { label: 'Tall, 3:4', value: '3 / 4' },
  { label: 'Very tall, 2:3', value: '2 / 3' },
];

export const SPOTLIGHT_IMAGE_RATIOS: Array<{ label: string; value: string }> = [
  // The photograph's own proportions, uncropped. Default, because a real
  // photograph is rarely exactly 4:5 or 2:3 and forcing it into one cuts
  // something out of the frame.
  { label: 'The image\u2019s own shape', value: 'original' },
  { label: 'Portrait 4:5', value: '4 / 5' },
  { label: 'Tall 3:4', value: '3 / 4' },
  { label: 'Very tall 2:3', value: '2 / 3' },
  { label: 'Square 1:1', value: '1 / 1' },
  { label: 'Landscape 4:3', value: '4 / 3' },
];

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

  // Below this the image stacks above the product and spans the width, so a
  // fixed height would crop it for no reason.
  //
  // Declared here with the other hooks and above every early return: React
  // requires the same hooks in the same order on every render, and a hook
  // after a conditional return crashes the page the moment that condition
  // changes.
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  const sideImage = content.image_desktop;
  // 'original' means no crop at all: the photograph sets its own height.
  const imageRatio = content.image_ratio || 'original';
  const keepsOwnShape = imageRatio === 'original';

  // The photograph's own proportions, measured once it loads, so the height
  // cap below can be worked out from its real shape rather than a guess.
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  // The height is what stays constant. A portrait photograph is therefore
  // narrow and a square one is wide, which is how it should be: the shape of
  // the picture decides its width, not an arbitrary fraction of the page.
  const imageHeight = content.image_height || '36rem';

  /**
   * Height, capped so the image can never be wider than half the row.
   *
   * At full width the chosen height applies unchanged. Once the window is
   * narrow enough that the image would crowd the product beside it, the cap
   * takes over and the two shrink together rather than one squeezing the
   * other.
   *
   * width = height x ratio, and we want width <= half the row, so
   * height <= row / (2 x ratio).
   */
  const effectiveRatio = keepsOwnShape
    ? (naturalRatio ?? 0.75)
    : parseRatio(imageRatio);

  const cappedHeight = `min(${imageHeight}, calc(100vw / ${(
    2 * effectiveRatio
  ).toFixed(4)}))`;

  return (
    <section
      className="bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* The image runs to the edge of the screen; the product side keeps the
          content padding. */}
      <div className={sideImage ? 'md:flex md:items-center' : ''}>
        {sideImage &&
          (keepsOwnShape ? (
            // Nothing cropped. A fixed height with an automatic width means
            // the photograph's own proportions decide how much room it takes:
            // a portrait is narrow, a square is wide.
            <img
              src={sideImage}
              alt={content.heading || ''}
              className="w-full md:w-auto md:shrink-0 block"
              style={narrow ? undefined : { height: cappedHeight, width: 'auto' }}
              onLoad={(e) => {
                const el = e.currentTarget;
                if (el.naturalWidth && el.naturalHeight) {
                  setNaturalRatio(el.naturalWidth / el.naturalHeight);
                }
              }}
            />
          ) : (
            <div
              className="relative w-full md:w-auto md:shrink-0 overflow-hidden"
              style={
                narrow
                  ? { aspectRatio: imageRatio }
                  : { height: cappedHeight, aspectRatio: imageRatio }
              }
            >
              <CroppedMedia
                src={sideImage}
                isVideo={false}
                ratio={imageRatio}
                value={{
                  focal: content.image_focal_desktop || '50% 50%',
                  zoom: Number(content.image_zoom_desktop ?? 1),
                }}
                alt={content.heading || ''}
              />
            </div>
          ))}

        {/* Takes whatever width is left, so it widens as the image narrows. */}
        <div
          className="flex-1 flex items-center justify-center py-12 px-5 min-w-0"
          style={narrow ? undefined : { height: cappedHeight }}
        >
          <div className="w-full max-w-[560px] text-center">
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

              <Link to={productPath(product)} className="block px-10">
                {/* Bounded by the section height as well as the column width,
                    so a narrow window shrinks the shot instead of pushing it
                    out of the section. */}
                <div
                  className="aspect-square mx-auto mb-6 w-full"
                  style={
                    narrow
                      ? undefined
                      : { maxHeight: `calc(${imageHeight} - 14rem)`, maxWidth: `calc(${imageHeight} - 14rem)` }
                  }
                >
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
        </div>
      </div>
    </section>
  );
}
