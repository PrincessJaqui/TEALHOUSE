-- TEALHOUSE Updated Database Schema for Product Management
-- Run this in your Supabase SQL Editor to update the products table

-- First, check if the products table needs to be updated
-- This script will update the schema to support multiple images, videos, categories, and audience

-- Drop the old category check constraint if it exists
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Update products table structure (if columns don't exist, they will be added)
DO $$ 
BEGIN
  -- Add images column (array of text) if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='images') THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;

  -- Add video column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='video') THEN
    ALTER TABLE products ADD COLUMN video TEXT;
  END IF;

  -- Add categories column (array) if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='categories') THEN
    ALTER TABLE products ADD COLUMN categories TEXT[] DEFAULT '{}';
  END IF;

  -- Add audience column (array) if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='audience') THEN
    ALTER TABLE products ADD COLUMN audience TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Migrate materials from JSONB to TEXT[] if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='products' AND column_name='materials' AND data_type='jsonb') THEN
    -- Create a temporary column
    ALTER TABLE products ADD COLUMN materials_temp TEXT[];
    
    -- Convert JSONB array to TEXT array
    UPDATE products 
    SET materials_temp = ARRAY(SELECT jsonb_array_elements_text(materials));
    
    -- Drop old column and rename new one
    ALTER TABLE products DROP COLUMN materials;
    ALTER TABLE products RENAME COLUMN materials_temp TO materials;
    ALTER TABLE products ALTER COLUMN materials SET NOT NULL;
  END IF;
END $$;

-- Migrate sizes from JSONB to INTEGER[] if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='products' AND column_name='sizes' AND data_type='jsonb') THEN
    -- Create a temporary column
    ALTER TABLE products ADD COLUMN sizes_temp INTEGER[];
    
    -- Convert JSONB array to INTEGER array
    UPDATE products 
    SET sizes_temp = CASE 
      WHEN sizes IS NULL THEN NULL
      ELSE ARRAY(SELECT jsonb_array_elements_text(sizes)::INTEGER)
    END;
    
    -- Drop old column and rename new one
    ALTER TABLE products DROP COLUMN sizes;
    ALTER TABLE products RENAME COLUMN sizes_temp TO sizes;
  END IF;
END $$;

-- Migrate existing data if needed (from single image to images array)
UPDATE products 
SET images = ARRAY[image]
WHERE (images IS NULL OR array_length(images, 1) IS NULL)
  AND image IS NOT NULL;

-- Migrate existing data if needed (from single category to categories array)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='products' AND column_name='category') THEN
    UPDATE products 
    SET categories = ARRAY[category]
    WHERE category IS NOT NULL AND (categories IS NULL OR array_length(categories, 1) IS NULL);
  END IF;
END $$;

-- Make sure RLS policies exist for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Create policies for products (public read, authenticated write)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Create storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_categories ON products USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_products_audience ON products USING GIN(audience);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
