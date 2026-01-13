import React from 'react';
import styles from './TextArea.module.scss';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label className={styles.label}>
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          {label}
        </label>
      )}
      <textarea
        className={`${styles.textarea} ${
          error ? styles.textareaError : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};
