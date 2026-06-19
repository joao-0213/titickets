import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Titickets - Plataforma Minimalista de Venda de Ingressos",
  description: "Descubra e garanta seu lugar nos melhores shows, conferências, peças de teatro e workshops com uma nova experiência de compra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
