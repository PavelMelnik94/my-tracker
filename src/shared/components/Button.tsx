import React from 'react';
import styles from './Button.module.scss';

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
  const sizeClass = {
    sm: styles.sizeSmall,
    md: styles.sizeMedium,
    lg: styles.sizeLarge,
  }[size];

  const variantClass = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    danger: styles.variantDanger,
    gradient: styles.variantGradient,
    ghost: styles.variantGhost,
  }[variant];

  return (
    <button
      className={`${styles.button} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
