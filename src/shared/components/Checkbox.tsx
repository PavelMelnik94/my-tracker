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
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer w-6 h-6 text-primary-500 bg-white/50 backdrop-blur-sm border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-100 transition-all duration-200 cursor-pointer checked:border-primary-500 checked:bg-primary-500"
        />
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={`text-gray-800 font-medium transition-all duration-200 ${
        checked ? 'line-through text-gray-400' : 'group-hover:text-primary-600'
      }`}>
        {label}
      </span>
    </label>
  );
};
