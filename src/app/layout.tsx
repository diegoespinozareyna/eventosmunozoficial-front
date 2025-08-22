import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Apis } from "./configs/proyecto/proyectCurrent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(`https://${Apis.PROYECTCURRENT_NAMEDOMINIO2}.inmunoz.com`), // Aquí colocas tu dominio
  // metadataBase: new URL('http://localhost:3000'), // Aquí colocas tu dominio
  title: "EVENTOS BIENES RAICES",
  description: Apis.NAME_PROYECT,
  openGraph: {
    title: "EVENTOS BIENES RAICES",
    description: Apis.NAME_PROYECT,
    // url: 'https://inmobackend.site',
    url: `https://${Apis.PROYECTCURRENT_NAMEDOMINIO2}.inmunoz.com`,
    type: 'website',
    images: [
      {
        url: "https://serverimages.inmobackend.site/uploads/1747085430914-LOGOMU%C3%83%C2%91OZ.png"
        , // Next.js ahora resolverá automáticamente la URL completa
        width: 1200,
        height: 630,
        alt: 'Vista previa de Eventos Muñoz Oficial'
      }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="font-sans grid grid-cols-1 justify-center items-center min-h-screen p-0 gap-16">
          {children}
        </div>
      </body>
    </html>
  );
}
