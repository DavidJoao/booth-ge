import '@/styles/globals.css'
import { AuthProvider } from '@/custom/AuthProvider'
import Navbar from '@/components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>

  ) 
}
