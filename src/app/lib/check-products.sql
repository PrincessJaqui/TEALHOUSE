-- DIAGNOSTIC: Check products table structure and data
-- Run this to see what's in your database

-- 1. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 2. Count total products
SELECT COUNT(*) as total_products FROM products;

-- 3. Show first 5 products to see the data structure
SELECT 
  id,
  name,
  price,
  categories,
  audience,
  images,
  CASE WHEN video IS NOT NULL THEN 'Yes' ELSE 'No' END as has_video,
  created_at
FROM products
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if images column has data
SELECT 
  id,
  name,
  CASE 
    WHEN images IS NULL THEN 'NULL'
    WHEN array_length(images, 1) IS NULL THEN 'EMPTY ARRAY'
    ELSE array_length(images, 1)::TEXT || ' images'
  END as image_status
FROM products
ORDER BY created_at DESC;
