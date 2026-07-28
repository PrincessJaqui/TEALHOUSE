# TEALHOUSE - Luxury Vegan Ecommerce Platform

A luxury ecommerce website for TEALHOUSE, a vegan shoe and accessory company that makes shoes from plants with signature teal soles.

## 🌱 About TEALHOUSE

- **Products:** Luxury vegan shoes and accessories made from plant-based materials
- **Materials:** Cactus leather, natural rubbers, bamboo, and flax
- **Manufacturing:** Handmade in Italy, designed in Kansas City
- **Positioning:** Luxury market competitive with YSL and Prada
- **Price Range:** $995 - $2,995
- **Shipping:** Free shipping and returns on orders over $500
- **Returns:** 14-day return policy

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📦 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Hosting:** Vercel
- **State Management:** React hooks + Supabase real-time

## 🏗️ Project Structure

```
/
├── components/          # Reusable React components
│   ├── ui/             # UI primitives (buttons, inputs, etc.)
│   ├── Header.tsx      # Main navigation header
│   ├── Footer.tsx      # Site footer
│   ├── Cart.tsx        # Shopping cart
│   ├── ProductGrid.tsx # Product listing
│   └── ...
├── pages/              # Page components (routes)
│   ├── Home.tsx        # Homepage
│   ├── Checkout.tsx    # Checkout process
│   ├── CompanyLogin.tsx # Admin login
│   ├── AdminProducts.tsx # Product management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useSupabaseAuth.ts      # Authentication
│   ├── useSupabaseCart.ts      # Cart management
│   ├── useSupabaseProducts.ts  # Product data
│   └── useSupabaseWishlist.ts  # Wishlist
├── lib/                # Utilities and configuration
│   ├── supabase.ts     # Supabase client setup
│   └── *.sql           # Database schema and seed files
├── styles/             # Global styles
│   └── globals.css     # Tailwind and custom CSS
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

## 🔐 Environment Variables

Create a `.env.local` file with:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard at:
https://app.supabase.com/project/YOUR_PROJECT/settings/api

## 🗄️ Database Setup

The Supabase database includes these main tables:

- `products` - Product catalog
- `cart_items` - Shopping cart (per user)
- `wishlist` - User wishlists
- `orders` - Completed orders
- `product-images` - Storage bucket for images

See `/lib/*.sql` files for complete schema and seed data.

## 👤 Admin Access

- **Admin URL:** `/company-login`
- **Admin Email:** jaquimccarthy@gmail.com
- **Features:**
  - Product management (create, edit, delete)
  - Customer viewing
  - Order management
  - Persistent sessions (until manual logout)

## 🌐 Deployment

### Deploy to Vercel

See detailed guides:
- **Quick Guide:** `/QUICK_DEPLOY.md`
- **Complete Guide:** `/VERCEL_DEPLOYMENT_GUIDE.md`
- **Checklist:** `/DEPLOYMENT_COMPLETE_CHECKLIST.md`

**TL;DR:**
1. Push code to GitHub
2. Import to Vercel (use personal account)
3. Add environment variables
4. Deploy!

## 🛍️ Features

### Customer Features
- ✅ Product browsing and filtering
- ✅ Product search
- ✅ Shopping cart with persistence
- ✅ Wishlist
- ✅ Checkout process
- ✅ Customer account
- ✅ Responsive design (mobile/desktop)

### Admin Features
- ✅ Product management (CRUD)
- ✅ Customer viewing
- ✅ Order management
- ✅ Secure authentication
- ✅ Image upload to Supabase Storage

### Technical Features
- ✅ Real-time database updates
- ✅ Optimistic UI updates
- ✅ Image optimization
- ✅ SEO-friendly routing
- ✅ Type-safe with TypeScript
- ✅ Row Level Security (RLS) on database
- ✅ Environment-based configuration

## 📱 Routes

### Public Routes
- `/` - Homepage
- `/accessories` - Accessories collection
- `/italian-handmade` - About Italian craftsmanship
- `/plant-based-materials` - Materials information
- `/sustainability` - Sustainability commitment
- `/our-technologies` - Technology & innovation
- `/the-vault` - Premium collection
- `/bespoke-design` - Custom design service
- `/client-services` - Customer service
- `/contact-us` - Contact form
- `/delivery-returns` - Shipping & returns info
- `/faq` - Frequently asked questions
- `/size-guide` - Sizing information
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service
- `/checkout` - Checkout process

### Protected Routes
- `/company-login` - Admin login
- `/admin/products` - Product management (admin only)
- `/admin/customers` - Customer management (admin only)

## 🎨 Design System

- **Colors:** Neutral palette with teal accents (signature teal soles)
- **Typography:** Clean, modern sans-serif
- **Layout:** Max-width 1200px, responsive breakpoints
- **Components:** Consistent spacing, hover states, transitions
- **No gradients:** Per brand guidelines

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Supabase Row Level Security (RLS)
- ✅ Admin route protection
- ✅ Secure authentication with Supabase Auth
- ✅ HTTPS in production (Vercel)
- ✅ CORS configuration
- ✅ Input validation

## 🧪 Testing

To test the checkout process:
1. Browse products
2. Add items to cart
3. Go to checkout
4. Fill in shipping information
5. Complete order (creates entry in Supabase `orders` table)

Admin testing:
1. Go to `/company-login`
2. Login with admin credentials
3. Test product creation, editing, deletion
4. View customers and orders

## 📝 Development Notes

- **No mock data:** All data comes from Supabase
- **Real-time updates:** Cart and wishlist update in real-time
- **Persistent sessions:** Admin stays logged in until manual logout
- **Image handling:** Uses Supabase Storage with proper CORS
- **Routing:** Client-side routing with proper fallback (no 404s)

## 🤝 Contributing

This is a private project for TEALHOUSE. For questions or issues, contact the development team.

## 📄 License

Proprietary - TEALHOUSE Technologies

---

**Built with 🌱 for a sustainable future**
