import { AiFillFacebook, AiFillGoogleSquare } from 'react-icons/ai'
import { GoogleLogin } from 'react-google-login'
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

export interface SocialAuthProps {}

export default function SocialAuth({}: SocialAuthProps) {
  return (
    <div className="flex flex-col">
      <GoogleLogin
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="my-2 flex h-[40px] items-center justify-center gap-1 rounded-sm border-none bg-red-500 text-slate-50 outline-none transition-all duration-500 hover:bg-red-600"
          >
            <span className="flex flex-1 items-center">
              <AiFillGoogleSquare className="ml-2 text-2xl" />{' '}
              <span className="flex-1 px-2 text-base font-medium">
                Login with Google
              </span>
            </span>
          </button>
        )}
        onSuccess={() => {}}
        onFailure={() => {}}
      />

      <FacebookLogin
        appId="1088597931155576"
        callback={() => {}}
        render={(renderProps: any) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="my-2 flex h-[40px] items-center justify-center gap-1 rounded-sm border-none bg-blue-500 text-slate-50 outline-none transition-all duration-500 hover:bg-blue-600"
          >
            <span className="flex flex-1 items-center">
              <AiFillFacebook className="ml-2 text-2xl" />{' '}
              <span className="flex-1 px-2 text-base font-medium">
                Login with Facebook
              </span>
            </span>
          </button>
        )}
      />
    </div>
  )
}
