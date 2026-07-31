import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

const FIELD_BASE =
  "w-full rounded-sm border border-line bg-bone px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-brass focus:border-brass transition-colors";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, hint, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-soft/70">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        className={`${FIELD_BASE} ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, id, className = "", rows = 5, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`${FIELD_BASE} resize-y ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
);
TextArea.displayName = "TextArea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className = "", children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id}>
      <select
        ref={ref}
        id={id}
        className={`${FIELD_BASE} ${error ? "border-danger" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";
