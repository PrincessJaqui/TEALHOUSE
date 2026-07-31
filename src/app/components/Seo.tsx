import { useEffect } from 'react';

/**
 * Page head management.
 *
 * The site had none. Every route served the same title and description, so a
 * product page and the privacy policy looked identical to Google and to
 * anyone sharing a link.
 *
 * An honest limitation worth knowing: this runs in the browser. Google
 * executes JavaScript and will see everything here, including the JSON-LD.
 * Social scrapers mostly do not. Facebook, iMessage and Slack read the raw
 * HTML, so they will show the site-wide Open Graph tags from index.html
 * rather than the per-product ones set here. Fixing that properly needs
 * prerendering, which is a separate job.
 */

const SITE_NAME = 'TEALHOUSE';
const SITE_URL = 'https://www.tealhouse.us';

export interface SeoProps {
  title: string;
  description?: string;
  /** Path only, for example /products/footwear/lexi */
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  /** A JSON-LD object. Rendered into a script tag for search engines. */
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  jsonLd,
  noIndex,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    upsertLink('canonical', url);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);

    if (image) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
      upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    }

    // The site-wide noindex in index.html stays until launch. This only lets
    // an individual page opt out on top of that, for example the admin.
    if (noIndex) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    }
  }, [title, description, path, image, type, noIndex]);

  useEffect(() => {
    if (!jsonLd) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    script.setAttribute('data-seo', 'true');
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
}

/**
 * Product structured data. This is what makes Google show a price and an
 * availability badge directly in search results, which for a shop is the
 * highest-return SEO item there is.
 */
export function productJsonLd(params: {
  name: string;
  description?: string;
  images: string[];
  price: number;
  inStock: boolean;
  url: string;
  sku?: string;
  material?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    description: params.description,
    image: params.images,
    ...(params.sku ? { sku: params.sku } : {}),
    ...(params.material ? { material: params.material } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}${params.url}`,
      priceCurrency: 'USD',
      price: params.price.toFixed(2),
      availability: params.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}

export { SITE_NAME, SITE_URL };
