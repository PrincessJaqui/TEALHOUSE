import type * as React from 'react';

/**
 * The PayPal v6 SDK renders through custom elements. TypeScript needs to be
 * told they exist, otherwise every use is an unknown-property error.
 */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'paypal-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'paypal-pay-later-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'paypal-credit-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
