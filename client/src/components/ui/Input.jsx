import React from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  multiline = false,
  rows = 4,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`
            px-4 py-2.5 rounded-xl
            bg-bg-primary-light dark:bg-bg-primary-dark
            border border-border-light dark:border-border-dark
            text-text-primary-light dark:text-text-primary-dark
            placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
            transition-all duration-150 resize-y
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            px-4 py-2.5 rounded-xl
            bg-bg-primary-light dark:bg-bg-primary-dark
            border border-border-light dark:border-border-dark
            text-text-primary-light dark:text-text-primary-dark
            placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
            transition-all duration-150
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
      )}
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  );
}
