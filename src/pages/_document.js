import { Html, Head, Main, NextScript } from 'next/document'
import { AuthProvider } from '@/custom/AuthProvider'

export default function Document() {
  return (
    <AuthProvider>
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </AuthProvider>
  )
}
