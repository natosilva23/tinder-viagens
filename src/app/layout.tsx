import type { Metadata } from "next";
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";
import "@fontsource/inter";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "MeetTrip - Conecte-se com viajantes",
  description: "Encontre viajantes que vão para o mesmo destino e transforme sua viagem em uma experiência inesquecível",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-inter antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
