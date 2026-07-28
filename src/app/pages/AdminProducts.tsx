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
import { Plus, Trash2, Upload, Package, X, Video, Edit, Image as ImageIcon, Database } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AdminNav } from '../components/AdminNav';
import {
  CATEGORIES,
  AUDIENCES,
  MATERIALS,
  SHOE_SIZES,
  DEFAULT_STOCK_KEY,
} from '../config/taxonomy';

// These used to be four private arrays here that disagreed with what the
// storefront pages asked for, which is why five category pages could never
// show a product. They now come from the shared taxonomy.
const AVAILABLE_CATEGORIES = [...CATEGORIES];
const AVAILABLE_MATERIALS = [...MATERIALS];
const AVAILABLE_AUDIENCE = [...AUDIENCES];
const AVAILABLE_SIZES = [...SHOE_SIZES];
import { getPrimaryProductImage } from '../lib/default-image';
import { seedProducts } from '../utils/seed-products';





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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['shoes']);
  const [selectedAudience, setSelectedAudience] = useState<string[]>(['women']);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Cactus Leather', 'Natural Rubber']);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([36, 37, 38, 39, 40, 41]);
  // Stock per size, keyed by size as a string. Sizeless products use "default".
  const [stock, setStock] = useState<Record<string, number>>({});
  const [isBestseller, setIsBestseller] = useState(false);
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
      setDbError('Failed to load products');
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

    if (selectedMaterials.length === 0) {
      toast.error('Please select at least one material');
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
          images: imageUrls,
          video: videoUrl,
          categories: selectedCategories,
          audience: selectedAudience,
          description,
          materials: selectedMaterials,
          sizes: selectedCategories.includes('accessories') ? null : selectedSizes,
          stock: buildStockPayload(),
          is_bestseller: isBestseller,
          is_published: isPublished
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
      toast.error('Failed to add product');
      setDbError('Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Only keep stock entries for sizes still selected, so removing a size does
   * not leave an orphan count behind. Sizeless products get a single count.
   */
  const buildStockPayload = (): Record<string, number> => {
    if (selectedCategories.includes('accessories') || selectedSizes.length === 0) {
      return { [DEFAULT_STOCK_KEY]: Number(stock[DEFAULT_STOCK_KEY] ?? 0) };
    }
    const payload: Record<string, number> = {};
    for (const size of selectedSizes) {
      payload[String(size)] = Number(stock[String(size)] ?? 0);
    }
    return payload;
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setSelectedCategories(['shoes']);
    setSelectedAudience(['women']);
    setSelectedMaterials(['Cactus Leather', 'Natural Rubber']);
    setSelectedSizes([36, 37, 38, 39, 40, 41]);
    setStock({});
    setIsBestseller(false);
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
    setSelectedSizes(product.sizes || []);
    setStock(product.stock ?? {});
    setIsBestseller(product.is_bestseller ?? false);
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

    if (selectedMaterials.length === 0) {
      console.log('ERROR: No materials selected');
      toast.error('Please select at least one material');
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
        images: allImageUrls,
        video: videoUrl,
        categories: selectedCategories,
        audience: selectedAudience,
        description,
        materials: selectedMaterials,
        sizes: selectedCategories.includes('accessories') ? null : selectedSizes,
        stock: buildStockPayload(),
        is_bestseller: isBestseller,
        is_published: isPublished,
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
      console.error('❌ Error updating product:', error);
      toast.error('Failed to update product');
      setDbError('Failed to update product');
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
      toast.error('Failed to delete product');
      setDbError('Failed to delete product');
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

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleSeedProducts = async () => {
    setLoading(true);
    toast.loading('Updating products...');
    const result = await seedProducts();
    if (result.success) {
      toast.dismiss();
      toast.success('Products updated successfully!');
      await loadProducts();
    } else {
      toast.dismiss();
      toast.error('Failed to seed products');
    }
    setLoading(false);
  };

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Product Management</h1>
            <p className="text-neutral-600">Manage the TEALHOUSE product catalog</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Product
          </Button>
        </div>

        {dbError && (
          <Alert className="mb-8 bg-yellow-50 border-yellow-200">
            <Package className="h-4 w-4 text-yellow-800" />
            <AlertDescription className="text-yellow-800">
              <strong>Database Error:</strong> {dbError}
              <br />
              <br />
              <strong>To fix this:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Go to your <a href="https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/editor" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Supabase SQL Editor</a></li>
                <li>Run the updated schema SQL to add support for multiple images and video</li>
                <li>Refresh this page</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Product Catalog */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog ({products.length})</CardTitle>
            <CardDescription>All products in the TEALHOUSE collection</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-neutral-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p className="mb-4">No products found. Add sample products to get started!</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleSeedProducts}>
                    <Database className="w-4 h-4 mr-2" />
                    Add Sample Products (Lexi, Kyla, Christine, Kyle)
                  </Button>
                </div>
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
                        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-xs">
                          +{product.images.length - 1} more
                        </div>
                      )}
                      {product.video && (
                        <div className="absolute top-2 left-2 bg-black text-white p-1.5 rounded">
                          <Video className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1">{product.name}</h3>
                      <p className="text-sm text-neutral-600 mb-2">${product.price.toLocaleString()}</p>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {product.categories.map(cat => (
                          <span key={cat} className="text-xs px-2 py-0.5 bg-neutral-100 rounded capitalize">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {product.audience.map(aud => (
                          <span key={aud} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-800 rounded capitalize">
                            {aud}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
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
                  onChange={(e) => setName(e.target.value)}
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
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <video 
                          src={videoPreview} 
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors capitalize ${
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
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors capitalize ${
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
                  {AVAILABLE_MATERIALS.map(material => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => toggleMaterial(material)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedMaterials.includes(material)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              {!selectedCategories.includes('accessories') && (
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVAILABLE_SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
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
                    value={stock[DEFAULT_STOCK_KEY] ?? 0}
                    onChange={(e) =>
                      setStock({ ...stock, [DEFAULT_STOCK_KEY]: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-32 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {selectedSizes.map((size) => (
                      <div key={size} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-neutral-500">{size}</span>
                        <input
                          type="number"
                          min={0}
                          value={stock[String(size)] ?? 0}
                          onChange={(e) =>
                            setStock({ ...stock, [String(size)]: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-16 px-2 py-2 border border-neutral-200 rounded-lg text-sm text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  Zero means sold out. The database refuses any order that would take a size below zero.
                </p>
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
                  onChange={(e) => setName(e.target.value)}
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
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6">
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
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imageUrl)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-black text-white text-xs px-1.5 py-0.5 rounded">
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
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6">
                  {/* Existing Video */}
                  {existingVideo && !videoPreview && (
                    <div className="mb-4">
                      <p className="text-xs text-neutral-600 mb-2">Existing Video</p>
                      <div className="relative">
                        <video 
                          src={existingVideo} 
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeExistingVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors capitalize ${
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
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors capitalize ${
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
                  {AVAILABLE_MATERIALS.map(material => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => toggleMaterial(material)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedMaterials.includes(material)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              {!selectedCategories.includes('accessories') && (
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVAILABLE_SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
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
                    value={stock[DEFAULT_STOCK_KEY] ?? 0}
                    onChange={(e) =>
                      setStock({ ...stock, [DEFAULT_STOCK_KEY]: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-32 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {selectedSizes.map((size) => (
                      <div key={size} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-neutral-500">{size}</span>
                        <input
                          type="number"
                          min={0}
                          value={stock[String(size)] ?? 0}
                          onChange={(e) =>
                            setStock({ ...stock, [String(size)]: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-16 px-2 py-2 border border-neutral-200 rounded-lg text-sm text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  Zero means sold out. The database refuses any order that would take a size below zero.
                </p>
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
    </>
  );
}