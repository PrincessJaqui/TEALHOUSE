import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Users, BarChart3, Settings, LogOut, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
    
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/company-login');
  };
  
  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: ShoppingCart
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: Package
    },
    {
      path: '/admin/customers',
      label: 'Customers',
      icon: Users
    }
  ];

  return (
    <div className="border-b border-neutral-200 bg-white mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-black text-black'
                      : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}