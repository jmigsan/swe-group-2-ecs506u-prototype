import styles from "@/styles/globals.css";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";
import ChatBot from "@/components/chatBot";
export const ModeContext= createContext();
export const metadata = {
  title: "NovaTrade",
  description:'Trade cryptocurrencies in a fun and safe environment'
}
export default function App({ Component, pageProps: { session, ...pageProps }, }) {
  const [mode, setMode] = useState("Lite")
  return (
      <SessionProvider session={session}>
        <ModeContext.Provider value ={{mode, setMode}}>
          <NavBar />
          <ChatBot/>
          <Component {...pageProps} />
        </ModeContext.Provider>
      </SessionProvider>
  )
}
