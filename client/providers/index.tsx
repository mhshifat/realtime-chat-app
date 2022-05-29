import { ReactElement } from 'react';
import AuthProvider from './Auth'
import MessageProvider from './Message'

export interface ProvidersProps {
  children: ReactElement | ReactElement[]
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <MessageProvider>{children}</MessageProvider>
    </AuthProvider>
  )
}