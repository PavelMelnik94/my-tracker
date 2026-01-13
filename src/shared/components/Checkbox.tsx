import React from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className = '',
}) => {
  return (
    <label className={`${styles.checkboxLabel} ${className}`}>
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.checkbox}
        />
        <svg
          className={styles.checkmark}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={`${styles.labelText} ${
        checked ? styles.labelTextChecked : ''
      }`}>
        {label}
      </span>
    </label>
  );
};
