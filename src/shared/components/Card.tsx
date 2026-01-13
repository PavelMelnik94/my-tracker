import React from 'react';
import styles from './Card.module.scss';

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
  const variantClass = {
    default: styles.cardDefault,
    glass: styles.cardGlass,
    gradient: styles.cardGradient,
  }[variant];

  const hoverClass = hover ? styles.cardHover : '';
  const clickableClass = onClick ? styles.cardClickable : '';

  return (
    <div
      className={`${styles.card} ${variantClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
