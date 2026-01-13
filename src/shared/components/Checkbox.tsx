import React from 'react';

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
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-primary rounded focus:ring-primary"
      />
      <span className={`text-gray-800 ${checked ? 'line-through text-gray-500' : ''}`}>
        {label}
      </span>
    </label>
  );
};
