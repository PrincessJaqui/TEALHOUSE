import { supabase } from '../lib/supabase';
import imgLexi from 'figma:asset/d2e49d5e5c2e04a8493f862414b39a5eaeb56d5c.png';
import imgKyla from 'figma:asset/e316c939477cc751a3ac939840c2e2ccd59a9c14.png';
import imgChristine from 'figma:asset/17fc2fc363768add6276122355c567506199aa1a.png';
import imgKyle from 'figma:asset/246b9d8fe6e703cde2f73ff5cb74cc75cc305526.png';

export const SEED_PRODUCTS = [
  {
    name: 'Lexi',
    price: 1250,
    image: imgLexi,
    images: [imgLexi],
    categories: ['shoes', 'heels'],
    audience: ['women'],
    description: 'The Lexi pump embodies timeless elegance with a modern twist. Crafted from premium cactus leather, this sophisticated pointed-toe pump features our signature teal sole and a sleek stiletto heel. Perfect for boardroom power or evening glamour.',
    materials: ['Cactus Leather', 'Natural Rubber'],
    sizes: [36, 37, 38, 39, 40, 41, 42]
  },
  {
    name: 'Kyla',
    price: 1125,
    image: imgKyla,
    images: [imgKyla],
    categories: ['shoes', 'sandals'],
    audience: ['women'],
    description: 'The Kyla sandal redefines casual luxury. This ankle-tie flat showcases the art of minimalist design with asymmetric cactus leather straps and our iconic teal sole. Effortlessly chic for warm-weather sophistication.',
    materials: ['Cactus Leather', 'Natural Rubber'],
    sizes: [36, 37, 38, 39, 40, 41, 42]
  },
  {
    name: 'Christine',
    price: 2500,
    image: imgChristine,
    images: [imgChristine],
    categories: ['shoes', 'boots'],
    audience: ['women'],
    description: 'The Christine over-the-knee boot is a statement of bold refinement. Expertly crafted from supple cactus leather with a pointed toe and architectural heel, featuring our distinctive teal sole. A modern masterpiece for those who demand attention.',
    materials: ['Cactus Leather', 'Natural Rubber'],
    sizes: [36, 37, 38, 39, 40, 41, 42]
  },
  {
    name: 'Kyle',
    price: 1900,
    image: imgKyle,
    images: [imgKyle],
    categories: ['shoes', 'boots'],
    audience: ['women', 'men', 'unisex'],
    description: 'The Kyle Chelsea boot combines classic British style with sustainable innovation. Featuring elastic side panels and a refined silhouette in premium cactus leather, complete with our iconic teal sole. Effortless versatility for the modern wardrobe.',
    materials: ['Cactus Leather', 'Natural Rubber'],
    sizes: [36, 37, 38, 39, 40, 41, 42]
  }
];

export async function seedProducts() {
  try {
    console.log('=== STARTING SEED PROCESS ===');
    
    // First, get all existing products
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('*');
    
    console.log('Existing products:', existingProducts);
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
    }
    
    // Delete all existing products one by one
    if (existingProducts && existingProducts.length > 0) {
      console.log(`Deleting ${existingProducts.length} existing products...`);
      for (const product of existingProducts) {
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id);
        
        if (deleteError) {
          console.error(`Error deleting product ${product.id}:`, deleteError);
        } else {
          console.log(`✓ Deleted product: ${product.name} (ID: ${product.id})`);
        }
      }
    } else {
      console.log('No existing products to delete');
    }
    
    console.log('Seeding new products...');
    
    for (const product of SEED_PRODUCTS) {
      console.log(`Creating product: ${product.name}...`);
      console.log('Product data:', product);
      
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`❌ Error inserting product "${product.name}":`, error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log(`✓ Created product: ${product.name}`);
        console.log('Created data:', data);
      }
    }

    console.log('=== SEED COMPLETE ===');
    return { success: true };
  } catch (error) {
    console.error('=== SEED ERROR ===');
    console.error('Error seeding products:', error);
    return { success: false, error };
  }
}