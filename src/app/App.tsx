import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { productPath } from './config/taxonomy';
import { Search } from './components/Search';
import { Wishlist } from './components/Wishlist';
import { Toaster } from './components/ui/sonner';
import { Home } from './pages/Home';
import { ItalianHandmade } from './pages/ItalianHandmade';
import { PlantBasedMaterials } from './pages/PlantBasedMaterials';
import { EthicsCompliance } from './pages/EthicsCompliance';
import { Sustainability } from './pages/Sustainability';
import { OurTechnologies } from './pages/OurTechnologies';
import { TheVault } from './pages/TheVault';
import { BespokeDesign } from './pages/BespokeDesign';
import { ClientServices } from './pages/ClientServices';
import { ContactUs } from './pages/ContactUs';
import { DeliveryReturns } from './pages/DeliveryReturns';
import { FAQ } from './pages/FAQ';
import { SizeGuide } from './pages/SizeGuide';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CustomerAccount } from './pages/CustomerAccount';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { CompanyLogin } from './pages/CompanyLogin';
import { Checkout } from './pages/Checkout';
import { Accessories } from './pages/Accessories';
import { Shoes } from './pages/Shoes';
import { MensShoes } from './pages/MensShoes';
import { WomensShoes } from './pages/WomensShoes';
import { NewArrivals } from './pages/NewArrivals';
import { BestSellers } from './pages/BestSellers';
import { ProductDetail } from './pages/ProductDetail';
import { CactusLeather } from './pages/CactusLeather';
import { TealSole } from './pages/TealSole';
import { AboutStory } from './pages/AboutStory';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOrders } from './pages/AdminOrders';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { useSupabaseCart } from './hooks/useSupabaseCart';
import { useSupabaseWishlist } from './hooks/useSupabaseWishlist';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCustomers } from './pages/AdminCustomers';
import { AdminMessages } from './pages/AdminMessages';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  video?: string;
  categories: string[];
  audience: string[];
  description: string;
  materials: string[];
  sizes?: number[];
  /** Map of size to quantity remaining. Sizeless products use the "default" key. */
  stock?: Record<string, number>;
  is_bestseller?: boolean;
  is_published?: boolean;
  created_at?: string;
  /** URL slug, generated from the name unless overridden. */
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  image_alt?: string;
  /**
   * Optional multi-part sizing. A bikini has two entries, Top and Bottom,
   * each with its own sizes and its own per-piece stock. Empty means the
   * product uses the single `sizes` list as before.
   */
  size_groups?: Array<{
    label: string;
    scale?: string;
    sizes: string[];
    required?: boolean;
    price?: number | null;
  }>;
  size_scale?: string;
  size_labels?: string[];
  /** in_stock, pre_order or made_to_order. Absent means in_stock. */
  fulfillment_type?: string;
  /** Fixed retainer charged for a bespoke piece, credited to the final price. */
  retainer_amount?: number | null;
  /** Estimated only, and the storefront says so. */
  preorder_ships_on?: string | null;
  /** Colours this piece comes in. Each carries its own stock. */
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  /** Single-size products. Text now, so it can hold XS, 00 or 34DD. */
  size?: string;
  /** Multi-part products, for example { Top: "S", Bottom: "M" }. */
  sizes?: Record<string, string>;
  /** What the customer wants, for a bespoke piece. */
  notes?: string;
  /** Chosen colour, which has its own stock. */
  color?: string;
}

function AppContent() {
  // Supabase integration
  const { user, loading: authLoading, signInAnonymously } = useSupabaseAuth();
  const { 
    cartItems: supabaseCartItems, 
    loading: cartLoading,
    addToCart: supabaseAddToCart,
    removeFromCart: supabaseRemoveFromCart,
    updateQuantity: supabaseUpdateQuantity,
    clearCart
  } = useSupabaseCart(user?.id);
  const { 
    wishlistItems: supabaseWishlistItems,
    loading: wishlistLoading,
    addToWishlist: supabaseAddToWishlist,
    removeFromWishlist: supabaseRemoveFromWishlist,
    isInWishlist: supabaseIsInWishlist
  } = useSupabaseWishlist(user?.id);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /**
   * Products used to open in a modal, which meant they had no URL at all:
   * nothing to share, nothing to bookmark, nothing for Google to index.
   * Clicking now goes to the product's own page.
   */
  const openProduct = (product: Product) => {
    navigate(productPath(product));
  };

  // Auto sign-in as guest if no user (but don't block the app)
  useEffect(() => {
    if (!authLoading && !user) {
      // Try to sign in anonymously, but don't block if it fails
      signInAnonymously().catch(() => {
        // Silently fail - app will work without Supabase
      });
    }
  }, [authLoading, user]);

  // Wrapper functions to ensure user is signed in
  // sizes carries a multi-part selection, for example { Top: "S", Bottom: "M" }
  const addToCart = async (
    product: Product,
    size?: string,
    sizes?: Record<string, string>,
    notes?: string,
    color?: string
  ) => {
    await supabaseAddToCart(product, size, sizes, notes, color);
  };

  const removeFromCart = async (
    productId: number,
    size?: string,
    sizes?: Record<string, string>,
    notes?: string,
    color?: string
  ) => {
    await supabaseRemoveFromCart(productId, size, sizes, notes, color);
  };

  const updateQuantity = async (
    productId: number,
    quantity: number,
    size?: string,
    sizes?: Record<string, string>,
    notes?: string,
    color?: string
  ) => {
    await supabaseUpdateQuantity(productId, quantity, size, sizes, notes, color);
  };

  const addToWishlist = async (product: Product) => {
    // Always call the hook function - it handles both Supabase and localStorage
    await supabaseAddToWishlist(product);
  };

  const removeFromWishlist = async (productId: number) => {
    // Always call the hook function - it handles both Supabase and localStorage
    await supabaseRemoveFromWishlist(productId);
  };

  const isInWishlist = (productId: number) => {
    return supabaseIsInWishlist(productId);
  };

  const cartItemCount = supabaseCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show loading state - let the app work immediately
  if (authLoading) {
    return null; // Brief flash, then app loads
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header 
          cartItemCount={cartItemCount}
          wishlistItemCount={supabaseWishlistItems.length}
          onCartClick={() => setIsCartOpen(true)}
          onWishlistClick={() => setIsWishlistOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
        />
        
        <Routes>
          <Route path="/" element={<Home onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/italian-handmade" element={<ItalianHandmade />} />
          <Route path="/plant-based-materials" element={<PlantBasedMaterials />} />
          <Route path="/ethics-compliance" element={<EthicsCompliance />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/our-technologies" element={<OurTechnologies />} />
          <Route path="/the-vault" element={<TheVault />} />
          <Route path="/bespoke-design" element={<BespokeDesign />} />
          <Route path="/client-services" element={<ClientServices />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/delivery-returns" element={<DeliveryReturns />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/customer-account" element={<CustomerAccount />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/checkout" element={<Checkout items={supabaseCartItems} onOrderPlaced={clearCart} />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/shoes" element={<Shoes onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/mens-shoes" element={<MensShoes onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/womens-shoes" element={<WomensShoes onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/new-arrivals" element={<NewArrivals onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/best-sellers" element={<BestSellers onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          {/* Canonical product URL. The legacy id route is kept so any link
              already shared still resolves; ProductDetail redirects it here. */}
          <Route path="/products/:category/:slug" element={<ProductDetail onAddToCart={addToCart} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/product-detail/:id" element={<ProductDetail onAddToCart={addToCart} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/cactus-leather" element={<CactusLeather onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/teal-sole" element={<TealSole onProductClick={openProduct} onAddToWishlist={addToWishlist} isInWishlist={isInWishlist} />} />
          <Route path="/about-story" element={<AboutStory />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
          <Route path="/admin/messages" element={<ProtectedAdminRoute><AdminMessages /></ProtectedAdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Footer />
        
        <Search
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onProductClick={openProduct}
        />
        
        <Wishlist
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          items={supabaseWishlistItems}
          onRemoveItem={removeFromWishlist}
          onMoveToCart={addToCart}
          onProductClick={openProduct}
        />
        
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={supabaseCartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
        
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
          isInWishlist={isInWishlist}
        />
        
        <Toaster duration={1500} />
      </div>
    </>
  );
}

/**
 * The Router has to sit outside the component that uses useNavigate, so the
 * app body lives in AppContent and this is just the shell.
 */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}