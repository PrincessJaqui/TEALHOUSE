import defaultProductImage from 'figma:asset/1317485f37835bf8051d7f5a70fc99044d7df178.png';

export const DEFAULT_PRODUCT_IMAGE = defaultProductImage;

/**
 * Get the product image URL with fallback to default
 */
export function getProductImage(image?: string | null): string {
  return image || DEFAULT_PRODUCT_IMAGE;
}

/**
 * Get the first image from an array with fallback to default
 */
export function getProductImages(images?: string[] | null): string[] {
  if (!images || images.length === 0) {
    return [DEFAULT_PRODUCT_IMAGE];
  }
  return images;
}

/**
 * Get the primary product image (first in array or singular image)
 */
export function getPrimaryProductImage(product: { image?: string; images?: string[] }): string {
  if (product.images && product.images.length > 0) {
    return product.images[0] || DEFAULT_PRODUCT_IMAGE;
  }
  return product.image || DEFAULT_PRODUCT_IMAGE;
}
