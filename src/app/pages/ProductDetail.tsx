import { useState, useEffect } from 'react';
import { SHIPPING, RETURNS, formatPrice } from '../config/store';
import {
  stockForSize,
  isSoldOut,
  totalStock,
  productPath,
  slugify,
  hasSizeGroups,
  groupStock,
  availableGroupSizes,
  isGroupedSoldOut,
  stockFor,
  availableSizesFor,
  isPartRequired,
  priceForSelection,
  partOptions,
  partComponents,
  joinComponents,
} from '../config/taxonomy';
import {
  isBespoke,
  isMadeToMeasure,
  MADE_TO_MEASURE_COPY,
  isPreOrder,
  tracksStock,
  unitChargeFor,
  formatShipEstimate,
  BESPOKE_COPY,
  PREORDER_COPY,
} from '../config/fulfillment';
import { Seo, productJsonLd } from '../components/Seo';
import { useCatalogLists } from '../hooks/useCatalogLists';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Product } from '../App';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { toast } from 'sonner';

interface ProductDetailProps {
  onAddToCart: (
    product: Product,
    size?: string,
    sizes?: Record<string, string>,
    notes?: string,
    color?: string,
    measurements?: Record<string, string>
  ) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function ProductDetail({ onAddToCart, onAddToWishlist, isInWishlist }: ProductDetailProps) {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const { products, loading } = useSupabaseProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  // Multi-part products, for example { Top: "S", Bottom: "M" }
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  // A bespoke piece is specified in words, not picked off a shelf.
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  // Optional parts the customer has chosen to include. A bikini top can be
  // bought without its bottom when the part is not required.
  const [includedParts, setIncludedParts] = useState<string[]>([]);
  // Made to measure. These are the customer's own figures, not sizes we
  // stock, so nothing here touches inventory.
  // Compound scales are chosen piece by piece, for example a bra band and
  // cup, before being combined into the single value the order carries.
  const [componentChoices, setComponentChoices] = useState<
    Record<string, Record<string, string>>
  >({});

  // Scales come from the database, so a made to measure part can offer a
  // bra chart, an inch measurement, or alpha sizes without a deploy.
  const catalog = useCatalogLists();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;

    // Look up by slug. The id path is kept only so old links still resolve,
    // and it redirects to the canonical URL below.
    const found = slug
      ? products.find(
          (p) => p.slug === slug || slugify(p.name) === slug
        )
      : id
        ? products.find((p) => p.id === parseInt(id))
        : undefined;

    if (!found) return;

    setProduct(found);

    const firstColor = (found.colors ?? [])[0];
    setSelectedColor(firstColor);

    if (hasSizeGroups(found)) {
      // Required parts are always included. Optional ones start included
      // too, so the default is the full set.
      setIncludedParts((found.size_groups ?? []).map((g) => g.label));
      // Preselect the first size in each part that still has stock, so the
      // customer is not staring at an empty picker.
      const initial: Record<string, string> = {};
      for (const group of found.size_groups ?? []) {
        const first = availableSizesFor(found, group, firstColor)[0];
        if (first) initial[group.label] = first;
      }
      setSelectedSizes(initial);
      setSelectedSize(undefined);
    } else if (found.sizes && found.sizes.length > 0) {
      setSelectedSize(String(found.sizes[0]));
      setSelectedSizes({});
    }

    // One product, one URL. Anything reaching this page by id, or by the
    // wrong category segment, is moved to the canonical path so search
    // engines do not see duplicates.
    const canonical = productPath(found);
    if (window.location.pathname !== canonical) {
      navigate(canonical, { replace: true });
    }
  }, [products, slug, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    // Made to measure: the piece and its price are known, but it is cut to
    // the customer, so every measurement asked for must be given.
    if (isMadeToMeasure(product)) {
      const groups = product.size_groups ?? [];
      if (groups.length === 0) {
        toast.error('This piece is not ready to order yet');
        return;
      }

      const chosen: Record<string, string> = {};
      for (const group of groups) {
        const value = selectedSizes[group.label];
        if (!value) {
          toast.error(`Please choose your ${group.label.toLowerCase()}`);
          return;
        }
        chosen[group.label] = value;
      }

      onAddToCart(product, undefined, chosen, undefined, selectedColor);
      toast.success('Added to bag');
      return;
    }

    // A bespoke piece has nothing to check against stock, and the retainer
    // is what gets charged. What matters is that we know what they want.
    if (isBespoke(product)) {
      if (!notes.trim()) {
        toast.error('Please tell us what you have in mind');
        return;
      }
      onAddToCart(product, undefined, undefined, notes.trim(), selectedColor);
      toast.success('Added to bag');
      return;
    }

    if (hasSizeGroups(product)) {
      // Every part needs a choice, and each is checked against its own
      // stock, because stock is held per piece.
      const parts = (product.size_groups ?? []).filter((group) =>
        includedParts.includes(group.label)
      );

      if (parts.length === 0) {
        toast.error('Please choose at least one piece');
        return;
      }

      const chosenSizes: Record<string, string> = {};

      for (const group of parts) {
        const chosen = selectedSizes[group.label];
        if (!chosen) {
          toast.error(`Please choose a ${group.label.toLowerCase()} size`);
          return;
        }
        if (
          stockFor(product, {
            color: selectedColor,
            group: group.label,
            size: chosen,
          }) <= 0
        ) {
          toast.error(`${group.label} ${chosen} is sold out`);
          return;
        }
        chosenSizes[group.label] = chosen;
      }

      onAddToCart(product, undefined, chosenSizes, undefined, selectedColor);
      toast.success('Added to bag');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (
      tracksStock(product) &&
      stockFor(product, { color: selectedColor, size: selectedSize }) <= 0
    ) {
      toast.error('That size is sold out');
      return;
    }

    onAddToCart(product, selectedSize, undefined, undefined, selectedColor);
    toast.success('Added to bag');
  };

  const handleAddToWishlist = () => {
    if (!inWishlist) {
      onAddToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const seoImages = (product.images ?? []).filter(Boolean);
  const primaryImage = seoImages[0] || product.image || '';
  const canonicalPath = productPath(product);

  return (
    <div className="min-h-screen bg-white pt-20">
      <Seo
        title={product.meta_title || product.name}
        description={
          product.meta_description ||
          (product.description || '').slice(0, 160)
        }
        path={canonicalPath}
        image={primaryImage}
        type="product"
        jsonLd={productJsonLd({
          name: product.name,
          description: product.description,
          images: seoImages.length ? seoImages : [primaryImage].filter(Boolean),
          price: Number(product.price),
          inStock: totalStock(product) > 0,
          url: canonicalPath,
          material: (product.materials ?? [])[0],
        })}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-gray-100 overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-[#008080]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {product.video && (
              <div className="mt-4 aspect-video bg-gray-100 overflow-hidden">
                <video
                  src={product.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl mb-4">{product.name}</h1>
            {isBespoke(product) ? (
              <div className="mb-6">
                <p className="text-3xl">
                  {formatPrice(unitChargeFor(product))}
                  <span className="text-sm text-gray-600 ml-2 align-middle">retainer</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Credited toward your final price, which we confirm once your
                  specifications are agreed.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-3xl">{formatPrice(Number(product.price))}</p>
                {isPreOrder(product) && formatShipEstimate(product.preorder_ships_on) && (
                  <p className="text-sm text-gray-600 mt-2">
                    Estimated to ship {formatShipEstimate(product.preorder_ships_on)}.{' '}
                    {PREORDER_COPY.disclaimer}
                  </p>
                )}
              </div>
            )}

            {(isBespoke(product) || isPreOrder(product) || isMadeToMeasure(product)) && (
              <p className="inline-block mb-6 px-3 py-1 border border-[#008080] text-[#008080] text-xs uppercase tracking-wider">
                {isBespoke(product)
                  ? 'Made to order'
                  : isMadeToMeasure(product)
                    ? 'Made to measure'
                    : 'Pre-order'}
              </p>
            )}

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {/* Colour. Each carries its own stock, so switching colour
                changes which sizes are still available. */}
            {(product.colors ?? []).length > 0 && (
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Colour{selectedColor ? `: ${selectedColor}` : ''}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(product.colors ?? []).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm transition-all ${
                        selectedColor === color
                          ? 'border-[#008080] bg-[#008080] text-white'
                          : 'border-gray-300 hover:border-[#008080]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Made to measure uses the parts container, so each part
                carries whichever scale suits it. A bra part offers band and
                cup dropdowns, a waist part offers inches, a hip part offers
                alpha sizes. Nothing here touches stock. */}
            {isMadeToMeasure(product) && (
              <div className="mb-6">
                <label className="block font-medium mb-2">Your measurements</label>
                <p className="text-sm text-gray-600 mb-4">
                  {MADE_TO_MEASURE_COPY.intro}
                </p>

                {(product.size_groups ?? []).length === 0 ? (
                  <p className="text-sm text-gray-600">
                    {MADE_TO_MEASURE_COPY.noParts}
                  </p>
                ) : (
                  <div className="space-y-5">
                    {(product.size_groups ?? []).map((group) => {
                      const components = partComponents(group, catalog.scales);
                      const options = partOptions(group, catalog.scales, true);

                      // A compound scale, bra being the one that matters,
                      // needs a dropdown per component that combine into a
                      // single value like 34D.
                      if (components) {
                        const current = componentChoices[group.label] ?? {};
                        return (
                          <div key={group.label}>
                            <label className="block text-sm mb-2">{group.label}</label>
                            <div className="flex gap-3">
                              {components.map((component) => (
                                <select
                                  key={component.label}
                                  value={current[component.label] ?? ''}
                                  onChange={(e) => {
                                    const next = {
                                      ...current,
                                      [component.label]: e.target.value,
                                    };
                                    setComponentChoices((prev) => ({
                                      ...prev,
                                      [group.label]: next,
                                    }));

                                    const ordered = components.map(
                                      (c) => next[c.label] ?? ''
                                    );
                                    setSelectedSizes((prev) => ({
                                      ...prev,
                                      [group.label]: ordered.every(Boolean)
                                        ? joinComponents(ordered, catalog.scales, group)
                                        : '',
                                    }));
                                  }}
                                  className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                >
                                  <option value="">{component.label}</option>
                                  {component.values.map((value) => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </select>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={group.label}>
                          <label
                            htmlFor={`part-${group.label}`}
                            className="block text-sm mb-2"
                          >
                            {group.label}
                          </label>
                          <select
                            id={`part-${group.label}`}
                            value={selectedSizes[group.label] ?? ''}
                            onChange={(e) =>
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [group.label]: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                          >
                            <option value="">
                              Select your {group.label.toLowerCase()}
                            </option>
                            {options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border border-gray-200 bg-gray-50 p-4 mt-5 space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {MADE_TO_MEASURE_COPY.leadTime(product.lead_time_weeks)}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {MADE_TO_MEASURE_COPY.returns}
                  </p>
                </div>
              </div>
            )}

            {isBespoke(product) && (
              <div className="mb-6">
                <label htmlFor="bespoke-notes" className="block font-medium mb-2">
                  {BESPOKE_COPY.notesLabel}
                </label>
                <p className="text-sm text-gray-600 mb-3">{BESPOKE_COPY.notesHelp}</p>
                <textarea
                  id="bespoke-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />

                <div className="border border-gray-200 bg-gray-50 p-4 mt-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {BESPOKE_COPY.beforeCheckout}
                  </p>
                </div>
              </div>
            )}

            {/* Multi-part sizing. A bikini gets a Top picker and a Bottom
                picker, each with its own stock, because the pieces are
                stocked separately rather than as fixed pairs. */}
            {!isBespoke(product) && hasSizeGroups(product) && (
              <div className="mb-6 space-y-6">
                {(product.size_groups ?? []).map((group) => {
                  const chosen = selectedSizes[group.label];
                  const required = isPartRequired(group);
                  const included = includedParts.includes(group.label);
                  const available = availableSizesFor(product, group, selectedColor);

                  return (
                    <div
                      key={group.label}
                      className={included ? '' : 'opacity-50'}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* An optional part can be left out entirely, so a
                              top from one set can be bought on its own. */}
                          {!required && (
                            <input
                              type="checkbox"
                              checked={included}
                              onChange={(e) =>
                                setIncludedParts((prev) =>
                                  e.target.checked
                                    ? [...prev, group.label]
                                    : prev.filter((l) => l !== group.label)
                                )
                              }
                              aria-label={`Include ${group.label}`}
                            />
                          )}
                          <label className="block font-medium">
                            {group.label}
                            {!required && group.price != null && (
                              <span className="text-sm text-gray-600 ml-2">
                                {formatPrice(Number(group.price))} alone
                              </span>
                            )}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/size-guide')}
                          className="text-[#008080] hover:text-[#006666]"
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Size Guide
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.sizes.map((size) => {
                          const remaining = stockFor(product, {
                            color: selectedColor,
                            group: group.label,
                            size,
                          });
                          const unavailable = remaining <= 0 || !included;
                          return (
                            <button
                              key={size}
                              disabled={unavailable}
                              title={
                                remaining <= 0 ? 'Sold out' : `${remaining} available`
                              }
                              onClick={() =>
                                !unavailable &&
                                setSelectedSizes((prev) => ({
                                  ...prev,
                                  [group.label]: size,
                                }))
                              }
                              className={`min-w-[3.5rem] px-3 py-3 border text-center text-sm transition-all ${
                                unavailable
                                  ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                                  : chosen === size
                                    ? 'border-[#008080] bg-[#008080] text-white'
                                    : 'border-gray-300 hover:border-[#008080]'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>

                      {available.length === 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Every {group.label.toLowerCase()} size is sold out
                          {selectedColor ? ` in ${selectedColor}` : ''}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* What the current selection actually costs. */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-600">
                      {includedParts.length === (product.size_groups ?? []).length
                        ? 'Complete set'
                        : `${includedParts.length} of ${(product.size_groups ?? []).length} pieces`}
                    </span>
                    <span className="text-xl">
                      {formatPrice(priceForSelection(product, includedParts))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isBespoke(product) && !hasSizeGroups(product) && product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium">Size</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/size-guide')}
                    className="text-[#008080] hover:text-[#006666]"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Size Guide
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((rawSize) => {
                    const size = String(rawSize);
                    const remaining = stockFor(product, {
                      color: selectedColor,
                      size,
                    });
                    const unavailable = remaining <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !unavailable && setSelectedSize(size)}
                        disabled={unavailable}
                        title={unavailable ? 'Sold out' : `${remaining} available`}
                        className={`min-w-[3.5rem] px-3 py-3 border text-center text-sm transition-all ${
                          unavailable
                            ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-[#008080] bg-[#008080] text-white'
                              : 'border-gray-300 hover:border-[#008080]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={tracksStock(product) && (hasSizeGroups(product) ? isGroupedSoldOut(product) : isSoldOut(product))}
                className="flex-1 bg-[#008080] hover:bg-[#006666] text-white h-14 text-lg disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isBespoke(product)
                  ? 'Begin your commission'
                  : isMadeToMeasure(product)
                    ? 'Add to Bag'
                  : tracksStock(product) &&
                      (hasSizeGroups(product) ? isGroupedSoldOut(product) : isSoldOut(product))
                    ? 'Sold Out'
                    : isPreOrder(product)
                      ? 'Pre-order'
                      : 'Add to Bag'}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className={`h-14 px-6 ${inWishlist ? 'bg-red-50 border-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Materials */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold mb-3">Materials</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <span
                    key={material}
                    className="px-3 py-1 bg-gray-100 text-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Handmade in Italy</h4>
                  <p className="text-gray-600 text-sm">Crafted by master artisans in our Italian workshop</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">100% Vegan</h4>
                  <p className="text-gray-600 text-sm">Made entirely from plant-based materials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Signature Teal Sole</h4>
                  <p className="text-gray-600 text-sm">Our iconic teal sole made from natural rubber</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Free Shipping & Returns</h4>
                  <p className="text-gray-600 text-sm">On orders over {formatPrice(SHIPPING.freeThreshold)} with {RETURNS.windowDays}-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
