import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Notebook',
  description: 'Explore our integrated AI platforms designed to accelerate your learning and development.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
