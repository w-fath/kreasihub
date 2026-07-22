import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-dark">
            {label}
          </label>
        )}
        <input
          className={`flex h-10 w-full rounded-md border ${
            error ? 'border-accent-error focus-visible:ring-accent-error' : 'border-gray-300 focus-visible:ring-primary'
          } bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-accent-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
