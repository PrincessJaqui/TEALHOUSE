import { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Product } from '../App';
import { getPrimaryProductImage } from '../lib/default-image';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export function Search({ isOpen, onClose, onProductClick }: SearchProps) {
  const { products } = useSupabaseProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    // product.category (singular) does not exist on Product. It is
    // categories: string[]. The old code threw on every keystroke, so
    // searching by category silently returned nothing.
    const results = products.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.categories?.some(category => category?.toLowerCase().includes(query)) ||
      product.materials?.some(material => material?.toLowerCase().includes(query))
    );
    setSearchResults(results);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setSearchQuery('');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProductClick = (product: Product) => {
    onProductClick(product);
    onClose();
    setSearchQuery('');
  };

  return (
    <div className="fixed top-[60px] left-0 right-0 z-[100]">
      <div ref={searchRef} className="bg-white border-b border-gray-200 shadow-lg">
        {/* Search Input */}
        <div className="max-w-[600px] mx-auto px-5 py-4">
          <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 outline-none text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() !== '' && (
          <div className="max-w-[1200px] mx-auto px-5 py-6 max-h-[60vh] overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
                        <img
                          src={getPrimaryProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-sm mb-1 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Popular Searches - shown when no query */}
        {searchQuery.trim() === '' && (
          <div className="max-w-[1200px] mx-auto px-5 py-6 border-t border-gray-100">
            <h3 className="mb-3 uppercase tracking-wider text-xs text-gray-500">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Heels', 'Boots', 'Sandals', 'Vegan Leather'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1.5 border border-gray-300 hover:border-black transition-colors text-xs uppercase tracking-wider"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}