import { createContext, ReactElement, useCallback, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { API } from '../api';
import { LOCAL_STORAGE_NAMES } from '../constants';

export interface AuthProvidersProps {
  children: ReactElement | ReactElement [];
}
export interface UserDocument {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}
export interface AuthContextProps {
  user: UserDocument;
  token: string;
  processing: boolean;
  login: ({ user, token }: {
    user: UserDocument;
    token: string;
    }) => Promise<{
      user: UserDocument;
      token: string;
    }>;
  logout: () => Promise<void>
}

export const AuthContext = createContext<Partial<AuthContextProps>>({})
export default function AuthProvider({ children }: AuthProvidersProps) {
  const [processing, setProcessing] = useState(true)
  const [user, setUser] = useState<UserDocument | undefined>(undefined)
  const [token, setToken] = useState<string | undefined>(undefined)
  useQuery([API.AUTH.GET_ME.name, {}], API.AUTH.GET_ME, {
    onSuccess: ({ data: { result } }) => {
      if (!result) return logout()
      login(result)
    },
  })

  const login = useCallback(
    async ({
      user,
      token,
    }: {
      user: UserDocument
      token: string
    }): Promise<{ user: UserDocument; token: string }> => {
      return new Promise((resolve) => {
        localStorage.setItem(LOCAL_STORAGE_NAMES.AUTH_TOKEN, token)
        setUser(user)
        setToken(token)
        setProcessing(false)
        resolve({ user, token })
      })
    },
    []
  )
  const logout = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(LOCAL_STORAGE_NAMES.AUTH_TOKEN)
      setUser(undefined)
      setToken(undefined)
      setProcessing(false)
      resolve()
    })
  }, [])
  return (
    <AuthContext.Provider value={{ processing, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext);