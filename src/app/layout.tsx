import "./globals.css";
import { Inter } from 'next/font/google'
import NextAuthSessionProvider from "./providers/sessionProvider";
const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'CondoHelp',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <NextAuthSessionProvider>
        <body className={inter.className}>
          {children}
        </body>
      </NextAuthSessionProvider>
    </html>
  )
}
