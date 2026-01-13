import React from 'react';

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
    <div className="mb-4">
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          {icon && <span className="text-xl">{icon}</span>}
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 input-modern resize-none ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};
