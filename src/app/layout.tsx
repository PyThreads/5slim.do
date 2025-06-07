import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "5slim.do",
  description: "Los mejores precios online en Republica Dominicana, venta en general",
  keywords: [
    "Tecnología",
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
      <link rel="icon" type="image/png" href="/flash-lines copy.ico"></link>

      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD7Ma19YzVnx-a4KxPNyWfNqyrTLWqUlxI&libraries=places`}
          strategy="beforeInteractive"
        />

      </head>
      <body className={inter.className}>{children}</body>


    </html>
  );
}