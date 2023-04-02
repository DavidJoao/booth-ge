import '@/styles/globals.css'
import { AuthProvider } from '@/custom/AuthProvider'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>

  ) 
}
