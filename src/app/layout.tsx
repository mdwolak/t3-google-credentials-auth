import { Inter, Roboto_Mono } from "next/font/google";
import { cookies } from "next/headers";

import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body
        className={`font-sans ${inter.variable} ${roboto_mono.variable} desktop-transparent h-full antialiased`}>
        <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
