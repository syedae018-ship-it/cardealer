import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quality Used Cars | Syed Sabeer Riyaz — Verified Pre-Owned Cars',
  description:
    'Browse carefully selected pre-owned cars in Bangalore. Verified vehicles, honest deals, and direct WhatsApp booking with Syed Sabeer Riyaz.',
  keywords: [
    'used cars',
    'pre-owned cars',
    'Bangalore car dealer',
    'Syed Sabeer Riyaz',
    'Syed Sabeer',
    'Quality Used Cars',
    'second hand cars',
  ],
  openGraph: {
    title: 'Quality Used Cars | Honest Deals by Syed Sabeer Riyaz',
    description: 'Browse our current collection of verified pre-owned cars.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-poppins antialiased selection:bg-brand-orange selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
