import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {label}
      </label>
      <input
        className={`border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white shadow-sm transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        className={`border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white shadow-sm min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
};