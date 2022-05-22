import Head from 'next/head'
import router from 'next/router'
import { ReactElement, useCallback, useEffect } from 'react'
import { ROUTE_PATHS } from '../../../constants'
import { useAuth } from '../../../providers/Auth'

export interface UserPageProps {
  title: string
  children: ReactElement
}

export default function UserPage({ title, children }: UserPageProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}
