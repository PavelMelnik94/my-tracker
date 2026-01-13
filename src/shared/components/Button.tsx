import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 active:scale-95';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-glow',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-200',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-lg',
    gradient: 'btn-gradient',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};
