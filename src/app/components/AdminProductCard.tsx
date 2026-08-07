import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  ExternalLink,
  Copy,
  Trash2,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../App';
import { getPrimaryProductImage } from '../lib/default-image';

/**
 * One product in the admin catalogue.
 *
 * Extracted from AdminProducts because each card now holds its own state:
 * which image is showing. Keeping that inside the list would have meant one
 * shared index for every card.
 */

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onClone: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function AdminProductCard({
  product,
  onEdit,
  onView,
  onClone,
  onDelete,
}: AdminProductCardProps) {
  const images = (product.images ?? []).filter(Boolean);
  const gallery = images.length > 0 ? images : [getPrimaryProductImage(product)];

  const [index, setIndex] = useState(0);
  const hasMany = gallery.length > 1;

  // Wraps at both ends, so you can keep clicking in one direction rather
  // than hitting a dead arrow.
  const step = (delta: number) =>
    setIndex((current) => (current + delta + gallery.length) % gallery.length);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative group bg-gray-50">
        <img
          src={gallery[index]}
          alt={product.image_alt || product.name}
          className="w-full h-full object-cover"
        />

        {product.video && (
          <div className="absolute top-2 left-2 bg-black text-white p-1.5">
            <Video className="w-4 h-4" />
          </div>
        )}

        {/* Everything you can do to this product, in one place. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Actions for ${product.name}`}
              className="absolute top-2 right-2 bg-white/95 border border-gray-200 p-1.5 hover:border-black transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(product)}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClone(product)}>
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(product)}
              className="text-red-600 focus:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 border border-gray-200 p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:border-black transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 border border-gray-200 p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:border-black transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Which of how many, without covering the piece. */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((image, i) => (
                <button
                  key={image + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1} of ${gallery.length}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? 'bg-black' : 'bg-white border border-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1">{product.name}</h3>
        <p className="text-sm text-neutral-600 mb-2">
          ${product.price.toLocaleString()}
        </p>

        <div className="flex gap-1 flex-wrap">
          {(product.categories ?? []).map((category) => (
            <span
              key={category}
              className="text-xs px-2 py-0.5 bg-neutral-100 capitalize"
            >
              {category}
            </span>
          ))}
          {(product.audience ?? []).map((audience) => (
            <span
              key={audience}
              className="text-xs px-2 py-0.5 bg-teal-50 text-teal-800 capitalize"
            >
              {audience}
            </span>
          ))}
        </div>

        {product.is_published === false && (
          <p className="text-xs uppercase tracking-wider text-gray-500 mt-3">
            Not published
          </p>
        )}
      </CardContent>
    </Card>
  );
}
