import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    const variants = {
      default: cn(
        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
        'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
        'focus:border-green-500 focus:ring-green-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
      ),
      filled: cn(
        'bg-gray-50 dark:bg-gray-700 border-transparent',
        'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
        'focus:bg-white dark:focus:bg-gray-800 focus:border-green-500 focus:ring-green-500',
        error && 'bg-red-50 dark:bg-red-900/20 border-red-500 focus:border-red-500 focus:ring-red-500'
      )
    };
    
    const sizeStyles = cn(
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      !leftIcon && !rightIcon && 'px-4',
      'py-3'
    );
    
    const inputId = props.id || props.name;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={cn(
                'text-gray-400',
                error && 'text-red-400'
              )}>
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              baseStyles,
              variants[variant],
              sizeStyles,
              disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700',
              className
            )}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={cn(
                'text-gray-400',
                error && 'text-red-400'
              )}>
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-2 text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;