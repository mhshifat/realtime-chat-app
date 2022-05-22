import { ButtonHTMLAttributes, ReactElement } from 'react'

export enum ButtonVariants {
  primary = 'primary',
}
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean
  variant?: ButtonVariants
  loading?: boolean
  disabled?: boolean
  children: ReactElement | string
}

export default function Button({
  full,
  variant,
  loading,
  disabled,
  children,
  ...restProps
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`my-2 flex h-[40px] items-center justify-center rounded-sm shadow-sm transition-all duration-500 disabled:bg-slate-400 ${
        full ? 'w-full' : ''
      } ${
        variant === ButtonVariants.primary
          ? 'bg-blue-600 text-base font-medium text-slate-50 hover:bg-blue-700'
          : ''
      }`}
      {...restProps}
    >
      {loading ? 'Loading...' : children} {(!disabled && !loading) && '⚡'}
    </button>
  )
}
