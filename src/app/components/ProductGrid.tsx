import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../App';
import { productMatchesFilter, isSoldOut, type FilterKey } from '../config/taxonomy';
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
}

export function ProductGrid({ onProductClick, onAddToWishlist, isInWishlist, filter }: ProductGridProps) {
  const { products, loading } = useSupabaseProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const colors = [
    { name: 'Gray', hex: '#B8B5AD' },
    { name: 'Black', hex: '#000000' },
    { name: 'Brown', hex: '#9B6F47' }
  ];

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

  const filteredProducts =
    selectedCategory === 'all'
      ? baseProducts
      : baseProducts.filter((p) => productMatchesFilter(p, selectedCategory as FilterKey));

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-8" id="shoes">
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="uppercase tracking-wider text-sm hover:text-gray-600 transition-colors flex items-center gap-2"
          >
            Filter
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
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="border border-gray-200 p-6 mb-8">
          <h4 className="uppercase tracking-wider text-sm mb-4">Category</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory === 'all' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('shoes')}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory === 'shoes' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              Women's Shoes
            </button>
            <button
              onClick={() => setSelectedCategory('mens')}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory === 'mens' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              Men's Collection
            </button>
            <button
              onClick={() => setSelectedCategory('accessories')}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory === 'accessories' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              Accessories
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 border border-gray-200 bg-gray-50">
          <p className="text-gray-600 mb-2">No products found</p>
          <p className="text-sm text-gray-500">Please add products in the admin panel</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group"
          >
            <div className="relative aspect-[2/3] bg-gray-100 mb-3 overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
              <img
                src={getPrimaryProductImage(product)}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  isSoldOut(product) ? 'opacity-60' : ''
                }`}
              />

              {isSoldOut(product) && (
                <span className="absolute top-4 left-4 z-10 bg-white/95 px-3 py-1 text-xs uppercase tracking-wider">
                  Sold Out
                </span>
              )}
              
              {/* Wishlist Heart Button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all z-10"
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
            <div className="flex items-center gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}