import React, { Component } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AppErrorBoundary caught an unhandled rendering error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-float text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100 shadow-subtle">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                An unexpected display issue occurred. Please try reloading the page or return to the travel catalog.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReload}
                iconLeft={RotateCcw}
                className="w-full sm:w-auto justify-center font-bold"
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={this.handleGoHome}
                iconLeft={Home}
                className="w-full sm:w-auto justify-center"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
