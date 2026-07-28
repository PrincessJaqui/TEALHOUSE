import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d1960f17/health", (c) => {
  return c.json({ status: "ok" });
});

// Customer management endpoints

// GET all customers
app.get("/make-server-d1960f17/customers", async (c) => {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error listing users:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ users });
  } catch (error: any) {
    console.error('Error in GET /customers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST ban user
app.post("/make-server-d1960f17/customers/:id/ban", async (c) => {
  try {
    const userId = c.req.param('id');
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: '876000h' // Ban for 100 years (effectively permanent)
    });

    if (error) {
      console.error('Error banning user:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in POST /customers/:id/ban:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST unban user
app.post("/make-server-d1960f17/customers/:id/unban", async (c) => {
  try {
    const userId = c.req.param('id');
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: 'none'
    });

    if (error) {
      console.error('Error unbanning user:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in POST /customers/:id/unban:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE user
app.delete("/make-server-d1960f17/customers/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in DELETE /customers/:id:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Product creation endpoint with media upload support
app.post("/make-server-d1960f17/products/create", async (c) => {
  try {
    const BUCKET = "product-media";
    
    // Authenticate: expect Authorization: Bearer <access_token>
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return c.json({ error: "Missing access token" }, 401);
    }

    // Validate user by calling Supabase auth endpoint
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user?.id) {
      return c.json({ error: "Invalid access token", detail: userError?.message }, 401);
    }
    
    const userId = user.id;

    // Parse payload
    const payload = await c.req.json().catch(() => null);
    if (!payload || !payload.product) {
      return c.json({ error: "Invalid payload" }, 400);
    }

    // Sanitize product fields
    const allowedProductKeys = [
      "name", "price", "category", "description", "created_at", "updated_at",
      "image", "video_url", "categories", "audience", "materials", "sizes"
    ];
    
    const productData: Record<string, any> = { ...payload.product };
    productData.owner = userId;
    
    // Keep only allowed keys
    Object.keys(productData).forEach((k) => {
      if (!allowedProductKeys.includes(k) && k !== "owner") {
        delete productData[k];
      }
    });

    // Insert product
    const { data: insertedProducts, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select();

    if (insertError || !insertedProducts || insertedProducts.length === 0) {
      console.error('Error inserting product:', insertError);
      return c.json({ error: "Failed to insert product", detail: insertError?.message }, 500);
    }

    const createdProduct = insertedProducts[0];
    const productId = createdProduct.id;

    // Insert product_media placeholders and generate signed URLs
    const media = payload.media || [];
    const insertedMediaRecords: any[] = [];

    for (const m of media) {
      // Normalize filename and build storage path
      const safeFilename = m.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${productId}/${Date.now()}_${safeFilename}`;

      // Insert placeholder row
      const mediaRow = {
        product_id: productId,
        media_type: m.media_type,
        storage_path: `${BUCKET}/${storagePath}`,
        public_url: null,
        alt_text: null,
        is_primary: m.is_primary || false,
        sort_order: m.sort_order || 0,
      };

      const { data: mediaInserted, error: mediaError } = await supabaseAdmin
        .from('product_media')
        .insert(mediaRow)
        .select()
        .single();

      if (mediaError || !mediaInserted) {
        console.error('Error inserting media row:', mediaError);
        return c.json({ error: "Failed to insert media row", detail: mediaError?.message }, 500);
      }

      // Generate signed upload URL
      const { data: signedData, error: signError } = await supabaseAdmin
        .storage
        .from(BUCKET)
        .createSignedUploadUrl(storagePath);

      if (signError || !signedData) {
        console.error('Error creating signed upload URL:', signError);
        return c.json({ error: "Failed to sign upload URL", detail: signError?.message }, 500);
      }

      insertedMediaRecords.push({
        db: mediaInserted,
        upload_url: signedData.signedUrl,
        storage_path: storagePath,
        content_type: m.content_type,
      });
    }

    // Return created product and signed URLs
    return c.json({
      product: createdProduct,
      media: insertedMediaRecords,
    });
  } catch (err: any) {
    console.error('Error in POST /products/create:', err);
    return c.json({ error: "Internal server error", detail: String(err) }, 500);
  }
});

Deno.serve(app.fetch);