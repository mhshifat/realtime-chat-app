import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  togglePassword?: boolean
  labelEnds?: ReactElement | ReactElement[]
}

function Input(
  {
    label,
    required,
    error,
    labelEnds,
    togglePassword,
    ...restProps
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <label className="relative flex w-full flex-col gap-1 py-2">
      {label && (
        <span className="flex text-sm font-semibold text-slate-600">
          {label} {required && <small className="text-red-600">*</small>}{' '}
          <span className="ml-auto inline-block">{labelEnds}</span>
        </span>
      )}
      {togglePassword && restProps.type === 'password' && (
        <span className="absolute bottom-[20px] right-3 cursor-pointer">
          {showPassword ? (
            <AiOutlineEyeInvisible onClick={() => setShowPassword(false)} />
          ) : (
            <AiOutlineEye onClick={() => setShowPassword(true)} />
          )}
        </span>
      )}
      <input
        className="h-[40px] w-full rounded-sm border border-stone-300 px-3 text-sm outline-none transition-all duration-500 focus:border-blue-400"
        {...restProps}
        {...(showPassword ? { type: 'text' } : {})}
        ref={ref}
      />
      {error && <p className="text-sm font-medium text-red-400">{error}</p>}
    </label>
  )
}

export default forwardRef(Input)
