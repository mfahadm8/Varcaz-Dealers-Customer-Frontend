/**
 * ErrorBoundary Component
 *
 * Production-level error boundary that catches React errors and displays
 * a user-friendly fallback UI instead of crashing the entire app.
 *
 * Features:
 * - Catches errors in child component tree
 * - Displays fallback UI with error details (dev mode only)
 * - Logs errors to console
 * - Provides "Try Again" button to reset error state
 * - Can be nested for granular error handling
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * Or wrap specific sections:
 * ```tsx
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <SuspiciousComponent />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default fallback UI shown when error occurs
 */
const DefaultFallback: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}> = ({ error, errorInfo, resetError }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-status-error/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-8 h-8 text-status-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Something went wrong
            </h1>
            <p className="text-neutral-600 mt-1">
              An unexpected error occurred. Please try again.
            </p>
          </div>
        </div>

        {/* Error Details (Dev Mode Only) */}
        {isDev && error && (
          <div className="mb-6">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900 mb-2">
                Error Details (Development Mode)
              </summary>
              <div className="bg-neutral-100 rounded-lg p-4 space-y-3">
                {/* Error Message */}
                <div>
                  <p className="text-xs font-medium text-neutral-600 mb-1">
                    Error Message:
                  </p>
                  <p className="text-sm text-status-error font-mono">
                    {error.message}
                  </p>
                </div>

                {/* Error Stack */}
                {error.stack && (
                  <div>
                    <p className="text-xs font-medium text-neutral-600 mb-1">
                      Stack Trace:
                    </p>
                    <pre className="text-xs text-neutral-700 overflow-auto max-h-48 bg-white p-3 rounded border border-neutral-200">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {/* Component Stack */}
                {errorInfo?.componentStack && (
                  <div>
                    <p className="text-xs font-medium text-neutral-600 mb-1">
                      Component Stack:
                    </p>
                    <pre className="text-xs text-neutral-700 overflow-auto max-h-48 bg-white p-3 rounded border border-neutral-200">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2.5 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-neutral-500">
          If this problem persists, please contact support with the error
          details above.
        </p>
      </div>
    </div>
  );
};

/**
 * Error Boundary Class Component
 *
 * Class component required because React error boundaries
 * can only be implemented as class components (no hook equivalent yet)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error is caught
   * This method is called during the "render" phase
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details
   * This method is called during the "commit" phase
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error Info:", errorInfo);

    // Store error info in state
    this.setState({
      errorInfo,
    });

    // Call optional error handler prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  /**
   * Reset error state to try rendering again
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
