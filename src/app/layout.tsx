import { Inter } from "next/font/google";
import "./globals.css";

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
      <link rel="icon" type="image/png" href="/flash-lines copy.ico"></link>

      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}