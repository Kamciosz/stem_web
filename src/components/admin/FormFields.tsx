"use client";

import type { UseFormRegister, FieldErrors, Path, FieldValues } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    type?: string;
    placeholder?: string;
    required?: boolean;
}

export function InputField<T extends FieldValues>({
    label,
    name,
    register,
    errors,
    type = "text",
    placeholder,
    required,
}: InputFieldProps<T>) {
    const error = errors[name];
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                {...register(name)}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 transition-colors text-sm ${error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--color-border)] focus:ring-[var(--color-purple-500)] focus:border-[var(--color-purple-500)]"
                    }`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-400">
                    {error.message as string}
                </p>
            )}
        </div>
    );
}

interface TextareaFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    placeholder?: string;
    rows?: number;
    required?: boolean;
}

export function TextareaField<T extends FieldValues>({
    label,
    name,
    register,
    errors,
    placeholder,
    rows = 4,
    required,
}: TextareaFieldProps<T>) {
    const error = errors[name];
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <textarea
                {...register(name)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 transition-colors text-sm resize-y ${error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--color-border)] focus:ring-[var(--color-purple-500)] focus:border-[var(--color-purple-500)]"
                    }`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-400">
                    {error.message as string}
                </p>
            )}
        </div>
    );
}

interface SelectFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    options: { value: string; label: string }[];
    required?: boolean;
}

export function SelectField<T extends FieldValues>({
    label,
    name,
    register,
    errors,
    options,
    required,
}: SelectFieldProps<T>) {
    const error = errors[name];
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <select
                {...register(name)}
                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border text-[var(--color-text-primary)] focus:outline-none focus:ring-1 transition-colors text-sm ${error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--color-border)] focus:ring-[var(--color-purple-500)] focus:border-[var(--color-purple-500)]"
                    }`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-xs text-red-400">
                    {error.message as string}
                </p>
            )}
        </div>
    );
}

interface ToggleFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export function ToggleField({
    label,
    checked,
    onChange,
    description,
}: ToggleFieldProps) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {label}
                </p>
                {description && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {description}
                    </p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked
                    ? "bg-[var(--color-purple-600)]"
                    : "bg-[var(--color-border)]"
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

interface FormActionsProps {
    loading: boolean;
    onCancel: () => void;
    submitLabel?: string;
}

export function FormActions({
    loading,
    onCancel,
    submitLabel = "Zapisz",
}: FormActionsProps) {
    return (
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] disabled:bg-[var(--color-purple-800)] disabled:cursor-not-allowed text-white text-sm font-medium transition-all glow-purple"
            >
                {loading ? "Zapisywanie..." : submitLabel}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] text-sm font-medium transition-all"
            >
                Anuluj
            </button>
        </div>
    );
}
