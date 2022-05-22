import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import Providers from "../providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={new QueryClient({
      defaultOptions: {
        queries: {
          refetchInterval: false,
          refetchIntervalInBackground: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          refetchOnWindowFocus: false
        }
      }
    })}>
      <Providers>  
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Component {...pageProps} />
      </Providers>
    </QueryClientProvider>
  )
}

export default MyApp
