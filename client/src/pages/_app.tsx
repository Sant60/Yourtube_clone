import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { UserProvider } from "../lib/AuthContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UserProvider>
      <Head>
        <title>YourTube</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen" style={{ background: "var(--yt-bg)", color: "var(--yt-text-primary)" }}>
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <Toaster />
        <div className="flex" style={{ paddingTop: "56px" }}>
          <Sidebar open={sidebarOpen} />
          <main
            style={{
              flex: 1,
              minWidth: 0,
              marginLeft: sidebarOpen ? "240px" : "72px",
              transition: "margin-left 0.2s",
            }}
          >
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
