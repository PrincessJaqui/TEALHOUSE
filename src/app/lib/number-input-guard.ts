/**
 * Stops the scroll wheel changing a number input.
 *
 * Browsers treat a focused number input as a spinner, so a trackpad scroll
 * across the page silently rewrites whatever is under the cursor. On a stock
 * form that means walking past a row of quantity boxes and changing them all
 * without noticing, which is exactly the kind of error you only find when
 * the count is wrong.
 *
 * The arrows themselves are hidden in globals.css. This handles the wheel.
 *
 * Installed once from main.tsx rather than on each input, so a new number
 * field anywhere inherits the behaviour without anyone remembering to add it.
 */
export function installNumberInputGuard(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener(
    'wheel',
    (event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.type === 'number' &&
        target === document.activeElement
      ) {
        // Cancel the value change, then drop focus so the page scrolls
        // normally from the next tick onward.
        event.preventDefault();
        target.blur();
      }
    },
    // Not passive, because the default action is the thing being stopped.
    { passive: false }
  );

  // Arrow keys nudge the value too, which is fine and expected. Up and down
  // are deliberately left alone.
}
