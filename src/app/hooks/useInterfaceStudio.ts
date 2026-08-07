import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Landing page content.
 *
 * Six fixed sections, each a row carrying a jsonb blob. Fixed for now, but
 * every row has a sort_order so reordering later needs no migration.
 */

export type SectionKey =
  | 'hero'
  | 'editorial'
  | 'split_one'
  | 'carousel'
  | 'split_two'
  | 'spotlight';

export interface StudioSection {
  id: number;
  section: SectionKey;
  sort_order: number;
  is_active: boolean;
  content: Record<string, any>;
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Hero',
  editorial: 'Editorial note',
  split_one: 'Two panels, upper',
  carousel: 'Featured carousel',
  split_two: 'Two panels, lower',
  spotlight: 'Featured spotlight',
};

export const SECTION_HELP: Record<SectionKey, string> = {
  hero: 'The film or image at the top. Desktop and mobile are set separately, each with a still image used while the video loads and on any device that will not play it.',
  editorial: 'A short line of type with a link, sitting on white between the imagery.',
  split_one: 'Two images side by side, each with its own link.',
  carousel: 'Your featured pieces in a strip that scrolls left and right.',
  split_two: 'Two more images side by side, further down the page.',
  spotlight: 'One featured piece at a time, centred, moving on by itself.',
};

export function useInterfaceStudio() {
  const [sections, setSections] = useState<StudioSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('interface_studio')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setSections((data ?? []) as StudioSection[]);
    } catch (error) {
      console.error('Error loading interface studio:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const get = (key: SectionKey): Record<string, any> =>
    sections.find((s) => s.section === key)?.content ?? {};

  const isActive = (key: SectionKey): boolean =>
    sections.find((s) => s.section === key)?.is_active ?? false;

  const save = async (
    key: SectionKey,
    content: Record<string, any>,
    active: boolean
  ) => {
    const { error } = await supabase
      .from('interface_studio')
      .update({
        content,
        is_active: active,
        updated_at: new Date().toISOString(),
      })
      .eq('section', key);

    if (error) {
      console.error('Error saving section:', error);
      return false;
    }
    await load();
    return true;
  };

  return { sections, loading, get, isActive, save, reload: load };
}

/**
 * Uploads to the site-media bucket.
 *
 * Videos live here rather than with catalogue photography, so a large hero
 * film never sits alongside product shots.
 */
export async function uploadSiteMedia(file: File): Promise<string | null> {
  const extension = file.name.split('.').pop() ?? 'bin';
  const path = `${Math.random().toString(36).slice(2)}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from('site-media')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Upload failed:', error);
    return null;
  }

  const { data } = supabase.storage.from('site-media').getPublicUrl(path);
  return data.publicUrl;
}
