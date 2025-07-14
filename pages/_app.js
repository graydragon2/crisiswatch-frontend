// pages/_app.js
import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
  return (
    // attribute="class" tells next-themes to toggle the `dark` class on <html>
    <ThemeProvider attribute="class" defaultTheme="system">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}