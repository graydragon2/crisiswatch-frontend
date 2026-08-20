import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Head>
        <title>Contingency Brief</title>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
