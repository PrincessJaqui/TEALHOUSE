import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * The catalogue lists: materials, colours and size scales.
 *
 * These were hardcoded arrays. They are rows now, so new ones can be created
 * from the product form and become available to every product without a
 * deploy. Reads are public, writes are admin only, enforced by RLS.
 */

export interface Material {
  id: number;
  name: string;
  is_active: boolean;
  sort_order: number;
}

export interface Color {
  id: number;
  name: string;
  hex: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface SizeScaleRow {
  id: number;
  key: string;
  label: string;
  sizes: string[];
  /** Which product categories this scale is offered for. Empty means all. */
  categories: string[];
  is_active: boolean;
  sort_order: number;
}

export function useCatalogLists() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [scales, setScales] = useState<SizeScaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [m, c, s] = await Promise.all([
        supabase
          .from('materials')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
          .order('name'),
        supabase
          .from('colors')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
          .order('name'),
        supabase
          .from('size_scales')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
      ]);

      if (m.data) setMaterials(m.data as Material[]);
      if (c.data) setColors(c.data as Color[]);
      if (s.data) setScales(s.data as SizeScaleRow[]);
    } catch (error) {
      console.error('Error loading catalogue lists:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMaterial = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const { error } = await supabase.from('materials').insert({ name: trimmed });
    // A duplicate is not a failure from the user's point of view: the
    // material they wanted now exists either way.
    if (error && error.code !== '23505') {
      console.error('Error adding material:', error);
      return false;
    }
    await load();
    return true;
  };

  const addColor = async (name: string, hex?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const { error } = await supabase
      .from('colors')
      .insert({ name: trimmed, hex: hex?.trim() || null });
    if (error && error.code !== '23505') {
      console.error('Error adding colour:', error);
      return false;
    }
    await load();
    return true;
  };

  const addScale = async (label: string, sizes: string[], categories: string[]) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel || sizes.length === 0) return false;

    const key = trimmedLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { error } = await supabase
      .from('size_scales')
      .insert({ key, label: trimmedLabel, sizes, categories, sort_order: 100 });
    if (error && error.code !== '23505') {
      console.error('Error adding size scale:', error);
      return false;
    }
    await load();
    return true;
  };

  /** Archive rather than delete, so products already using it keep their value. */
  const archive = async (table: 'materials' | 'colors' | 'size_scales', id: number) => {
    const { error } = await supabase
      .from(table)
      .update({ is_active: false })
      .eq('id', id);
    if (error) {
      console.error('Error archiving:', error);
      return false;
    }
    await load();
    return true;
  };

  /**
   * Scales offered for the categories a product is tagged with. A scale with
   * no categories is general and always offered, which is what One Size is.
   */
  const scalesForCategories = (categories: string[]): SizeScaleRow[] => {
    if (categories.length === 0) return scales;
    return scales.filter(
      (scale) =>
        scale.categories.length === 0 ||
        scale.categories.some((c) => categories.includes(c))
    );
  };

  return {
    materials,
    colors,
    scales,
    loading,
    reload: load,
    addMaterial,
    addColor,
    addScale,
    archive,
    scalesForCategories,
  };
}
