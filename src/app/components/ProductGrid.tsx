import { useState } from 'react';
import { Heart, ChevronDown } from 'lucide-react';
import { Product } from '../App';
import {
  productMatchesFilter,
  isSoldOut,
  allProductSizes,
  type FilterKey,
} from '../config/taxonomy';
import { useCatalogLists } from '../hooks/useCatalogLists';
import { ProductCardImage } from './ProductCardImage';
import { getPrimaryProductImage } from '../lib/default-image';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  /**
   * Base category or audience for this page, for example "womens" or
   * "cactus-leather". Seven pages were already passing this prop but the
   * component never declared or used it, so Shoes, Mens, Womens, New
   * Arrivals, Best Sellers, Cactus Leather and Teal Sole all rendered the
   * identical unfiltered catalog. Matched against both the categories and
   * audience arrays, so the values you seed into the products table need to
   * line up with the strings the pages pass.
   */
  filter?: string;
  /**
   * Render nothing at all when nothing matches, rather than an empty grid.
   * Used on the landing page, where an empty product section with a filter
   * control above it would read as broken.
   */
  hideWhenEmpty?: boolean;
  /** The landing page is a shop window, not a search tool. */
  showFilters?: boolean;
}

export function ProductGrid({
  onProductClick,
  onAddToWishlist,
  isInWishlist,
  filter,
  hideWhenEmpty,
  showFilters = true,
}: ProductGridProps) {
  const { products, loading } = useSupabaseProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [styles, setStyles] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  // 'featured' means the order she arranged in the admin. It is the
  // default because a merchandised order beats an alphabetical one.
  const [sortBy, setSortBy] = useState('featured');

  const toggle = (
    set: (next: string[]) => void,
    current: string[],
    value: string
  ) => {
    set(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };
  
  // Swatch colours come from the colours table, so a hex set once is used
  // everywhere. Which swatches a card shows comes from that product.
  const { colors: colorRows } = useCatalogLists();

  const hexFor = (name: string) =>
    colorRows.find((row) => row.name.toLowerCase() === name.toLowerCase())?.hex ?? null;

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  // The page-level filter narrows the catalog first, then the in-panel
  // category buttons narrow it further. Both go through the shared matcher
  // in config/taxonomy so the admin's tags and these pages cannot drift.
  const baseProducts =
    !filter || filter === 'all'
      ? products
      : products.filter((p) => productMatchesFilter(p, filter as FilterKey));

  // Options are drawn from what is actually on this page, so a filter can
  // never offer something that would return nothing.
  const uniq = (values: string[]) =>
    Array.from(new Set(values.filter(Boolean)));

  const availableStyles = uniq(baseProducts.flatMap((p) => p.categories ?? [])).sort();
  const availableColors = uniq(baseProducts.flatMap((p) => p.colors ?? []));
  const availableSizes = uniq(baseProducts.flatMap((p) => allProductSizes(p)));

  const activeFilterCount = styles.length + colors.length + sizes.length;

  const matchesAll = (product: Product) => {
    if (styles.length && !styles.some((s) => (product.categories ?? []).includes(s))) {
      return false;
    }
    if (colors.length && !colors.some((c) => (product.colors ?? []).includes(c))) {
      return false;
    }
    if (sizes.length) {
      const productSizes = allProductSizes(product);
      if (!sizes.some((s) => productSizes.includes(s))) return false;
    }
    return true;
  };

  const sorters: Record<string, (a: Product, b: Product) => number> = {
    // The order set by dragging in the admin. Products arrive from the
    // database already in it, with name as the tie-breaker for anything
    // never placed.
    featured: (a, b) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
    name: (a, b) => a.name.localeCompare(b.name),
    'price-asc': (a, b) => Number(a.price) - Number(b.price),
    'price-desc': (a, b) => Number(b.price) - Number(a.price),
    newest: (a, b) =>
      String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')),
  };

  const filteredProducts = baseProducts
    .filter(matchesAll)
    .sort(sorters[sortBy] ?? sorters.featured);

  // Nothing to show and the caller asked for silence. The landing page uses
  // this so an empty featured section disappears instead of leaving a filter
  // control hanging over blank space.
  if (hideWhenEmpty && !loading && filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1200px] mx-auto px-5 pt-2 pb-8" id="shoes">
      {/* Filter and sort. Options come from the products actually on this
          page, so a Resort Wear page never offers a shoe size and an empty
          category never appears. */}
      {showFilters && (
      <>
      {/* Sort on the left, Filter on the right, both plain type with a
          chevron. The select keeps its native behaviour and accessibility;
          only the border and arrow are stripped so it reads as text. */}
      <div className="flex justify-between items-center mb-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <span className="uppercase tracking-wider">Sort</span>
          <span className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent border-0 pr-6 py-1 text-sm cursor-pointer focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="name">A to Z</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none" />
          </span>
        </label>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="uppercase tracking-wider text-sm hover:text-gray-600 transition-colors flex items-center gap-2"
        >
          Filter
          {activeFilterCount > 0 && (
            <span className="text-[#008080]">({activeFilterCount})</span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isFilterOpen && (
        <div className="border border-gray-200 p-6 mb-8 space-y-6">
          {availableStyles.length > 1 && (
            <div>
              <h4 className="uppercase tracking-wider text-sm mb-3">Style</h4>
              <div className="flex flex-wrap gap-2">
                {availableStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggle(setStyles, styles, style)}
                    className={`px-4 py-2 text-sm border capitalize transition-colors ${
                      styles.includes(style)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {style.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div>
              <h4 className="uppercase tracking-wider text-sm mb-3">Colour</h4>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const hex = colorRows.find(
                    (row) => row.name.toLowerCase() === color.toLowerCase()
                  )?.hex;
                  const active = colors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => toggle(setColors, colors, color)}
                      title={color}
                      aria-label={color}
                      aria-pressed={active}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        active
                          ? 'border-black ring-2 ring-black ring-offset-2'
                          : 'border-gray-300 hover:border-black'
                      }`}
                      style={hex ? { backgroundColor: hex } : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div>
              <h4 className="uppercase tracking-wider text-sm mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggle(setSizes, sizes, size)}
                    className={`min-w-[3rem] px-3 py-2 text-sm border transition-colors ${
                      sizes.includes(size)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setStyles([]);
                setColors([]);
                setSizes([]);
              }}
              className="text-sm underline hover:no-underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
      </>
      )}

      {/* Two different situations. Filters that exclude everything is the
          customer's own doing; an empty collection is ours, and reads better
          as an intention than as an absence. */}
      {!loading && filteredProducts.length === 0 && (
        activeFilterCount > 0 ? (
          <p className="text-sm text-gray-600 py-8">
            Nothing matches those filters.
          </p>
        ) : (
          <p className="py-16 text-center uppercase tracking-wider text-gray-500">
            Debuting Soon
          </p>
        )
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group"
          >
            <div className="relative">
              <ProductCardImage
                product={product}
                soldOut={isSoldOut(product)}
                onClick={() => onProductClick(product)}
              />

              {isSoldOut(product) && (
                <span className="absolute top-4 left-4 z-10 bg-white/95 px-3 py-1 text-xs uppercase tracking-wider">
                  Sold Out
                </span>
              )}

              {/* Wishlist Heart Button */}
              <button
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all z-10"
                onClick={(e) => handleWishlistClick(e, product)}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
 isInWishlist(product.id) ? 'fill-teal-600 stroke-teal-600' : 'stroke-gray-700'
                  }`}
                />
              </button>
              
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-center">Quick View</p>
              </div>
            </div>
            <h4 className="font-['Tinos'] mb-1">{product.name}</h4>
            <p className="text-[#666666] mb-2">${product.price.toLocaleString()}</p>
            {/* This product's own colours. Not buttons: the colour is chosen
                on the product page, so a fake control here would mislead. */}
            {(product.colors ?? []).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {(product.colors ?? []).map((color) => {
                  const hex = hexFor(color);
                  return hex ? (
                    <span
                      key={color}
                      title={color}
                      aria-label={color}
                      className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                      style={{ backgroundColor: hex }}
                    />
                  ) : (
                    <span key={color} className="text-xs text-[#666666]">
                      {color}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}