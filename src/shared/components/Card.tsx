import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'glass',
  hover = true,
  style
}) => {
  const baseClasses = 'rounded-2xl p-5 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-md',
    glass: 'glass-card',
    gradient: 'bg-gradient-card backdrop-blur-xl shadow-lg border border-white/30',
  };

  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
