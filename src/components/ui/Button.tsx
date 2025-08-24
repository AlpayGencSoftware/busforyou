"use client";
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  mobileText?: string; // Mobilde farklı metin göstermek için
  pill?: boolean; // Tam yuvarlak köşe için
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  mobileText,
  pill = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  // Variant stilleri
  const variantStyles = {
    primary: 'search-button-color text-search-button-color-text shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102',
    outline: 'border-2 border-[#192333] text-[#192333] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102',
    ghost: 'text-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-102',
    danger: 'bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102'
  };

  // Size stilleri
  const sizeStyles = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-xs sm:text-sm',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm md:text-base',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base md:text-lg'
  };

  // Radius stilleri (pill true ise her kırılımda full)
  const radiusStyles = pill
    ? '!rounded-full sm:!rounded-full md:!rounded-full lg:!rounded-full'
    : '';

  // Icon boyutları
  const iconSizes = {
    sm: 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5',
    lg: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'
  };

  // Base styles
  const baseStyles = 'font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : 'w-auto';
  
  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${radiusStyles}
    ${widthStyles}
    ${disabled || loading ? 'pointer-events-none' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
          <span className="hidden sm:inline">Yükleniyor...</span>
          <span className="sm:hidden">...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]}`} />
          )}
          
          {mobileText ? (
            <>
              <span className="hidden sm:inline">{children}</span>
              <span className="sm:hidden">{mobileText}</span>
            </>
          ) : (
            children
          )}
          
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]}`} />
          )}
        </>
      )}
    </button>
  );
}