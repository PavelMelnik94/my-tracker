import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && (
          <span className={styles.icon}>
            {icon}
          </span>
        )}
        <input
          className={`${styles.input} ${
            icon ? styles.inputWithIcon : ''
          } ${error ? styles.inputError : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};
