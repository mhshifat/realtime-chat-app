import { ReactElement } from 'react'

export interface AuthBanner {
  children: ReactElement | ReactElement[]
}

export default function AuthBanner({ children }: AuthBanner) {
  return (
    <div className="flex h-screen">
      <div className="flex w-[400px] flex-col bg-slate-50">{children}</div>
      <div className="flex-1 bg-[url('/assets/auth-bg.svg')]" />
    </div>
  )
}
