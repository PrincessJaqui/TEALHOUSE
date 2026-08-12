import { useState } from 'react';
import { toast } from 'sonner';
import { CartItem, Product } from '../App';
import { useCatalogLists } from '../hooks/useCatalogLists';
import {
  partOptions,
  partComponents,
  joinComponents,
  stockFor,
  availableSizesFor,
} from '../config/taxonomy';
import { isMadeToMeasure, tracksStock } from '../config/fulfillment';

/**
 * Change the selections on a line already in the bag.
 *
 * Previously the only way to correct a size was to remove the line and start
 * again, which loses the place in the bag and is a poor experience for a
 * multi-part piece where several choices were made.
 *
 * Implemented as remove-then-add rather than an in-place update, because a
 * line's identity IS its selections: two different size choices are two
 * different lines, and the stock keys differ.
 */

interface EditCartItemProps {
  item: CartItem;
  onClose: () => void;
  onReplace: (
    product: Product,
    size: string | undefined,
    sizes: Record<string, string> | undefined,
    quantity: number
  ) => void;
}

export function EditCartItem({ item, onClose, onReplace }: EditCartItemProps) {
  const catalog = useCatalogLists();
  const product = item.product;
  const groups = product.size_groups ?? [];

  const [sizes, setSizes] = useState<Record<string, string>>(item.sizes ?? {});
  const [size, setSize] = useState<string | undefined>(item.size);
  const [componentChoices, setComponentChoices] = useState<
    Record<string, Record<string, string>>
  >({});

  const madeToMeasure = isMadeToMeasure(product);
  const checksStock = tracksStock(product);

  const save = () => {
    if (groups.length > 0) {
      for (const group of groups) {
        const chosen = sizes[group.label];
        if (!chosen) {
          toast.error(`Please choose a ${group.label.toLowerCase()}`);
          return;
        }
        if (
          checksStock &&
          stockFor(product, {
            color: item.color,
            group: group.label,
            size: chosen,
          }) <= 0
        ) {
          toast.error(`${group.label} ${chosen} is sold out`);
          return;
        }
      }
      onReplace(product, undefined, sizes, item.quantity);
    } else {
      if ((product.sizes ?? []).length > 0 && !size) {
        toast.error('Please choose a size');
        return;
      }
      if (
        checksStock &&
        stockFor(product, { color: item.color, size }) <= 0
      ) {
        toast.error('That size is sold out');
        return;
      }
      onReplace(product, size, undefined, item.quantity);
    }

    toast.success('Bag updated');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto p-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          Change your selection
        </p>
        <h2 className="mb-6">{product.name}</h2>

        {groups.length > 0 ? (
          <div className="space-y-5">
            {groups.map((group) => {
              const components = partComponents(group, catalog.scales);
              const options = partOptions(group, catalog.scales, madeToMeasure);

              // A compound scale such as a bra needs a dropdown per part,
              // combined into one value.
              if (components) {
                const current = componentChoices[group.label] ?? {};
                return (
                  <div key={group.label}>
                    <label className="block text-sm mb-2">{group.label}</label>
                    <div className="flex gap-3">
                      {components.map((component) => (
                        <select
                          key={component.label}
                          value={current[component.label] ?? ''}
                          onChange={(e) => {
                            const next = {
                              ...current,
                              [component.label]: e.target.value,
                            };
                            setComponentChoices((prev) => ({
                              ...prev,
                              [group.label]: next,
                            }));

                            const ordered = components.map(
                              (c) => next[c.label] ?? ''
                            );
                            setSizes((prev) => ({
                              ...prev,
                              [group.label]: ordered.every(Boolean)
                                ? joinComponents(ordered, catalog.scales, group)
                                : '',
                            }));
                          }}
                          className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                        >
                          <option value="">{component.label}</option>
                          {component.values.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                );
              }

              // Sold-out sizes are shown struck through rather than hidden, so
              // it is clear the size exists and is simply unavailable.
              const available = checksStock
                ? availableSizesFor(product, group, item.color)
                : options;

              return (
                <div key={group.label}>
                  <label className="block text-sm mb-2">{group.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => {
                      const soldOut = checksStock && !available.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={soldOut}
                          onClick={() =>
                            setSizes((prev) => ({ ...prev, [group.label]: option }))
                          }
                          className={`min-w-[3.5rem] px-3 py-2.5 border text-sm transition-colors ${
                            soldOut
                              ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              : sizes[group.label] === option
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <label className="block text-sm mb-2">Size</label>
            <div className="flex flex-wrap gap-2">
              {(product.sizes ?? []).map((option) => {
                const value = String(option);
                const soldOut =
                  checksStock &&
                  stockFor(product, { color: item.color, size: value }) <= 0;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={soldOut}
                    onClick={() => setSize(value)}
                    className={`min-w-[3.5rem] px-3 py-2.5 border text-sm transition-colors ${
                      soldOut
                        ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                        : size === value
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 py-3 text-sm uppercase tracking-wider hover:border-black transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="flex-1 bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
