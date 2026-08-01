import React from 'react';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  className = '',
  placeholder = 'Select an option',
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          px-4 py-2.5 rounded-xl
          bg-bg-primary-light dark:bg-bg-primary-dark
          border border-border-light dark:border-border-dark
          text-text-primary-light dark:text-text-primary-dark
          focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
          transition-all duration-150 cursor-pointer
          ${error ? 'border-red-500' : ''}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  );
}
