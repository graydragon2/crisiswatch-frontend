// pages/_app.js
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  // 💡 Notice: no Sidebar here, we’ll render it in the dashboard page only
  return <Component {...pageProps} />;
}