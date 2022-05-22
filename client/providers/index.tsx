import { ReactElement } from 'react';
import AuthProviders from './Auth';

export interface ProvidersProps {
  children: ReactElement | ReactElement[]
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProviders>
      {children}
    </AuthProviders>
  )
}