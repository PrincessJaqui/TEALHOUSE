/**
 * CSV export.
 *
 * The escaping here is not decorative. Product descriptions contain commas,
 * customer names contain apostrophes, and addresses contain line breaks. Any
 * of those will corrupt a naive join(',') into a file that opens with columns
 * shifted, which is worse than no export because it looks fine at a glance.
 */

export type CsvValue = string | number | boolean | null | undefined;

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => CsvValue;
}

function escapeCell(value: CsvValue): string {
  if (value === null || value === undefined) return '';

  const text = String(value);

  // A leading =, +, - or @ makes Excel and Sheets treat the cell as a formula.
  // Prefixing with a single quote neutralises it. This matters because the
  // contents are partly customer-supplied.
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

  if (/[",\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows.map((row) =>
    columns.map((c) => escapeCell(c.value(row))).join(',')
  );
  return [header, ...body].join('\r\n');
}

export function downloadCsv(filename: string, csv: string): void {
  // The byte order mark is what makes Excel open UTF-8 correctly. Without it
  // accented characters arrive as mojibake.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/** "tealhouse-inventory-2026-07-28.csv" */
export function stampedFilename(base: string): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return `tealhouse-${base}-${date}.csv`;
}

export function exportCsv<T>(base: string, rows: T[], columns: CsvColumn<T>[]): void {
  downloadCsv(stampedFilename(base), toCsv(rows, columns));
}
