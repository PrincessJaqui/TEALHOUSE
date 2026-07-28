-- TEALHOUSE: Clean slate with 4 signature products
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/sql

-- STEP 1: Delete all existing products (clean slate)
DELETE FROM products;

-- STEP 2: Insert the 4 TEALHOUSE signature products
INSERT INTO products (name, price, image, images, video, categories, audience, description, materials, sizes, created_at, updated_at)
VALUES
  (
    'Lexi',
    1250.00,
    'https://images.unsplash.com/photo-1761110583261-3ea6f09f0699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdGlsZXR0byUyMGhlZWx8ZW58MXx8fHwxNzY2MjAyNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ARRAY['https://images.unsplash.com/photo-1761110583261-3ea6f09f0699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdGlsZXR0byUyMGhlZWx8ZW58MXx8fHwxNzY2MjAyNDc0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    NULL,
    ARRAY['shoes'],
    ARRAY['women'],
    'The Lexi redefines elegance with its 4-inch stiletto heel and precision-cut cactus leather upper. Handcrafted in our Italian workshop, each pair features our signature teal natural rubber sole for uncompromising comfort. The minimalist silhouette transitions seamlessly from boardroom to evening, embodying TEALHOUSE''s commitment to plant-based luxury without compromise.',
    ARRAY['Cactus Leather', 'Natural Rubber'],
    ARRAY[36, 37, 38, 39, 40, 41],
    NOW(),
    NOW()
  ),
  (
    'Kyla',
    1125.00,
    'https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhcHB5JTIwc2FuZGFsJTIwaGVlbHxlbnwxfHx8fDE3NjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ARRAY['https://images.unsplash.com/photo-1554238113-6d3dbed5cf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhcHB5JTIwc2FuZGFsJTIwaGVlbHxlbnwxfHx8fDE3NjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    NULL,
    ARRAY['shoes'],
    ARRAY['women'],
    'The Kyla lace-up sandal marries architectural design with botanical innovation. Interlaced cactus leather straps create a sculptural silhouette that elongates the leg, while our proprietary teal sole provides day-long comfort. Designed in Kansas City and made in Italy, the Kyla represents our vision of sustainable summer luxury—where ethical choices meet sophisticated style.',
    ARRAY['Cactus Leather', 'Natural Rubber'],
    ARRAY[36, 37, 38, 39, 40, 41],
    NOW(),
    NOW()
  ),
  (
    'Christine',
    2500.00,
    'https://images.unsplash.com/photo-1760135119333-bc76583e498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0aGlnaCUyMGhpZ2glMjBib290c3xlbnwxfHx8fDE3NjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ARRAY['https://images.unsplash.com/photo-1760135119333-bc76583e498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0aGlnaCUyMGhpZ2glMjBib290c3xlbnwxfHx8fDE3NjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    NULL,
    ARRAY['shoes'],
    ARRAY['women'],
    'The Christine over-the-knee boot is TEALHOUSE''s most ambitious creation—a 3.5-inch pointed toe masterpiece that commands attention. Crafted from premium cactus leather with our signature teal sole, this statement boot required 18 months of development to perfect the plant-based construction for its dramatic silhouette. Italian artisans hand-finish each pair, ensuring the Christine moves with your body while maintaining its striking architectural form. This is vegan luxury at its pinnacle.',
    ARRAY['Cactus Leather', 'Natural Rubber'],
    ARRAY[36, 37, 38, 39, 40, 41],
    NOW(),
    NOW()
  ),
  (
    'Kyle',
    1900.00,
    'https://images.unsplash.com/photo-1608629601270-a0007becead3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwY2hlbHNlYSUyMGJvb3R8ZW58MXx8fHwxNjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ARRAY['https://images.unsplash.com/photo-1608629601270-a0007becead3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwY2hlbHNlYSUyMGJvb3R8ZW58MXx8fHwxNjYyMDI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    NULL,
    ARRAY['shoes'],
    ARRAY['men'],
    'The Kyle Chelsea boot brings TEALHOUSE''s plant-based innovation to menswear. This modern classic features premium cactus leather construction with elastic side goring and our distinctive teal sole. Made in Italy using traditional bootmaking techniques adapted for botanical materials, the Kyle delivers the refined aesthetic of luxury leather with zero animal products. Perfect for the conscious gentleman who refuses to compromise on style or values.',
    ARRAY['Cactus Leather', 'Natural Rubber'],
    ARRAY[40, 41, 42, 43, 44, 45],
    NOW(),
    NOW()
  );

-- STEP 3: Verify the result
SELECT 
  id, 
  name, 
  price, 
  categories, 
  audience, 
  array_length(images, 1) as image_count
FROM products
ORDER BY created_at DESC;
