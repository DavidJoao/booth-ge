import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
      <Html lang="en">
        <Head>
          <link rel='shortcut icon' href='https://cdn-icons-png.flaticon.com/512/1624/1624003.png'/>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap" rel="stylesheet"/>
        </Head>
        <title>Booth Grading and Excavating</title>
        <body className='main-body'>
          <Main />
          <NextScript />
        </body>
      </Html>
  )
}
