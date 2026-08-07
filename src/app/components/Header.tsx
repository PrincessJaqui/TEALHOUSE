import { Menu, Search, Heart, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import imgLogo from "figma:asset/3f298acd9128513aa329c386495f656e449305d1.png";
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCategoryCounts } from '../hooks/useCategoryCounts';

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onSearchClick: () => void;
}

export function Header({ cartItemCount, wishlistItemCount, onCartClick, onWishlistClick, onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Signed-in state, so the menu can say Account View and Admin View rather
   * than inviting someone to log in when they already have.
   *
   * An anonymous session exists purely to hold a guest's cart, so it does not
   * count as being signed in.
   */
  // A link to an empty category page reads as an unfinished shop, so each
  // one waits until its category actually has a published product.
  const { hasProducts } = useCategoryCounts();

  const [isCustomer, setIsCustomer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const resolveRole = async (session: any) => {
      const user = session?.user;
      const signedIn = Boolean(user && !user.is_anonymous && user.email);

      if (!signedIn) {
        if (active) {
          setIsCustomer(false);
          setIsAdmin(false);
        }
        return;
      }

      const { data } = await supabase.rpc('is_admin');
      if (!active) return;

      setIsAdmin(data === true);
      setIsCustomer(data !== true);
    };

    supabase.auth.getSession().then(({ data }) => resolveRole(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveRole(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Menu Button */}
            <button 
              className="p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img src={imgLogo} alt="TEALHOUSE" className="h-3" />
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-3 lg:gap-4 ml-auto">
              <button className="p-2 hover:text-gray-600 transition-colors" aria-label="Search" onClick={onSearchClick}>
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-gray-600 transition-colors hidden sm:block relative" aria-label="Private Selections" onClick={onWishlistClick}>
                <Heart className="w-5 h-5 text-teal-600" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </button>
              <button 
                className="p-2 hover:text-gray-600 transition-colors relative"
                onClick={onCartClick}
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Modal */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed left-0 top-0 bottom-0 z-[101] w-[280px] bg-white shadow-xl overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-6 hover:text-gray-600 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>

            {/* Menu Items */}
            <nav className="px-6 pb-8">
              <Link 
                to="/" 
                className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Footwear</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              {hasProducts('resort-wear') && (
                <Link
                  to="/resort-wear"
                  className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Resort Wear</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {hasProducts('accessories') && (
                <Link
                  to="/accessories"
                  className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Accents</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              <Link 
                to="/bespoke-design" 
                className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Bespoke</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onWishlistClick();
                }}
                className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm w-full text-left"
              >
                <span>Private Selections</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Bottom Links */}
            <div className="px-6 pb-6">
              <Link 
                to="/the-vault" 
                className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>The Vault</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/our-technologies" 
                className="flex items-center justify-between py-3 hover:text-gray-600 transition-colors group text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Concept Lab</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              {/* Divider after Concept Lab */}
              <div className="border-t border-gray-200 my-4" />
              
              <Link
                to="/customer-account"
                className="block py-2 hover:text-gray-600 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isCustomer ? 'Account View' : 'Customer Account'}
              </Link>
              
              {/* Social Media Links */}
              <div className="pt-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://www.instagram.com/tealhouse.us" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                  <a 
                    href="https://www.youtube.com/channel/UCqFuXtsJJedhxr-tO86HYrg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                  </a>
                  <a 
                    href="https://www.facebook.com/tealhouse.shoes/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/tealhouse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
              
              {/* Divider before the admin link */}
              <div className="border-t border-gray-200 my-4" />
              
              <Link
                to={isAdmin ? '/admin/dashboard' : '/company-login'}
                className="block py-2 hover:text-gray-600 transition-colors text-sm text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAdmin ? 'Admin View' : 'Company Login'}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}