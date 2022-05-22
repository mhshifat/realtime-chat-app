import { UserPage } from './../components/layouts'
import { AuthBanner, PublicRoute, SocialAuth } from './../components/auth'
import { Logo } from './../components/common'
import Link from 'next/link'
import { LOCAL_STORAGE_NAMES, ROUTE_PATHS } from './../constants'
import { ActivateAccountForm } from './../components/forms'
import { useRouter } from 'next/router'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { sendPromiseToastMessage } from './../lib';
import { useMutation } from 'react-query'
import { API } from '../api'

export interface AccountActivationFormValues {
  hash: string;
}
export default function ActivateAccount() {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const hash = localStorage.getItem(LOCAL_STORAGE_NAMES.ACCOUNT_ACTIVATION_EMAIL_FOR);
    if (hash) setHash(hash);
  });

  const { mutateAsync: resendAccountActivationCode } = useMutation(API.AUTH.RESEND_ACCOUNT_ACTIVATION_CODE)

  const handleResendAccountActivationCode = useCallback(async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await sendPromiseToastMessage(
      resendAccountActivationCode({
        hash: hash!,
      }),
      "Processing",
      "Successfully sent account activation code. Code will expire in 5 minutes."
    )
  }, [hash]);

  return (
    <PublicRoute>
      <UserPage title="ChatApp | Account Activation?">
        <AuthBanner>
          <Link href={ROUTE_PATHS.LOGIN}>
            <a className="flex p-5">
              <Logo />
            </a>
          </Link>
          <div className="flex h-full flex-col justify-center p-5">
            <ActivateAccountForm />

            <div className="flex items-center py-5">
              <span className="h-[1px] flex-1 bg-slate-400 opacity-[.7]"></span>
              <span className="mx-2 text-base font-semibold text-slate-600">
                OTHER
              </span>
              <span className="h-[1px] flex-1 bg-slate-400 opacity-[.5]"></span>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-sm font-medium text-slate-600">
                Didn't receive the email?{' '}
                <Link href={ROUTE_PATHS.LOGIN}>
                  <a className="text-blue-600" onClick={handleResendAccountActivationCode}>Resend</a>
                </Link>
              </p>
            </div>
          </div>
        </AuthBanner>
      </UserPage>
    </PublicRoute>
  )
}
