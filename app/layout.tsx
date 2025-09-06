import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/theme-context';
import Script from 'next/script';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AlertNotification from '@/components/alert-notification';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/flash-lines copy.ico" />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <AlertNotification />
        </ThemeProvider>
      </body>
    </html>
  );
}