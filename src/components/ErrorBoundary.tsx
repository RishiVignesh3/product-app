import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          {/* Ambient background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative w-full max-w-lg">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
              {/* Error Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-slate-400 mb-6">
                An unexpected error occurred. Please try again or refresh the page.
              </p>

              {/* Error Details (collapsible) */}
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-400 transition-colors">
                    View error details
                  </summary>
                  <div className="mt-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-auto max-h-40">
                    <p className="text-xs font-mono text-rose-400 break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="mt-2 text-xs font-mono text-slate-500 whitespace-pre-wrap break-all">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:shadow-rose-500/40 active:scale-[0.98]"
                >
                  Go Home
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

