import { Component, type ReactNode, type ErrorInfo } from 'react';

/**
 * Catches a render crash and shows something rather than nothing.
 *
 * Without this, one bad render blanks the entire site: a white page with the
 * real reason buried in the console. A customer sees a broken shop and has
 * no way to tell anyone what happened.
 *
 * The message stays plain and the brand stays intact, with a reload that
 * clears the module cache in case the failure came from a stale bundle.
 */

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept in the console with the component stack, which is the part that
    // actually says where it broke.
    console.error('Render failed:', error, info.componentStack);
  }

  private reload = () => {
    // A hard reload, bypassing the cache, so a stale or half-fetched bundle
    // is not simply loaded again.
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="max-w-[420px] text-center">
          <p className="tracking-[0.4em] text-sm mb-10">TEALHOUSE</p>

          <h1 className="font-['Tinos'] text-2xl mb-4">
            Something went wrong here
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            This page did not load properly. Reloading usually resolves it. If
            it does not, please write to us and we will help.
          </p>

          <button
            type="button"
            onClick={this.reload}
            className="bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Reload the page
          </button>

          <p className="text-xs text-gray-400 mt-10">
            {this.state.error.message}
          </p>
        </div>
      </div>
    );
  }
}
