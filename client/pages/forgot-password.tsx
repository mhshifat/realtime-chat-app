import { UserPage } from './../components/layouts'
import { AuthBanner, PublicRoute, SocialAuth } from './../components/auth'
import { Logo } from './../components/common'
import Link from 'next/link'
import { ROUTE_PATHS } from './../constants'
import { ForgotPasswordForm, LoginForm } from './../components/forms'

export default function ForgotPassword() {
  return (
    <PublicRoute>
      <UserPage title="ChatApp | Forgot Password?">
        <AuthBanner>
          <Link href={ROUTE_PATHS.LOGIN}>
            <a className="flex p-5">
              <Logo />
            </a>
          </Link>
          <div className="flex h-full flex-col justify-center p-5">
            <ForgotPasswordForm />

            <div className="flex items-center py-5">
              <span className="h-[1px] flex-1 bg-slate-400 opacity-[.7]"></span>
              <span className="mx-2 text-base font-semibold text-slate-600">
                OTHER
              </span>
              <span className="h-[1px] flex-1 bg-slate-400 opacity-[.5]"></span>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-sm font-medium text-slate-600">
                Already have an account?{' '}
                <Link href={ROUTE_PATHS.LOGIN}>
                  <a className="text-blue-600">Login</a>
                </Link>
              </p>
            </div>
          </div>
        </AuthBanner>
      </UserPage>
    </PublicRoute>
  )
}
