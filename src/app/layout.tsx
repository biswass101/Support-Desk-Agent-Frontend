import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'SupportDesk Agent — Autonomous AI Support Dashboard',
  description: 'AI-powered customer support ticket triage operations platform',
  icons: {
    icon: [
      { url: '/chatbot.png' },
      { url: '/favicon.ico' },
    ],
    apple: '/chatbot.png',
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}