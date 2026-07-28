-- Fix RLS policies for products table to allow admin operations
-- This allows the admin user (jaquimccarthy@gmail.com) to create, update, and delete products

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Allow authenticated admin to insert products
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() -> 'email' = '"jaquimccarthy@gmail.com"');

-- Allow authenticated admin to update products
CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.jwt() -> 'email' = '"jaquimccarthy@gmail.com"');

-- Allow authenticated admin to delete products
CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.jwt() -> 'email' = '"jaquimccarthy@gmail.com"');

-- Keep the public read policy for all users
-- This should already exist, but adding it just in case
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);
