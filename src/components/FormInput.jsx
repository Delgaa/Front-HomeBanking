import React from 'react'

function FormInput({ label, type = "text", name, value, onChange, placeholder, error, min, max }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-text-muted ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg border bg-surface text-text-main placeholder-slate-400 outline-none transition-all
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
        `}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default FormInput