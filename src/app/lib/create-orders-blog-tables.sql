-- ============================================
-- TEALHOUSE Orders & Blog Tables
-- ============================================
-- Run this SQL in Supabase SQL Editor to create tables for tracking orders and blog posts
-- URL: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/sql/new

-- ============================================
-- 1. ORDERS TABLE
-- ============================================
-- Tracks customer orders

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Customer Info
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Shipping Address
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'US',
  
  -- Order Details
  status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  
  -- Order Items (stored as JSONB array)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  items_count INTEGER DEFAULT 0,
  
  -- Payment
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
  payment_method TEXT,
  
  -- Tracking
  tracking_number TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    customer_email = auth.email()
  );

-- Policy: Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Policy: Admins can insert orders
CREATE POLICY "Admins can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Policy: Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 2. BLOG POSTS TABLE
-- ============================================
-- Tracks blog posts and media content

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Post Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  
  -- Media
  featured_image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Status & Visibility
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  published_at TIMESTAMPTZ,
  
  -- Author
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  
  -- Categories & Tags
  category TEXT,
  tags TEXT[],
  
  -- Analytics
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published posts
CREATE POLICY "Everyone can view published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'Published');

-- Policy: Admins can view all posts
CREATE POLICY "Admins can view all posts"
  ON public.blog_posts
  FOR SELECT
  USING (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Policy: Admins can insert posts
CREATE POLICY "Admins can insert posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Policy: Admins can update posts
CREATE POLICY "Admins can update posts"
  ON public.blog_posts
  FOR UPDATE
  USING (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Policy: Admins can delete posts
CREATE POLICY "Admins can delete posts"
  ON public.blog_posts
  FOR DELETE
  USING (
    auth.email() IN (
      'Hello@TEALHOUSE.us',
      'jaqui@TealHouseInc.com',
      'bobby@TealHouseInc.com'
    )
  );

-- Update timestamp trigger for blog_posts
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Function to increment blog post views
CREATE OR REPLACE FUNCTION public.increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. SAMPLE DATA (Optional)
-- ============================================

-- Insert sample order (for testing)
INSERT INTO public.orders (
  customer_name,
  customer_email,
  customer_phone,
  shipping_address_line1,
  shipping_city,
  shipping_state,
  shipping_postal_code,
  status,
  total,
  subtotal,
  tax,
  items,
  items_count,
  payment_status
) VALUES (
  'Jane Smith',
  'jane@example.com',
  '555-123-4567',
  '123 Main St',
  'Kansas City',
  'MO',
  '64101',
  'Delivered',
  1695.00,
  1695.00,
  0,
  '[{"name": "Teal Sole Loafer", "size": "38", "quantity": 1, "price": 1695}]'::jsonb,
  1,
  'Paid'
) ON CONFLICT DO NOTHING;

-- Insert sample blog post (for testing)
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  published_at,
  author_name,
  category,
  tags,
  views
) VALUES (
  'Introducing Our Latest Collection',
  'introducing-our-latest-collection',
  'Discover the newest additions to our sustainable luxury footwear line.',
  '<p>We''re thrilled to unveil our latest collection of plant-based luxury shoes...</p>',
  'Published',
  NOW(),
  'TEALHOUSE Team',
  'Collections',
  ARRAY['New Arrivals', 'Sustainable Fashion', 'Italian Craftsmanship'],
  2456
),
(
  'Sustainability at TEALHOUSE',
  'sustainability-at-tealhouse',
  'Learn about our commitment to creating beautiful, sustainable footwear.',
  '<p>At TEALHOUSE, sustainability isn''t just a buzzword—it''s our foundation...</p>',
  'Published',
  NOW() - INTERVAL '15 days',
  'TEALHOUSE Team',
  'Sustainability',
  ARRAY['Environment', 'Cactus Leather', 'Vegan Fashion'],
  3891
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check orders table
SELECT 
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM public.orders;

-- Check blog posts table
SELECT 
  id,
  title,
  status,
  views,
  published_at
FROM public.blog_posts
ORDER BY published_at DESC;

-- ============================================
-- NOTES
-- ============================================
-- 1. Orders are tracked with full customer and shipping info
-- 2. Order items are stored as JSONB for flexibility
-- 3. Blog posts support draft/published workflow
-- 4. RLS policies ensure only admins can manage data
-- 5. Customers can only see their own orders
-- 6. Published blog posts are viewable by everyone
-- 7. Sample data included for testing
