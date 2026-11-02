import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'SupportDesk Agent — Autonomous AI Support Dashboard',
  description: 'AI-powered customer support ticket triage operations platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}