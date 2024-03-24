import "@/styles/globals.css";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
export const metadata = {
  title: "NovaTrade",
  description:'Trade cryptocurrencies in a fun and safe environment'
}
export default function App({ Component, pageProps: { session, ...pageProps }, }) {
  return (
      <SessionProvider session={session}>
          <NavBar />
          <Component {...pageProps} />
      </SessionProvider>
  )
}
