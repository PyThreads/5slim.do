import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProv from "./themeProvider.jsx"
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "5slim.do",
  description: "Los mejores precios online en Republica Dominicana, venta en general",
  keywords: [
    "Tecnología",
    "Vehículos",
    "auto partes",
    "Accesorios para computadoras",
    "5slim.do"
  ].join(", ") // Convierte el array de palabras clave en una cadena separada por comas
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/png" href="/favicon.ico"></link>

      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* <Script strategy='afterInteractive' src={`https://www.googletagmanager.com/gtag/js?id=${process?.env?.NEXT_PUBLIC_GA_UID || 'G-2M0NR02RGC'}`} />

        <Script id="google-analytics" strategy="afterInteractive">
          {
            `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process?.env?.NEXT_PUBLIC_GA_UID || 'G-2M0NR02RGC'}');
            `
          }
        </Script> */}
      </head>
      
      <ThemeProv>
        <ToastContainer/>
        <body className={inter.className}>{children}</body>
      </ThemeProv>
    </html>
  );
}
