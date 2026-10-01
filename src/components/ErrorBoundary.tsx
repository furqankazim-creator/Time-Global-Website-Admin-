import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a branded recovery screen. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * ErrorBoundary — catches any unhandled JS error inside the public site's
 * <main> tree and shows a user-friendly recovery screen instead of a blank
 * white page.
 *
 * Class component is required: React hooks cannot replicate componentDidCatch.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    // Surface to console in dev; swap for a real error reporter (Sentry etc.)
    // in production without changing this component.
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center bg-background">
          {/* Brand mark */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-primary"
              aria-hidden="true"
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            An unexpected error occurred on this page. The issue has been logged.
            You can try refreshing, or go back to the homepage.
          </p>

          {this.state.errorMessage && (
            <p className="mb-8 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-mono max-w-lg break-all">
              {this.state.errorMessage}
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-xl border border-border font-bold hover:bg-muted transition-colors"
            >
              Go to homepage
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
