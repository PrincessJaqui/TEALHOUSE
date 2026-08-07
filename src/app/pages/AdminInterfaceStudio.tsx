import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Button } from '../components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useInterfaceStudio,
  uploadSiteMedia,
  SECTION_LABELS,
  SECTION_HELP,
  type SectionKey,
} from '../hooks/useInterfaceStudio';

/**
 * Studio.
 *
 * The landing page's imagery, film and wording, editable without a deploy.
 * Sections are fixed for now; each row carries a sort_order so they can be
 * reordered later without a migration.
 */

const ORDER: SectionKey[] = [
  'hero',
  'editorial',
  'split_one',
  'carousel',
  'split_two',
  'spotlight',
];

function MediaField({
  label,
  help,
  value,
  accept,
  onChange,
}: {
  label: string;
  help?: string;
  value?: string;
  accept: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isVideo = accept.includes('video');

  const handleFile = async (file: File) => {
    setBusy(true);
    // 100MB is the bucket limit. A hero film much larger than this will make
    // the page slow to start whatever the limit says.
    if (file.size > 100 * 1024 * 1024) {
      toast.error('That file is over 100MB. Please compress it first.');
      setBusy(false);
      return;
    }

    const url = await uploadSiteMedia(file);
    setBusy(false);

    if (url) {
      onChange(url);
      toast.success('Uploaded');
    } else {
      toast.error('Upload failed');
    }
  };

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {help && <p className="text-xs text-neutral-500 mb-2">{help}</p>}

      {value && (
        <div className="mb-2 border border-neutral-200 p-2">
          {isVideo ? (
            <video src={value} className="w-full max-h-40 object-cover" muted />
          ) : (
            <img src={value} alt="" className="w-full max-h-40 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-600 hover:text-red-700 mt-2"
          >
            Remove
          </button>
        </div>
      )}

      <label className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-sm cursor-pointer hover:border-black transition-colors">
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {value ? 'Replace' : 'Upload'}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  multiline,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value ?? ''}
          rows={2}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 text-sm"
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 text-sm"
        />
      )}
    </div>
  );
}

export function AdminInterfaceStudio() {
  const { sections, loading, save, reload } = useInterfaceStudio();
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [actives, setActives] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const nextDrafts: Record<string, any> = {};
    const nextActives: Record<string, boolean> = {};
    for (const section of sections) {
      nextDrafts[section.section] = section.content ?? {};
      nextActives[section.section] = section.is_active;
    }
    setDrafts(nextDrafts);
    setActives(nextActives);
  }, [sections]);

  const setField = (key: SectionKey, field: string, value: any) =>
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), [field]: value },
    }));

  const setPanel = (key: SectionKey, index: number, field: string, value: any) =>
    setDrafts((prev) => {
      const panels = [...((prev[key]?.panels ?? [{}, {}]) as any[])];
      panels[index] = { ...(panels[index] ?? {}), [field]: value };
      return { ...prev, [key]: { ...(prev[key] ?? {}), panels } };
    });

  const handleSave = async (key: SectionKey) => {
    setSaving(key);
    const ok = await save(key, drafts[key] ?? {}, actives[key] ?? false);
    setSaving(null);
    toast[ok ? 'success' : 'error'](ok ? 'Saved' : 'Could not save');
  };

  const renderFields = (key: SectionKey) => {
    const draft = drafts[key] ?? {};

    if (key === 'hero') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <MediaField
            label="Desktop film"
            help="Plays muted and looping. Keep it short and compressed."
            accept="video/*"
            value={draft.video_desktop}
            onChange={(v) => setField(key, 'video_desktop', v)}
          />
          <MediaField
            label="Mobile film"
            help="A phone should not download the desktop file."
            accept="video/*"
            value={draft.video_mobile}
            onChange={(v) => setField(key, 'video_mobile', v)}
          />
          <MediaField
            label="Desktop still"
            help="Shown while the film loads, and instead of it where video will not play."
            accept="image/*"
            value={draft.image_desktop}
            onChange={(v) => setField(key, 'image_desktop', v)}
          />
          <MediaField
            label="Mobile still"
            accept="image/*"
            value={draft.image_mobile}
            onChange={(v) => setField(key, 'image_mobile', v)}
          />
          <TextField
            label="Headline"
            value={draft.headline}
            placeholder="New Arrivals: Autumn 2026"
            onChange={(v) => setField(key, 'headline', v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Link text"
              value={draft.link_label}
              placeholder="Shop the collection"
              onChange={(v) => setField(key, 'link_label', v)}
            />
            <TextField
              label="Link goes to"
              value={draft.link_href}
              placeholder="/resort-wear"
              onChange={(v) => setField(key, 'link_href', v)}
            />
          </div>
        </div>
      );
    }

    if (key === 'editorial') {
      return (
        <div className="space-y-4">
          <TextField
            label="Heading"
            value={draft.heading}
            onChange={(v) => setField(key, 'heading', v)}
          />
          <TextField
            label="Body"
            multiline
            value={draft.body}
            onChange={(v) => setField(key, 'body', v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Link text"
              value={draft.link_label}
              onChange={(v) => setField(key, 'link_label', v)}
            />
            <TextField
              label="Link goes to"
              value={draft.link_href}
              placeholder="/shoes"
              onChange={(v) => setField(key, 'link_href', v)}
            />
          </div>
        </div>
      );
    }

    if (key === 'split_one' || key === 'split_two') {
      const panels = (draft.panels ?? [{}, {}]) as any[];
      return (
        <div className="grid md:grid-cols-2 gap-8">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-4 border border-neutral-200 p-4">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Panel {index + 1}
              </p>
              <MediaField
                label="Desktop image"
                accept="image/*"
                value={panels[index]?.image_desktop}
                onChange={(v) => setPanel(key, index, 'image_desktop', v)}
              />
              <MediaField
                label="Mobile image"
                help="Optional. Falls back to the desktop image."
                accept="image/*"
                value={panels[index]?.image_mobile}
                onChange={(v) => setPanel(key, index, 'image_mobile', v)}
              />
              <TextField
                label="Link text"
                value={panels[index]?.label}
                placeholder="Shop footwear"
                onChange={(v) => setPanel(key, index, 'label', v)}
              />
              <TextField
                label="Link goes to"
                value={panels[index]?.href}
                placeholder="/shoes"
                onChange={(v) => setPanel(key, index, 'href', v)}
              />
            </div>
          ))}
        </div>
      );
    }

    // carousel and spotlight both draw their products from what is featured
    return (
      <div className="space-y-4">
        <TextField
          label="Heading"
          value={draft.heading}
          onChange={(v) => setField(key, 'heading', v)}
        />
        <TextField
          label="Body"
          multiline
          value={draft.body}
          onChange={(v) => setField(key, 'body', v)}
        />
        <p className="text-xs text-neutral-500">
          Pieces here come from whatever you have ticked as featured on the
          product form. There is nothing to choose in this section.
        </p>
      </div>
    );
  };

  return (
    <AdminLayout title="Studio" description="Design the landing page">
      {loading ? (
        <p className="text-sm text-neutral-600">Loading</p>
      ) : (
        <div className="space-y-6">
          {ORDER.map((key) => (
            <section key={key} className="border border-neutral-200 bg-white">
              <div className="flex items-start justify-between gap-4 border-b border-neutral-200 p-5">
                <div>
                  <h2 className="font-['Tinos'] text-xl mb-1">
                    {SECTION_LABELS[key]}
                  </h2>
                  <p className="text-xs text-neutral-500 max-w-xl">
                    {SECTION_HELP[key]}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actives[key] ?? false}
                    onChange={(e) =>
                      setActives((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                  />
                  Show
                </label>
              </div>

              <div className="p-5">{renderFields(key)}</div>

              <div className="flex justify-end gap-3 border-t border-neutral-200 p-4">
                <Button variant="outline" size="sm" onClick={() => reload()}>
                  Discard
                </Button>
                <Button
                  size="sm"
                  disabled={saving === key}
                  onClick={() => handleSave(key)}
                >
                  {saving === key ? 'Saving' : 'Save section'}
                </Button>
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
