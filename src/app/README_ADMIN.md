# TEALHOUSE Admin Product Management

## 🎉 What's New

You now have a complete admin product management system integrated with Supabase! This allows you to:

✅ Add new products with image uploads  
✅ Store products in Supabase database  
✅ Upload images to Supabase Storage  
✅ View all products in the admin panel  
✅ Delete products  
✅ Automatically sync products to the frontend  
✅ Fallback to hardcoded products if database is unavailable  

## 🚀 Quick Start

### 1. Set Up the Database

1. Open your Supabase project: https://supabase.com
2. Go to **SQL Editor**
3. Copy all SQL from `/lib/supabase-schema.sql`
4. Paste and run it in the SQL Editor

This creates:
- Products table
- Storage bucket for images
- Security policies

### 2. Access the Admin Panel

Navigate to: **http://localhost:5173/admin/products**

Or click the small "Admin" link in the footer of your site.

### 3. Add Your First Product

1. Click "Choose File" to upload a product image
2. Fill in:
   - **Product Name** (e.g., "Aria Mule")
   - **Price** (e.g., 1295.00)
   - **Category** (Shoes, Accessories, or Men's)
   - **Description** (product details)
   - **Materials** (select at least one)
   - **Sizes** (for shoes/men's items)
3. Click "Add Product"

## 📂 File Structure

### New Files Created

```
/pages/AdminProducts.tsx         # Admin UI for managing products
/hooks/useSupabaseProducts.ts    # Hook to load products from Supabase
/lib/supabase-schema.sql         # Updated with products table
/ADMIN_SETUP.md                  # Detailed setup guide
/README_ADMIN.md                 # This file
```

### Modified Files

```
/App.tsx                         # Added admin route
/components/ProductGrid.tsx      # Now loads from Supabase
/components/Search.tsx           # Now searches Supabase products
/components/Footer.tsx           # Added admin link
/lib/supabase.ts                 # Added product types
```

## 🔄 How It Works

### Product Loading Flow

```
1. User opens site
2. useSupabaseProducts hook runs
3. Attempts to fetch from Supabase
4. If successful: Shows database products
5. If fails: Falls back to /data/products.ts
6. Products display on homepage
```

### Adding a Product Flow

```
1. Admin uploads image
2. Image saved to Supabase Storage
3. Product data saved to Supabase Database
4. Frontend automatically refreshes
5. New product appears on site
```

## 📊 Database Schema

### Products Table

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | BIGSERIAL | Auto-increment primary key     |
| name        | VARCHAR   | Product name                   |
| price       | DECIMAL   | Price in USD                   |
| image       | TEXT      | Image URL from storage         |
| category    | VARCHAR   | shoes/accessories/mens         |
| description | TEXT      | Product description            |
| materials   | JSONB     | Array of materials             |
| sizes       | JSONB     | Array of sizes (optional)      |
| created_at  | TIMESTAMP | When product was added         |
| updated_at  | TIMESTAMP | Last update time               |

## 🎨 Admin Interface Features

### Left Panel: Add Product Form
- Image upload with preview
- All product fields
- Material selection (multi-select)
- Size selection (for shoes/men's)
- Submit button

### Right Panel: Product List
- Shows all existing products
- Product thumbnail
- Name, price, category
- Delete button for each product

### Smart Fallback
- If Supabase is down, uses hardcoded products
- Site never breaks
- Perfect for development

## 🔐 Security

### Current Setup
- Anyone authenticated can add/edit products
- Anyone can view products (public)
- Good for development/testing

### For Production
You should add admin role checking:

```sql
-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Update policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admins)
  );
```

## 🛠️ Common Tasks

### Update a Product

Currently, you need to:
1. Delete the old product
2. Add a new one with updated info

To add edit functionality, extend `/pages/AdminProducts.tsx` with:
- Edit button on each product
- Edit form modal
- Update function

### Bulk Import Products

To import many products at once:

```typescript
// In admin panel, add:
const importProducts = async (products: Product[]) => {
  const { error } = await supabase
    .from('products')
    .insert(products);
  if (error) throw error;
};
```

### Export Products

```typescript
const exportProducts = async () => {
  const { data } = await supabase
    .from('products')
    .select('*');
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  a.click();
};
```

## 🐛 Troubleshooting

### Products Not Showing
- Check Supabase is running
- Check SQL was run successfully
- Open browser console for errors
- Verify in Supabase Dashboard > Table Editor

### Can't Upload Images
- Verify storage bucket exists (Supabase > Storage)
- Check storage policies
- Ensure anonymous auth is enabled
- Check file size (< 50MB)

### "Failed to add product"
- Open browser console
- Look for detailed error message
- Check all required fields filled
- Verify image is valid format

## 📈 Next Steps

Consider adding:

1. **Product Editing**
   - Edit button on each product
   - Pre-fill form with existing data
   - Update function

2. **Image Management**
   - Multiple images per product
   - Image gallery
   - Cropping/resizing

3. **Categories & Tags**
   - Custom categories
   - Product tags
   - Better filtering

4. **Inventory**
   - Stock tracking
   - Low stock alerts
   - Size-specific inventory

5. **Analytics**
   - View counts
   - Popular products
   - Sales tracking

6. **Admin Dashboard**
   - Overview page
   - Sales charts
   - Recent orders

## 🔗 Key Files to Know

### `/pages/AdminProducts.tsx`
Main admin interface. Modify this to add features like editing, bulk actions, etc.

### `/hooks/useSupabaseProducts.ts`
Handles loading products. Uses fallback to hardcoded data if Supabase unavailable.

### `/lib/supabase-schema.sql`
Database schema. Run this in Supabase SQL Editor first!

### `/data/products.ts`
Fallback products. These show if database is empty or unavailable.

## 💡 Tips

1. **Development**: The fallback system means you can develop without Supabase connected
2. **Testing**: Add test products to verify everything works
3. **Images**: Use high-quality images (at least 800x1200px)
4. **Pricing**: Keep consistent with luxury brand positioning ($995-$2,995)
5. **Descriptions**: Write compelling copy highlighting plant-based materials

## 📞 Support

For help with:
- **Supabase issues**: https://supabase.com/docs
- **Database questions**: Check `/lib/supabase-schema.sql`
- **Product format**: Check `/data/products.ts` for examples
- **Admin UI**: Check `/pages/AdminProducts.tsx`

---

**You're all set!** 🎉 

Start by running the SQL schema in Supabase, then visit `/admin/products` to add your first product.
