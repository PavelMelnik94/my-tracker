import React from 'react';

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
    <div className="mb-4">
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          {icon && <span className="text-xl">{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            {icon}
          </span>
        )}
        <input
          className={`w-full px-4 py-3 input-modern ${
            icon ? 'pl-12' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};
