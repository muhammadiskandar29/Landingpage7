import type { Metadata } from "next";
import { Playfair_Display, Inter, Pacifico } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "Ria Florist | Jasa Papan Bunga Premium Jakarta",
  description: "Papan bunga elegan dan berkualitas tinggi untuk segala acara dengan pengiriman profesional di Jakarta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
