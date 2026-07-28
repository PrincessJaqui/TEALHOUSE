import { useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="text-[#008080] text-8xl font-light mb-4">404</div>
          <h1 className="text-4xl mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for has wandered off the beaten path.
            Let us help you find your way back to luxury.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate('/')}
            className="bg-[#008080] hover:bg-[#006666] text-white"
          >
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/shoes')}
            className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shop Footwear
          </Button>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl mb-4">Popular Pages</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            <button
              onClick={() => navigate('/new-arrivals')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → New Arrivals
            </button>
            <button
              onClick={() => navigate('/best-sellers')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → Best Sellers
            </button>
            <button
              onClick={() => navigate('/mens-shoes')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → Men's Collection
            </button>
            <button
              onClick={() => navigate('/womens-shoes')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → Women's Collection
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → Our Story
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-700 hover:text-[#008080] text-left"
            >
              → Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
