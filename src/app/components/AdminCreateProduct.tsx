import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  description: string;
  materials: string[];
  sizes: number[];
}

export function AdminCreateProduct({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: 'shoes',
    description: '',
    materials: [],
    sizes: []
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [materialInput, setMaterialInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Create preview URLs
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...selectedFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const addMaterial = () => {
    if (materialInput.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, materialInput.trim()]
      }));
      setMaterialInput('');
    }
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    const size = parseInt(sizeInput);
    if (!isNaN(size) && size > 0 && !formData.sizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size].sort((a, b) => a - b)
      }));
      setSizeInput('');
    }
  };

  const removeSize = (size: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        toast.error('Not authenticated. Please login again.');
        return;
      }

      const accessToken = session.access_token;

      // Prepare media metadata array
      const mediaMeta = files.map((file, index) => ({
        filename: file.name,
        content_type: file.type || 'application/octet-stream',
        media_type: file.type.startsWith('video/') ? 'video' : 'image',
        is_primary: index === 0, // First image is primary
        sort_order: index,
      }));

      // Call Edge Function
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d1960f17/products/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            product: formData,
            media: mediaMeta,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error('Create product failed: ' + JSON.stringify(err));
      }

      const result = await resp.json();
      const { product, media } = result;

      // Upload files to signed URLs
      for (let i = 0; i < media.length; i++) {
        const m = media[i];
        const file = files[i];
        const uploadUrl = m.upload_url;

        // PUT the file content
        const uploadResp = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': m.content_type,
          },
          body: file,
        });

        if (!uploadResp.ok) {
          const errorText = await uploadResp.text();
          console.error('Upload failed for', file.name, errorText);
          throw new Error(`Upload failed for ${file.name}`);
        }
      }

      toast.success(`Product "${product.name}" created successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        price: 0,
        category: 'shoes',
        description: '',
        materials: [],
        sizes: []
      });
      setFiles([]);
      setPreviewUrls([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border border-gray-200">
      <div>
        <h2 className="font-['Tinos'] mb-6">Create New Product</h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Price ($)</label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
          required
        >
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="bags">Bags</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
          rows={4}
          required
        />
      </div>

      {/* Materials */}
      <div>
        <label className="block text-sm mb-2">Materials</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={materialInput}
            onChange={(e) => setMaterialInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
            className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            placeholder="e.g., Cactus Leather"
          />
          <button
            type="button"
            onClick={addMaterial}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.materials.map((material, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300"
            >
              <span className="text-sm">{material}</span>
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm mb-2">Sizes</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            placeholder="e.g., 38"
            min="1"
          />
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.sizes.map((size) => (
            <div
              key={size}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300"
            >
              <span className="text-sm">{size}</span>
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm mb-2">Product Images</label>
        <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>

        {/* Preview Images */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover border border-gray-200"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-[#40E0D0] text-white text-xs px-2 py-1">
                    Primary
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || files.length === 0}
          className="flex-1 bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
