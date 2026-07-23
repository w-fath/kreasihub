import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-dark">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black">
              {leftIcon}
            </div>
          )}
          <input
            className={`flex h-12 w-full rounded-md border ${
              error ? 'border-accent-error focus-visible:ring-accent-error' : 'border-gray-300 focus-visible:ring-primary'
            } bg-transparent px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? 'pl-11' : ''
            } ${className}`}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-accent-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
