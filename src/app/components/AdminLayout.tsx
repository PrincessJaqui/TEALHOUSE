import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Edit,
  Mail,
  Users,
  LogOut,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * The one admin shell.
 *
 * There used to be two competing admin interfaces: a horizontal tab bar in
 * AdminNav, and a second full sidebar layout built inside CompanyLogin that
 * rendered other admin pages nested inside the login page. They looked
 * different, one was missing Messages, and pages opened through CompanyLogin
 * rendered both navigations at once.
 *
 * Typography and colour follow the storefront rather than the generic admin
 * styling that came with the export: Tinos headings, the brand teal, a gray
 * canvas with white bordered cards.
 */

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/products', label: 'Products', icon: Edit },
  { path: '/admin/messages', label: 'Messages', icon: Mail },
  { path: '/admin/customers', label: 'Customers', icon: Users },
];

export function AdminLayout({ title, description, actions, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/company-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <nav className="bg-white border border-gray-200 p-4 space-y-1 lg:sticky lg:top-8">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      active
                        ? 'bg-[#008080] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-gray-100 border-t border-gray-200 mt-2 pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="font-['Tinos'] text-3xl mb-1">{title}</h1>
                {description && <p className="text-sm text-gray-600">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat tile.
 *
 * No coloured icon chips. The original had a green, a blue, a purple and an
 * orange rounded square, which read as a generic SaaS template rather than
 * anything to do with the brand. Label, value, and an optional note.
 */
interface StatTileProps {
  label: string;
  value: string | number;
  note?: string;
}

export function StatTile({ label, value, note }: StatTileProps) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">{label}</p>
      <p className="font-['Tinos'] text-3xl text-black">{value}</p>
      {note && <p className="text-xs text-gray-500 mt-2">{note}</p>}
    </div>
  );
}
