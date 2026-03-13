import type { AppProps } from "next/app";
import "../styles/globals.css";
import Headers from "../components/Header/Header";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <SessionProvider session={pageProps.session}>
    <Headers />
    <Component {...pageProps}/> 
  </SessionProvider>

  )
}

