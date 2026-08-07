import { useState, useEffect } from 'react';
import { supabase, DbProduct } from '../lib/supabase';
import { Product } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Package, X, Video, Edit, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AdminLayout } from '../components/AdminLayout';
import { exportCsv } from '../lib/csv';
import { productPath } from '../config/taxonomy';
import { useCatalogLists } from '../hooks/useCatalogLists';
import {
  FULFILLMENT_LABELS,
  defaultShipEstimate,
  MEASUREMENT_TYPES,
  type FulfillmentType,
} from '../config/fulfillment';
import {
  CATEGORIES,
  slugify,
  CATEGORY_URL_SEGMENT,
  AUDIENCES,
  MATERIALS,
  SHOE_SIZES,
  DEFAULT_STOCK_KEY,
  totalStock,
  SIZE_SCALES,
  sizeScale as findSizeScale,
  groupStockKey,
  stockKey,
  type SizeGroup,
} from '../config/taxonomy';

// These used to be four private arrays here that disagreed with what the
// storefront pages asked for, which is why five category pages could never
// show a product. They now come from the shared taxonomy.
const AVAILABLE_CATEGORIES = [...CATEGORIES];
const AVAILABLE_MATERIALS = [...MATERIALS];
const AVAILABLE_AUDIENCE = [...AUDIENCES];
import { getPrimaryProductImage } from '../lib/default-image';






/**
 * The real reason, not a generic one.
 *
 * A Supabase error carries message, code, details and hint, and every one of
 * them names the actual column or constraint that refused. This used to be
 * replaced with "Failed to add product", which meant the useful part only
 * existed inside a collapsed console object.
 */
function describeDbError(error: any): string {
  if (!error) return 'Unknown error';

  const parts = [
    error.message,
    error.details,
    error.hint,
    error.code ? `(code ${error.code})` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : String(error);
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  // Stock per size, keyed by size as a string. Sizeless products use "default".
  const [stock, setStock] = useState<Record<string, number>>({});
  // Multi-part sizing. Empty means the product uses the single size row.
  const [sizeGroups, setSizeGroups] = useState<SizeGroup[]>([]);
  const [sizeScale, setSizeScale] = useState<string>('footwear-eu');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('in_stock');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [newColor, setNewColor] = useState('');

  // Materials, colours and size scales are rows now, so new ones can be
  // created here and become available to every product.
  const catalog = useCatalogLists();

  // The scales on offer follow the categories ticked, so Resort Wear offers
  // Alpha and Women's Clothing rather than EU shoe sizes. If the current
  // scale does not suit the new categories, move to one that does.
  const offeredScales = catalog.scalesForCategories(selectedCategories);
  const activeScale =
    offeredScales.find((row) => row.key === sizeScale) ?? offeredScales[0];

  useEffect(() => {
    if (offeredScales.length === 0) return;
    if (offeredScales.some((row) => row.key === sizeScale)) return;
    setSizeScale(offeredScales[0].key);
    setSelectedSizes([]);
  }, [selectedCategories, catalog.scales]);
  const [retainerAmount, setRetainerAmount] = useState('');
  const [preorderShipsOn, setPreorderShipsOn] = useState('');
  const [measurementFields, setMeasurementFields] = useState<string[]>([]);
  const [leadTimeWeeks, setLeadTimeWeeks] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  // Tracks whether the person has taken manual control of a field. Until
  // they do, it keeps following the product name.
  const [seoTouched, setSeoTouched] = useState({ slug: false, title: false });

  /**
   * Typing a product name fills the slug and meta title automatically. Once
   * either is edited by hand it stops following, so a deliberate choice is
   * never overwritten by a later typo fix in the name.
   */
  const handleNameChange = (value: string) => {
    setName(value);
    if (!seoTouched.slug) setSlug(slugify(value));
    if (!seoTouched.title) setMetaTitle(value);
  };
  const [isPublished, setIsPublished] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  // Edit mode - existing images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string>('');
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) throw error;

      if (data) {
        console.log('Raw data from DB:', data);
        const formattedProducts: Product[] = data.map((p: DbProduct) => ({
          id: p.id!,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || p.image || '',
          images: p.images,
          video: p.video,
          categories: p.categories,
          audience: p.audience,
          description: p.description,
          materials: p.materials,
          sizes: p.sizes,
          stock: p.stock ?? {},
          is_bestseller: p.is_bestseller ?? false,
          is_published: p.is_published ?? true,
          created_at: p.created_at
        }));
        console.log('Formatted products:', formattedProducts);
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setDbError(describeDbError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    
    console.log(`Attempting to upload file: ${fileName} to bucket: ${bucket}`);
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }

    console.log(`Upload successful: ${fileName}`);

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log(`Public URL: ${publicUrl}`);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!name || !price || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (selectedAudience.length === 0) {
      toast.error('Please select at least one audience');
      return;
    }

    setUploading(true);

    try {
      // Upload all images
      const imageUrls = await Promise.all(
        imageFiles.map(file => uploadFile(file, 'product-images'))
      );

      // Upload video if present
      let videoUrl: string | undefined;
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'product-images');
      }

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          price: parseFloat(price),
          // The legacy singular column. Everything reads `images` first, but
          // the original schema has this as NOT NULL, so it must be set.
          image: imageUrls[0] ?? '',
          // Legacy singular column, NOT NULL on the original schema.
          // Everything reads `categories`, but this still has to be set.
          category: selectedCategories[0] ?? '',
          images: imageUrls,
          video: videoUrl,
          categories: selectedCategories,
          audience: selectedAudience,
          description,
          materials: selectedMaterials,
          // Parts carry their own sizes, so the single list is cleared rather
          // than left behind to contradict them.
          sizes:
            sizeGroups.length > 0 || selectedCategories.includes('accessories')
              ? null
              : selectedSizes,
          stock: buildStockPayload(),
          is_bestseller: isBestseller,
          is_published: isPublished,
          slug: slug.trim() || null,
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          image_alt: imageAlt.trim() || null,
          size_groups: sizeGroups,
          size_scale: sizeScale,
          colors: selectedColors,
          fulfillment_type: fulfillmentType,
          retainer_amount:
            fulfillmentType === 'made_to_order' && retainerAmount
              ? parseFloat(retainerAmount)
              : null,
          preorder_ships_on:
            fulfillmentType === 'pre_order' && preorderShipsOn ? preorderShipsOn : null,
          measurement_fields:
            fulfillmentType === 'made_to_measure' ? measurementFields : [],
          lead_time_weeks:
            fulfillmentType === 'made_to_measure' && leadTimeWeeks
              ? parseInt(leadTimeWeeks, 10)
              : null
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Product added successfully!');
      
      // Reset form
      resetForm();
      setIsCreateModalOpen(false);

      // Reload products
      loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      const reason = describeDbError(error);
      toast.error(reason);
      setDbError(reason);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Only keep stock entries for sizes still selected, so removing a size does
   * not leave an orphan count behind. Sizeless products get a single count.
   */
  const buildStockPayload = (): Record<string, number> => {
    // Multi-part product: one count per piece, so a bikini carries separate
    // numbers under Top:S and Bottom:M rather than one per pairing.
    // A colour carries its own stock, so every colour multiplies the keys.
    // No colours means one set of keys, exactly as before.
    const colorKeys = selectedColors.length > 0 ? selectedColors : [null];

    if (sizeGroups.length > 0) {
      const payload: Record<string, number> = {};
      for (const color of colorKeys) {
        for (const group of sizeGroups) {
          for (const size of group.sizes) {
            const key = stockKey({ color, group: group.label, size });
            payload[key] = Number(stock[key] ?? 0);
          }
        }
      }
      return payload;
    }

    if (selectedCategories.includes('accessories') || selectedSizes.length === 0) {
      const payload: Record<string, number> = {};
      for (const color of colorKeys) {
        const key = stockKey({ color });
        payload[key] = Number(stock[key] ?? 0);
      }
      return payload;
    }

    const payload: Record<string, number> = {};
    for (const color of colorKeys) {
      for (const size of selectedSizes) {
        const key = stockKey({ color, size: String(size) });
        payload[key] = Number(stock[key] ?? 0);
      }
    }
    return payload;
  };

  /**
   * One row per product. Good for a price list or a catalogue review.
   */
  const exportProducts = () => {
    exportCsv('products', products, [
      { header: 'ID', value: (p) => p.id },
      { header: 'Name', value: (p) => p.name },
      { header: 'Price', value: (p) => Number(p.price).toFixed(2) },
      { header: 'Total stock', value: (p) => totalStock(p) },
      { header: 'Published', value: (p) => (p.is_published === false ? 'No' : 'Yes') },
      { header: 'Bestseller', value: (p) => (p.is_bestseller ? 'Yes' : 'No') },
      { header: 'Categories', value: (p) => (p.categories ?? []).join(' | ') },
      { header: 'Audience', value: (p) => (p.audience ?? []).join(' | ') },
      { header: 'Materials', value: (p) => (p.materials ?? []).join(' | ') },
      { header: 'Sizes', value: (p) => (p.sizes ?? []).join(' | ') },
      { header: 'Images', value: (p) => (p.images ?? []).length },
      { header: 'Description', value: (p) => p.description ?? '' },
    ]);
    toast.success('Products exported');
  };

  /**
   * One row per product and size. This is the one to print for a stock take,
   * because a single row per product hides which size actually ran out.
   */
  const exportInventory = () => {
    const rows: Array<{
      product: Product;
      size: string;
      quantity: number;
    }> = [];

    for (const product of products) {
      const stockMap = product.stock ?? {};
      const keys = Object.keys(stockMap).length
        ? Object.keys(stockMap)
        : (product.sizes ?? []).map(String);

      if (keys.length === 0) {
        rows.push({ product, size: 'default', quantity: 0 });
        continue;
      }

      for (const key of keys) {
        rows.push({ product, size: key, quantity: Number(stockMap[key] ?? 0) });
      }
    }

    rows.sort(
      (a, b) =>
        a.product.name.localeCompare(b.product.name) ||
        a.size.localeCompare(b.size, undefined, { numeric: true })
    );

    exportCsv('inventory', rows, [
      { header: 'Product ID', value: (r) => r.product.id },
      { header: 'Product', value: (r) => r.product.name },
      { header: 'Size', value: (r) => (r.size === 'default' ? 'One size' : r.size) },
      { header: 'Quantity', value: (r) => r.quantity },
      { header: 'Status', value: (r) => (r.quantity > 0 ? 'In stock' : 'Sold out') },
      { header: 'Price', value: (r) => Number(r.product.price).toFixed(2) },
      {
        header: 'Stock value',
        value: (r) => (r.quantity * Number(r.product.price)).toFixed(2),
      },
      { header: 'Published', value: (r) => (r.product.is_published === false ? 'No' : 'Yes') },
    ]);
    toast.success('Inventory exported');
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setSelectedCategories([]);
    setSelectedAudience([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setStock({});
    setSizeGroups([]);
    setSizeScale('footwear-eu');
    setFulfillmentType('in_stock');
    setSelectedColors([]);
    setRetainerAmount('');
    setPreorderShipsOn('');
    setMeasurementFields([]);
    setLeadTimeWeeks('');
    setIsBestseller(false);
    setSlug('');
    setMetaTitle('');
    setMetaDescription('');
    setImageAlt('');
    setSeoTouched({ slug: false, title: false });
    setIsPublished(true);
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFile(null);
    setVideoPreview('');
    setExistingImages([]);
    setExistingVideo('');
    setImagesToDelete([]);
    setEditingProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setSelectedCategories(product.categories);
    setSelectedAudience(product.audience);
    setSelectedMaterials(product.materials);
    setSelectedSizes((product.sizes ?? []).map(String));
    setStock(product.stock ?? {});
    setSizeGroups(product.size_groups ?? []);
    setSizeScale(product.size_scale ?? 'footwear-eu');
    setFulfillmentType((product.fulfillment_type as FulfillmentType) ?? 'in_stock');
    setSelectedColors(product.colors ?? []);
    setRetainerAmount(product.retainer_amount ? String(product.retainer_amount) : '');
    setPreorderShipsOn(product.preorder_ships_on ?? '');
    setMeasurementFields(product.measurement_fields ?? []);
    setLeadTimeWeeks(product.lead_time_weeks ? String(product.lead_time_weeks) : '');
    setIsBestseller(product.is_bestseller ?? false);
    setSlug(product.slug ?? '');
    setMetaTitle(product.meta_title ?? '');
    setMetaDescription(product.meta_description ?? '');
    setImageAlt(product.image_alt ?? '');
    setSeoTouched({ slug: Boolean(product.slug), title: Boolean(product.meta_title) });
    setIsPublished(product.is_published ?? true);
    setExistingImages(product.images || [product.image]);
    setExistingVideo(product.video || '');
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFile(null);
    setVideoPreview('');
    setImagesToDelete([]);
    setIsEditModalOpen(true);
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const removeExistingVideo = () => {
    if (existingVideo) {
      setImagesToDelete(prev => [...prev, existingVideo]);
      setExistingVideo('');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== UPDATE PRODUCT STARTED ===');
    console.log('Editing product:', editingProduct);
    console.log('Existing images:', existingImages);
    console.log('New image files:', imageFiles);
    console.log('Image previews:', imagePreviews);

    if (!editingProduct) {
      console.log('ERROR: No editing product found');
      return;
    }

    // Check if we have at least one image (existing or new)
    if (existingImages.length === 0 && imageFiles.length === 0) {
      console.log('ERROR: No images found');
      toast.error('Please keep or add at least one image');
      return;
    }

    if (!name || !price || !description) {
      console.log('ERROR: Missing required fields', { name, price, description });
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedCategories.length === 0) {
      console.log('ERROR: No categories selected');
      toast.error('Please select at least one category');
      return;
    }

    if (selectedAudience.length === 0) {
      console.log('ERROR: No audience selected');
      toast.error('Please select at least one audience');
      return;
    }

    console.log('✅ All validations passed');
    console.log('Starting upload process...');
    setUploading(true);

    try {
      // Upload new images
      console.log(`Uploading ${imageFiles.length} new images...`);
      const newImageUrls = await Promise.all(
        imageFiles.map(file => uploadFile(file, 'product-images'))
      );
      console.log('✅ New image URLs:', newImageUrls);

      // Combine existing images with new ones
      const allImageUrls = [...existingImages, ...newImageUrls];
      console.log('✅ All image URLs (existing + new):', allImageUrls);

      // Upload new video if present
      let videoUrl: string | undefined = existingVideo || undefined;
      if (videoFile) {
        console.log('Uploading new video...');
        videoUrl = await uploadFile(videoFile, 'product-images');
        console.log('✅ Video URL:', videoUrl);
        // If replacing video, mark old one for deletion
        if (existingVideo && existingVideo !== videoUrl) {
          setImagesToDelete(prev => [...prev, existingVideo]);
        }
      }

      const updateData = {
        name,
        price: parseFloat(price),
        image: allImageUrls[0] ?? '',
        category: selectedCategories[0] ?? '',
        images: allImageUrls,
        video: videoUrl,
        categories: selectedCategories,
        audience: selectedAudience,
        description,
        materials: selectedMaterials,
        // Parts carry their own sizes, so the single list is cleared rather
          // than left behind to contradict them.
          sizes:
            sizeGroups.length > 0 || selectedCategories.includes('accessories')
              ? null
              : selectedSizes,
        stock: buildStockPayload(),
        is_bestseller: isBestseller,
        is_published: isPublished,
        slug: slug.trim() || null,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        image_alt: imageAlt.trim() || null,
        size_groups: sizeGroups,
        size_scale: sizeScale,
        colors: selectedColors,
        fulfillment_type: fulfillmentType,
        retainer_amount:
          fulfillmentType === 'made_to_order' && retainerAmount
            ? parseFloat(retainerAmount)
            : null,
        preorder_ships_on:
          fulfillmentType === 'pre_order' && preorderShipsOn ? preorderShipsOn : null,
        measurement_fields:
          fulfillmentType === 'made_to_measure' ? measurementFields : [],
        lead_time_weeks:
          fulfillmentType === 'made_to_measure' && leadTimeWeeks
            ? parseInt(leadTimeWeeks, 10)
            : null,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Updating product in database with data:', updateData);

      // Update product in database
      const { data: updatedData, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editingProduct.id)
        .select();

      console.log('Database update response:', { updatedData, error });

      if (error) {
        console.error('❌ Database update error:', error);
        throw error;
      }

      console.log('✅ Product updated in database successfully!');

      // Delete removed images from storage
      console.log(`Deleting ${imagesToDelete.length} removed images from storage...`);
      for (const imageUrl of imagesToDelete) {
        if (imageUrl.includes('supabase.co/storage')) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            console.log(`Deleting file: ${fileName}`);
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
          }
        }
      }
      console.log('✅ Removed images deleted');

      toast.success('Product updated successfully!');
      
      // Reset form and close modal
      resetForm();
      setIsEditModalOpen(false);

      // Reload products
      console.log('🔄 Reloading products...');
      await loadProducts();
      console.log('✅ Products reloaded');
    } catch (error) {
      console.error('Error updating product:', error);
      const reason = describeDbError(error);
      toast.error(reason);
      setDbError(reason);
    } finally {
      setUploading(false);
      console.log('=== UPDATE PRODUCT FINISHED ===');
    }
  };

  const handleDelete = async (id: number, images: string[], video?: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Delete from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Try to delete images from storage
      for (const imageUrl of images) {
        if (imageUrl.includes('supabase.co/storage')) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
          }
        }
      }

      // Try to delete video from storage
      if (video && video.includes('supabase.co/storage')) {
        const fileName = video.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('product-images')
            .remove([fileName]);
        }
      }

      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const reason = describeDbError(error);
      toast.error(reason);
      setDbError(reason);
    }
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAudience = (audience: string) => {
    setSelectedAudience(prev => 
      prev.includes(audience)
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        // Keep the scale's own order rather than sorting, so XS S M L stays
        // in that order instead of becoming alphabetical.
        : (activeScale?.sizes ?? []).filter(
            (candidate) => prev.includes(candidate) || candidate === size
          )
    );
  };

  return (
    <AdminLayout
      title="Products"
      description="Manage the TEALHOUSE catalogue"
      actions={
        <>
          <Button variant="outline" onClick={exportInventory} disabled={products.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Inventory CSV
          </Button>
          <Button variant="outline" onClick={exportProducts} disabled={products.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Products CSV
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </>
      }
    >
      <div>

        {dbError && (
          <Alert className="mb-8 bg-yellow-50 border-yellow-200">
            <Package className="h-4 w-4 text-yellow-800" />
            <AlertDescription className="text-yellow-800">
              <strong>Database Error:</strong> {dbError}
              <br />
              <br />
              <br />
              <br />
              The message above names the column or constraint that refused.
              A missing column usually means a migration has not been run yet.{' '}
              <a
                href="https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Open the SQL editor
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Product Catalog */}
        <Card>
          <CardHeader>
            <CardTitle className="font-['Tinos'] text-xl">
              Catalogue ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-neutral-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-10 h-10 mx-auto mb-4 text-gray-300" />
                <p className="text-sm text-gray-600 mb-1">No products yet</p>
                <p className="text-xs text-gray-500 mb-6">
                  Add your first product with photos, sizes and stock
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Product
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={getPrimaryProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.images && product.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs">
                          +{product.images.length - 1} more
                        </div>
                      )}
                      {product.video && (
                        <div className="absolute top-2 left-2 bg-black text-white p-1.5 ">
                          <Video className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1">{product.name}</h3>
                      <p className="text-sm text-neutral-600 mb-2">${product.price.toLocaleString()}</p>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {product.categories.map(cat => (
                          <span key={cat} className="text-xs px-2 py-0.5 bg-neutral-100 capitalize">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {product.audience.map(aud => (
                          <span key={aud} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-800 capitalize">
                            {aud}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(productPath(product), '_blank')}
                          className="flex-1"
                          title="Open the storefront page in a new tab"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(product)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.images || [product.image], product.video)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Product Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to the TEALHOUSE collection</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Aria Mule"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1295.00"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product..."
                  rows={3}
                  required
                />
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Product Images * (multiple)</Label>
                <div className="border-2 border-dashed border-neutral-200 p-6">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-32 object-cover "
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label htmlFor="images" className="block">
                        <Button type="button" variant="outline" size="sm" className="w-full" asChild>
                          <span>Add More Images</span>
                        </Button>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="images" className="cursor-pointer block text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-sm text-neutral-600 mb-1">Click to upload product images</p>
                      <p className="text-xs text-neutral-500">You can select multiple images</p>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label htmlFor="video">Product Video (optional)</Label>
                <div className="border-2 border-dashed border-neutral-200 p-6">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <video 
                          src={videoPreview} 
                          className="w-full h-48 object-cover "
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="video" className="cursor-pointer block text-center">
                      <Video className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-sm text-neutral-600">Click to upload product video</p>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories * (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_CATEGORIES.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 border text-sm transition-colors capitalize ${
                        selectedCategories.includes(category)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <Label>Audience * (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_AUDIENCE.map(audience => (
                    <button
                      key={audience}
                      type="button"
                      onClick={() => toggleAudience(audience)}
                      className={`px-4 py-2 border text-sm transition-colors capitalize ${
                        selectedAudience.includes(audience)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label>Materials *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {catalog.materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => toggleMaterial(material.name)}
                      className={`px-4 py-2 border text-sm transition-colors ${
                        selectedMaterials.includes(material.name)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {material.name}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      // Creating one here makes it available to every product.
                      if (await catalog.addMaterial(newMaterial)) {
                        toggleMaterial(newMaterial.trim());
                        setNewMaterial('');
                      }
                    }}
                    placeholder="Add a material, then Enter"
                    className="px-4 py-2 border border-neutral-200 text-sm"
                  />
                </div>
              </div>

              {/* Sizes */}
              {fulfillmentType !== 'made_to_order' && sizeGroups.length === 0 && !selectedCategories.includes('accessories') && (
                <div className="space-y-2">
                  <Label>Sizing</Label>

                  {/* Only the scales that suit the categories ticked above.
                      Resort Wear offers Alpha and Women's Clothing; Shoes
                      offers the two footwear charts. */}
                  <select
                    value={activeScale?.key ?? ''}
                    onChange={(e) => {
                      setSizeScale(e.target.value);
                      setSelectedSizes([]);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm mb-3"
                  >
                    {offeredScales.map((scale) => (
                      <option key={scale.id} value={scale.key}>
                        {scale.label}
                      </option>
                    ))}
                  </select>

                  {selectedCategories.length === 0 && (
                    <p className="text-xs text-neutral-500 mb-2">
                      Tick a category above to narrow this list.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(activeScale?.sizes ?? []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`min-w-[3.5rem] px-3 py-2 border text-sm transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock. Nothing could sell out before this existed, so the
                  same pair could be ordered an unlimited number of times. */}
              <div>
                <label className="block text-sm mb-2">Stock</label>
                {selectedCategories.includes('accessories') || selectedSizes.length === 0 ? (
                  <input
                    type="number"
                    min={0}
                    value={stock[stockKey({ color: selectedColors[0] ?? null })] ?? 0}
                    onChange={(e) =>
                      setStock({
                        ...stock,
                        [stockKey({ color: selectedColors[0] ?? null })]: Math.max(
                          0,
                          Number(e.target.value)
                        ),
                      })
                    }
                    className="w-32 px-3 py-2 border border-neutral-200 text-sm"
                  />
                ) : (
                  // One row of boxes per colour, since each colour is counted
                  // separately. No colours means a single row, as before.
                  (selectedColors.length > 0 ? selectedColors : [null]).map((color) => (
                    <div key={color ?? 'none'} className="mb-3">
                      {color && (
                        <p className="text-xs text-neutral-600 mb-1">{color}</p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {selectedSizes.map((size) => {
                          const key = stockKey({ color, size: String(size) });
                          return (
                            <div key={size} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-neutral-500">{size}</span>
                              <input
                                type="number"
                                min={0}
                                value={stock[key] ?? 0}
                                onChange={(e) =>
                                  setStock({
                                    ...stock,
                                    [key]: Math.max(0, Number(e.target.value)),
                                  })
                                }
                                className="w-16 px-2 py-2 border border-neutral-200 text-sm text-center"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  Zero means sold out. The database refuses any order that would take a size below zero.
                </p>
              </div>


              {/* Colour. Each one carries its own stock, so adding a colour
                  multiplies the stock boxes below rather than replacing them. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Colours
                </p>
                <div className="flex flex-wrap gap-2">
                  {catalog.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        setSelectedColors((prev) =>
                          prev.includes(color.name)
                            ? prev.filter((c) => c !== color.name)
                            : [...prev, color.name]
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2 border text-sm transition-colors ${
                        selectedColors.includes(color.name)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {color.hex && (
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-300 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      {color.name}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      if (await catalog.addColor(newColor)) {
                        setSelectedColors((prev) => [...prev, newColor.trim()]);
                        setNewColor('');
                      }
                    }}
                    placeholder="Add a colour, then Enter"
                    className="px-4 py-2 border border-neutral-200 text-sm"
                  />
                </div>
                {selectedColors.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-3">
                    Stock is held per colour, so each one below is counted
                    separately. Leave this empty for a piece that comes one way.
                  </p>
                )}
              </div>

              {/* How this piece is sold. In stock behaves as before. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  How this is sold
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(Object.keys(FULFILLMENT_LABELS) as FulfillmentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFulfillmentType(type);
                        if (type === 'pre_order' && !preorderShipsOn) {
                          setPreorderShipsOn(defaultShipEstimate());
                        }
                      }}
                      className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                        fulfillmentType === type
                          ? 'bg-[#008080] text-white'
                          : 'border border-neutral-200 text-neutral-600 hover:border-black'
                      }`}
                    >
                      {FULFILLMENT_LABELS[type]}
                    </button>
                  ))}
                </div>

                {fulfillmentType === 'pre_order' && (
                  <div>
                    <label className="block text-sm mb-2">Estimated ship date</label>
                    <input
                      type="date"
                      value={preorderShipsOn}
                      onChange={(e) => setPreorderShipsOn(e.target.value)}
                      className="px-3 py-2 border border-neutral-200 text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Defaults to six months out. Shown to the customer as a month
                      and year, labelled as an estimate. Stock is not checked, so
                      a pre-order can be bought past zero.
                    </p>
                  </div>
                )}

                {fulfillmentType === 'made_to_measure' && (
                  <div>
                    <label className="block text-sm mb-2">Lead time in weeks</label>
                    <input
                      type="number"
                      min={1}
                      value={leadTimeWeeks}
                      onChange={(e) => setLeadTimeWeeks(e.target.value)}
                      placeholder="6"
                      className="w-28 px-3 py-2 border border-neutral-200 text-sm"
                    />

                    <p className="text-xs text-neutral-500 mt-3">
                      Add a part below for each thing the customer states, then
                      give it a scale. A bra part shows band and cup dropdowns,
                      a waist part shows inches with centimetres, a hip part
                      shows alpha sizes. Nothing here touches stock, because the
                      piece is cut to them. Charged at the price above, with no
                      retainer.
                    </p>
                  </div>
                )}

                {fulfillmentType === 'made_to_order' && (
                  <div>
                    <label className="block text-sm mb-2">Retainer taken at checkout</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={retainerAmount}
                      onChange={(e) => setRetainerAmount(e.target.value)}
                      placeholder="500.00"
                      className="w-40 px-3 py-2 border border-neutral-200 text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      This is what PayPal charges, not the price above. It counts
                      toward the final price, which you invoice once the
                      specification is agreed. The customer gets a specifications
                      box and no size picker. Leave this blank and the piece
                      cannot be ordered.
                    </p>
                  </div>
                )}
              </div>

              {/* Parts. Leave this empty and the product uses the single size
                  row above. A made to measure product uses parts for what the
                  customer states, so this is where its dropdowns come from. Add parts and the customer picks a
                  size for each, with stock held separately per piece. */}
              <div className="border border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Multiple parts
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      For a bikini or a set, where top and bottom are sized separately
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSizeGroups([
                        ...sizeGroups,
                        {
                          label: sizeGroups.length === 0 ? 'Top' : 'Bottom',
                          scale: 'alpha',
                          sizes: findSizeScale('alpha')?.sizes ?? [],
                        },
                      ])
                    }
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add part
                  </Button>
                </div>

                {sizeGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="border-t border-neutral-200 pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={group.label}
                        onChange={(e) => {
                          const next = [...sizeGroups];
                          next[groupIndex] = { ...group, label: e.target.value };
                          setSizeGroups(next);
                        }}
                        placeholder="Top"
                        className="w-40 px-3 py-2 border border-neutral-200 text-sm"
                      />
                      <select
                        value={group.scale ?? 'alpha'}
                        onChange={(e) => {
                          // Changing the scale offers its sizes, it does not
                          // take all of them. Tick the ones you stock.
                          const next = [...sizeGroups];
                          next[groupIndex] = {
                            ...group,
                            scale: e.target.value,
                            sizes: [],
                          };
                          setSizeGroups(next);
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-200 text-sm"
                      >
                        {/* Only the scales that suit the categories ticked
                            above, so shoes offer footwear sizes and apparel
                            offers alpha and US womens. */}
                        {catalog.scalesForCategories(selectedCategories).map((scale) => (
                          <option key={scale.id} value={scale.key}>
                            {scale.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSizeGroups(sizeGroups.filter((_, i) => i !== groupIndex))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>


                    {/* A stocked part offers only the sizes ticked here,
                        because each needs a count. A made to measure part
                        offers the whole scale, so there is nothing to tick. */}
                    <div className={fulfillmentType === 'made_to_measure' ? 'hidden' : 'mb-4'}>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                        Sizes offered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          catalog.scales.find((row) => row.key === (group.scale ?? 'alpha'))
                            ?.sizes ?? []
                        ).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const scaleSizes =
                                catalog.scales.find(
                                  (row) => row.key === (group.scale ?? 'alpha')
                                )?.sizes ?? [];
                              const next = [...sizeGroups];
                              next[groupIndex] = {
                                ...group,
                                // Keep the scale's own order rather than the
                                // order they happened to be clicked in.
                                sizes: group.sizes.includes(size)
                                  ? group.sizes.filter((s) => s !== size)
                                  : scaleSizes.filter(
                                      (candidate) =>
                                        group.sizes.includes(candidate) ||
                                        candidate === size
                                    ),
                              };
                              setSizeGroups(next);
                            }}
                            className={`min-w-[3.5rem] px-3 py-2 border text-sm transition-colors ${
                              group.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {group.sizes.length === 0 && (
                        <p className="text-xs text-neutral-500 mt-2">
                          Tick at least one size, or this part cannot be ordered.
                        </p>
                      )}
                    </div>
                    {/* An optional part can be bought on its own, so it needs
                        a price of its own. Selecting every part charges the
                        product price instead, which is the set price. */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={group.required !== false}
                          onChange={(e) => {
                            const next = [...sizeGroups];
                            next[groupIndex] = { ...group, required: e.target.checked };
                            setSizeGroups(next);
                          }}
                        />
                        Must be bought with the set
                      </label>

                      {group.required === false && (
                        <label className="flex items-center gap-2 text-sm">
                          Price alone
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={group.price ?? ''}
                            onChange={(e) => {
                              const next = [...sizeGroups];
                              next[groupIndex] = {
                                ...group,
                                price: e.target.value ? parseFloat(e.target.value) : null,
                              };
                              setSizeGroups(next);
                            }}
                            className="w-28 px-3 py-2 border border-neutral-200 text-sm"
                          />
                        </label>
                      )}
                    </div>

                    {fulfillmentType !== 'made_to_measure' && selectedColors.length > 0 && (
                      <p className="text-xs text-neutral-500 mb-2">
                        Stock per colour
                      </p>
                    )}

                    {fulfillmentType !== 'made_to_measure' &&
                      (selectedColors.length > 0 ? selectedColors : [null]).map((color) => (
                      <div key={color ?? 'none'} className="mb-3">
                        {color && (
                          <p className="text-xs text-neutral-600 mb-1">{color}</p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {group.sizes.map((size) => {
                            const key = stockKey({ color, group: group.label, size });
                            return (
                              <div key={size} className="flex flex-col items-center gap-1">
                                <span className="text-xs text-neutral-500">{size}</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={stock[key] ?? 0}
                                  onChange={(e) =>
                                    setStock({
                                      ...stock,
                                      [key]: Math.max(0, Number(e.target.value)),
                                    })
                                  }
                                  className="w-16 px-2 py-2 border border-neutral-200 text-sm text-center"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}


                    <input
                      type="text"
                      placeholder="Add a size this scale does not have, then Enter"
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        const extra = (e.target as HTMLInputElement).value
                          .split(',')
                          .map((v) => v.trim())
                          .filter((v) => v && !group.sizes.includes(v));
                        if (extra.length === 0) return;
                        const next = [...sizeGroups];
                        next[groupIndex] = { ...group, sizes: [...group.sizes, ...extra] };
                        setSizeGroups(next);
                        (e.target as HTMLInputElement).value = '';
                      }}
                      className="w-full mt-3 px-3 py-2 border border-neutral-200 text-sm"
                    />
                  </div>
                ))}

                {sizeGroups.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-4">
                    Stock is per piece. Six tops in S and two bottoms in M are two
                    separate counts, and buying one of each takes one from each.
                  </p>
                )}
              </div>

              {/* Search engine listing. None of this existed before, so every
                  page on the site served the same title and description. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Search &amp; sharing
                </p>

                <div className="mb-4">
                  <label className="block text-sm mb-2">URL</label>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-neutral-500 whitespace-nowrap">
                      /products/{CATEGORY_URL_SEGMENT[selectedCategories[0]] ?? 'products'}/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSeoTouched((t) => ({ ...t, slug: true }));
                        setSlug(slugify(e.target.value));
                      }}
                      placeholder="generated-from-name"
                      className="flex-1 px-3 py-2 border border-neutral-200 text-sm"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Changing this after the product is live breaks any link already shared.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Page title{' '}
                    <span className="text-neutral-400">({metaTitle.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => {
                      setSeoTouched((t) => ({ ...t, title: true }));
                      setMetaTitle(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Search description{' '}
                    <span className="text-neutral-400">({metaDescription.length}/160)</span>
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Falls back to the start of the product description"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                  {metaDescription.length > 160 && (
                    <p className="text-xs text-amber-700 mt-1">
                      Over 160 characters. Google will cut it off.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Image description</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Teal-soled cactus leather pump, side view"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Read aloud by screen readers, and how Google Images understands the photo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                  />
                  Show on Best Sellers
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  Published
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={uploading}>
                  <Plus className="w-4 h-4 mr-2" />
                  {uploading ? 'Creating Product...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update the product details in the TEALHOUSE collection</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Aria Mule"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1295.00"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product..."
                  rows={3}
                  required
                />
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <Label htmlFor="edit-images">Product Images * (multiple)</Label>
                <div className="border-2 border-dashed border-neutral-200 p-6">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-neutral-600 mb-2">Existing Images ({existingImages.length})</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {existingImages.map((imageUrl, index) => (
                          <div key={imageUrl} className="relative">
                            <img 
                              src={imageUrl} 
                              alt={`Existing ${index + 1}`} 
                              className="w-full h-32 object-cover "
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imageUrl)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-black text-white text-xs px-1.5 py-0.5 ">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Images */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-neutral-600 mb-2">New Images ({imagePreviews.length})</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={preview} 
                              alt={`New ${index + 1}`} 
                              className="w-full h-32 object-cover "
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <label htmlFor="edit-images" className="block">
                    <Button type="button" variant="outline" size="sm" className="w-full" asChild>
                      <span>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {existingImages.length > 0 || imagePreviews.length > 0 ? 'Add More Images' : 'Upload Images'}
                      </span>
                    </Button>
                    <Input
                      id="edit-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label htmlFor="edit-video">Product Video (optional)</Label>
                <div className="border-2 border-dashed border-neutral-200 p-6">
                  {/* Existing Video */}
                  {existingVideo && !videoPreview && (
                    <div className="mb-4">
                      <p className="text-xs text-neutral-600 mb-2">Existing Video</p>
                      <div className="relative">
                        <video 
                          src={existingVideo} 
                          className="w-full h-48 object-cover "
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeExistingVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* New Video */}
                  {videoPreview ? (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-600 mb-2">New Video (will replace existing)</p>
                      <div className="relative">
                        <video 
                          src={videoPreview} 
                          className="w-full h-48 object-cover "
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : !existingVideo && (
                    <label htmlFor="edit-video" className="cursor-pointer block text-center">
                      <Video className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-sm text-neutral-600">Click to upload product video</p>
                      <Input
                        id="edit-video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {/* Upload new video button if existing video present */}
                  {existingVideo && !videoPreview && (
                    <label htmlFor="edit-video" className="block mt-3">
                      <Button type="button" variant="outline" size="sm" className="w-full" asChild>
                        <span>
                          <Video className="w-4 h-4 mr-2" />
                          Replace Video
                        </span>
                      </Button>
                      <Input
                        id="edit-video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories * (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_CATEGORIES.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 border text-sm transition-colors capitalize ${
                        selectedCategories.includes(category)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <Label>Audience * (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_AUDIENCE.map(audience => (
                    <button
                      key={audience}
                      type="button"
                      onClick={() => toggleAudience(audience)}
                      className={`px-4 py-2 border text-sm transition-colors capitalize ${
                        selectedAudience.includes(audience)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label>Materials *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {catalog.materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => toggleMaterial(material.name)}
                      className={`px-4 py-2 border text-sm transition-colors ${
                        selectedMaterials.includes(material.name)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {material.name}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      // Creating one here makes it available to every product.
                      if (await catalog.addMaterial(newMaterial)) {
                        toggleMaterial(newMaterial.trim());
                        setNewMaterial('');
                      }
                    }}
                    placeholder="Add a material, then Enter"
                    className="px-4 py-2 border border-neutral-200 text-sm"
                  />
                </div>
              </div>

              {/* Sizes */}
              {fulfillmentType !== 'made_to_order' && sizeGroups.length === 0 && !selectedCategories.includes('accessories') && (
                <div className="space-y-2">
                  <Label>Sizing</Label>

                  {/* Only the scales that suit the categories ticked above.
                      Resort Wear offers Alpha and Women's Clothing; Shoes
                      offers the two footwear charts. */}
                  <select
                    value={activeScale?.key ?? ''}
                    onChange={(e) => {
                      setSizeScale(e.target.value);
                      setSelectedSizes([]);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm mb-3"
                  >
                    {offeredScales.map((scale) => (
                      <option key={scale.id} value={scale.key}>
                        {scale.label}
                      </option>
                    ))}
                  </select>

                  {selectedCategories.length === 0 && (
                    <p className="text-xs text-neutral-500 mb-2">
                      Tick a category above to narrow this list.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(activeScale?.sizes ?? []).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`min-w-[3.5rem] px-3 py-2 border text-sm transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock. Nothing could sell out before this existed, so the
                  same pair could be ordered an unlimited number of times. */}
              <div>
                <label className="block text-sm mb-2">Stock</label>
                {selectedCategories.includes('accessories') || selectedSizes.length === 0 ? (
                  <input
                    type="number"
                    min={0}
                    value={stock[stockKey({ color: selectedColors[0] ?? null })] ?? 0}
                    onChange={(e) =>
                      setStock({
                        ...stock,
                        [stockKey({ color: selectedColors[0] ?? null })]: Math.max(
                          0,
                          Number(e.target.value)
                        ),
                      })
                    }
                    className="w-32 px-3 py-2 border border-neutral-200 text-sm"
                  />
                ) : (
                  // One row of boxes per colour, since each colour is counted
                  // separately. No colours means a single row, as before.
                  (selectedColors.length > 0 ? selectedColors : [null]).map((color) => (
                    <div key={color ?? 'none'} className="mb-3">
                      {color && (
                        <p className="text-xs text-neutral-600 mb-1">{color}</p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {selectedSizes.map((size) => {
                          const key = stockKey({ color, size: String(size) });
                          return (
                            <div key={size} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-neutral-500">{size}</span>
                              <input
                                type="number"
                                min={0}
                                value={stock[key] ?? 0}
                                onChange={(e) =>
                                  setStock({
                                    ...stock,
                                    [key]: Math.max(0, Number(e.target.value)),
                                  })
                                }
                                className="w-16 px-2 py-2 border border-neutral-200 text-sm text-center"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  Zero means sold out. The database refuses any order that would take a size below zero.
                </p>
              </div>


              {/* Colour. Each one carries its own stock, so adding a colour
                  multiplies the stock boxes below rather than replacing them. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Colours
                </p>
                <div className="flex flex-wrap gap-2">
                  {catalog.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        setSelectedColors((prev) =>
                          prev.includes(color.name)
                            ? prev.filter((c) => c !== color.name)
                            : [...prev, color.name]
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2 border text-sm transition-colors ${
                        selectedColors.includes(color.name)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {color.hex && (
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-300 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      {color.name}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      if (await catalog.addColor(newColor)) {
                        setSelectedColors((prev) => [...prev, newColor.trim()]);
                        setNewColor('');
                      }
                    }}
                    placeholder="Add a colour, then Enter"
                    className="px-4 py-2 border border-neutral-200 text-sm"
                  />
                </div>
                {selectedColors.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-3">
                    Stock is held per colour, so each one below is counted
                    separately. Leave this empty for a piece that comes one way.
                  </p>
                )}
              </div>

              {/* How this piece is sold. In stock behaves as before. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  How this is sold
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(Object.keys(FULFILLMENT_LABELS) as FulfillmentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFulfillmentType(type);
                        if (type === 'pre_order' && !preorderShipsOn) {
                          setPreorderShipsOn(defaultShipEstimate());
                        }
                      }}
                      className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                        fulfillmentType === type
                          ? 'bg-[#008080] text-white'
                          : 'border border-neutral-200 text-neutral-600 hover:border-black'
                      }`}
                    >
                      {FULFILLMENT_LABELS[type]}
                    </button>
                  ))}
                </div>

                {fulfillmentType === 'pre_order' && (
                  <div>
                    <label className="block text-sm mb-2">Estimated ship date</label>
                    <input
                      type="date"
                      value={preorderShipsOn}
                      onChange={(e) => setPreorderShipsOn(e.target.value)}
                      className="px-3 py-2 border border-neutral-200 text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Defaults to six months out. Shown to the customer as a month
                      and year, labelled as an estimate. Stock is not checked, so
                      a pre-order can be bought past zero.
                    </p>
                  </div>
                )}

                {fulfillmentType === 'made_to_measure' && (
                  <div>
                    <label className="block text-sm mb-2">Lead time in weeks</label>
                    <input
                      type="number"
                      min={1}
                      value={leadTimeWeeks}
                      onChange={(e) => setLeadTimeWeeks(e.target.value)}
                      placeholder="6"
                      className="w-28 px-3 py-2 border border-neutral-200 text-sm"
                    />

                    <p className="text-xs text-neutral-500 mt-3">
                      Add a part below for each thing the customer states, then
                      give it a scale. A bra part shows band and cup dropdowns,
                      a waist part shows inches with centimetres, a hip part
                      shows alpha sizes. Nothing here touches stock, because the
                      piece is cut to them. Charged at the price above, with no
                      retainer.
                    </p>
                  </div>
                )}

                {fulfillmentType === 'made_to_order' && (
                  <div>
                    <label className="block text-sm mb-2">Retainer taken at checkout</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={retainerAmount}
                      onChange={(e) => setRetainerAmount(e.target.value)}
                      placeholder="500.00"
                      className="w-40 px-3 py-2 border border-neutral-200 text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      This is what PayPal charges, not the price above. It counts
                      toward the final price, which you invoice once the
                      specification is agreed. The customer gets a specifications
                      box and no size picker. Leave this blank and the piece
                      cannot be ordered.
                    </p>
                  </div>
                )}
              </div>

              {/* Parts. Leave this empty and the product uses the single size
                  row above. A made to measure product uses parts for what the
                  customer states, so this is where its dropdowns come from. Add parts and the customer picks a
                  size for each, with stock held separately per piece. */}
              <div className="border border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Multiple parts
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      For a bikini or a set, where top and bottom are sized separately
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSizeGroups([
                        ...sizeGroups,
                        {
                          label: sizeGroups.length === 0 ? 'Top' : 'Bottom',
                          scale: 'alpha',
                          sizes: findSizeScale('alpha')?.sizes ?? [],
                        },
                      ])
                    }
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add part
                  </Button>
                </div>

                {sizeGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="border-t border-neutral-200 pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={group.label}
                        onChange={(e) => {
                          const next = [...sizeGroups];
                          next[groupIndex] = { ...group, label: e.target.value };
                          setSizeGroups(next);
                        }}
                        placeholder="Top"
                        className="w-40 px-3 py-2 border border-neutral-200 text-sm"
                      />
                      <select
                        value={group.scale ?? 'alpha'}
                        onChange={(e) => {
                          // Changing the scale offers its sizes, it does not
                          // take all of them. Tick the ones you stock.
                          const next = [...sizeGroups];
                          next[groupIndex] = {
                            ...group,
                            scale: e.target.value,
                            sizes: [],
                          };
                          setSizeGroups(next);
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-200 text-sm"
                      >
                        {/* Only the scales that suit the categories ticked
                            above, so shoes offer footwear sizes and apparel
                            offers alpha and US womens. */}
                        {catalog.scalesForCategories(selectedCategories).map((scale) => (
                          <option key={scale.id} value={scale.key}>
                            {scale.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSizeGroups(sizeGroups.filter((_, i) => i !== groupIndex))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>


                    {/* A stocked part offers only the sizes ticked here,
                        because each needs a count. A made to measure part
                        offers the whole scale, so there is nothing to tick. */}
                    <div className={fulfillmentType === 'made_to_measure' ? 'hidden' : 'mb-4'}>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                        Sizes offered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          catalog.scales.find((row) => row.key === (group.scale ?? 'alpha'))
                            ?.sizes ?? []
                        ).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const scaleSizes =
                                catalog.scales.find(
                                  (row) => row.key === (group.scale ?? 'alpha')
                                )?.sizes ?? [];
                              const next = [...sizeGroups];
                              next[groupIndex] = {
                                ...group,
                                // Keep the scale's own order rather than the
                                // order they happened to be clicked in.
                                sizes: group.sizes.includes(size)
                                  ? group.sizes.filter((s) => s !== size)
                                  : scaleSizes.filter(
                                      (candidate) =>
                                        group.sizes.includes(candidate) ||
                                        candidate === size
                                    ),
                              };
                              setSizeGroups(next);
                            }}
                            className={`min-w-[3.5rem] px-3 py-2 border text-sm transition-colors ${
                              group.sizes.includes(size)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {group.sizes.length === 0 && (
                        <p className="text-xs text-neutral-500 mt-2">
                          Tick at least one size, or this part cannot be ordered.
                        </p>
                      )}
                    </div>
                    {/* An optional part can be bought on its own, so it needs
                        a price of its own. Selecting every part charges the
                        product price instead, which is the set price. */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={group.required !== false}
                          onChange={(e) => {
                            const next = [...sizeGroups];
                            next[groupIndex] = { ...group, required: e.target.checked };
                            setSizeGroups(next);
                          }}
                        />
                        Must be bought with the set
                      </label>

                      {group.required === false && (
                        <label className="flex items-center gap-2 text-sm">
                          Price alone
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={group.price ?? ''}
                            onChange={(e) => {
                              const next = [...sizeGroups];
                              next[groupIndex] = {
                                ...group,
                                price: e.target.value ? parseFloat(e.target.value) : null,
                              };
                              setSizeGroups(next);
                            }}
                            className="w-28 px-3 py-2 border border-neutral-200 text-sm"
                          />
                        </label>
                      )}
                    </div>

                    {fulfillmentType !== 'made_to_measure' && selectedColors.length > 0 && (
                      <p className="text-xs text-neutral-500 mb-2">
                        Stock per colour
                      </p>
                    )}

                    {fulfillmentType !== 'made_to_measure' &&
                      (selectedColors.length > 0 ? selectedColors : [null]).map((color) => (
                      <div key={color ?? 'none'} className="mb-3">
                        {color && (
                          <p className="text-xs text-neutral-600 mb-1">{color}</p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          {group.sizes.map((size) => {
                            const key = stockKey({ color, group: group.label, size });
                            return (
                              <div key={size} className="flex flex-col items-center gap-1">
                                <span className="text-xs text-neutral-500">{size}</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={stock[key] ?? 0}
                                  onChange={(e) =>
                                    setStock({
                                      ...stock,
                                      [key]: Math.max(0, Number(e.target.value)),
                                    })
                                  }
                                  className="w-16 px-2 py-2 border border-neutral-200 text-sm text-center"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}


                    <input
                      type="text"
                      placeholder="Add a size this scale does not have, then Enter"
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        const extra = (e.target as HTMLInputElement).value
                          .split(',')
                          .map((v) => v.trim())
                          .filter((v) => v && !group.sizes.includes(v));
                        if (extra.length === 0) return;
                        const next = [...sizeGroups];
                        next[groupIndex] = { ...group, sizes: [...group.sizes, ...extra] };
                        setSizeGroups(next);
                        (e.target as HTMLInputElement).value = '';
                      }}
                      className="w-full mt-3 px-3 py-2 border border-neutral-200 text-sm"
                    />
                  </div>
                ))}

                {sizeGroups.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-4">
                    Stock is per piece. Six tops in S and two bottoms in M are two
                    separate counts, and buying one of each takes one from each.
                  </p>
                )}
              </div>

              {/* Search engine listing. None of this existed before, so every
                  page on the site served the same title and description. */}
              <div className="border border-neutral-200 p-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Search &amp; sharing
                </p>

                <div className="mb-4">
                  <label className="block text-sm mb-2">URL</label>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-neutral-500 whitespace-nowrap">
                      /products/{CATEGORY_URL_SEGMENT[selectedCategories[0]] ?? 'products'}/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSeoTouched((t) => ({ ...t, slug: true }));
                        setSlug(slugify(e.target.value));
                      }}
                      placeholder="generated-from-name"
                      className="flex-1 px-3 py-2 border border-neutral-200 text-sm"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Changing this after the product is live breaks any link already shared.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Page title{' '}
                    <span className="text-neutral-400">({metaTitle.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => {
                      setSeoTouched((t) => ({ ...t, title: true }));
                      setMetaTitle(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Search description{' '}
                    <span className="text-neutral-400">({metaDescription.length}/160)</span>
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Falls back to the start of the product description"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                  {metaDescription.length > 160 && (
                    <p className="text-xs text-amber-700 mt-1">
                      Over 160 characters. Google will cut it off.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Image description</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Teal-soled cactus leather pump, side view"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Read aloud by screen readers, and how Google Images understands the photo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                  />
                  Show on Best Sellers
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  Published
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={uploading}>
                  <Edit className="w-4 h-4 mr-2" />
                  {uploading ? 'Updating Product...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
