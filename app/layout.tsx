import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  title: "Арабский Михаил — Product Manager",
  description: "Junior/Middle Product Manager (0→1, MVP, B2B SaaS) с опытом запуска продуктов с нуля, проведения CustDev и управления кросс-функциональными командами.",
  authors: [{ name: "Арабский Михаил" }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Арабский Михаил — Product Manager",
    description: "Product Manager с опытом запуска B2B SaaS продуктов с нуля и быстрого вывода на рынок.",
    url: "https://michaelpm.ru",
    siteName: "Арабский Михаил — Портфолио",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Арабский Михаил — Product Manager",
    description: "Product Manager с опытом запуска B2B SaaS продуктов с нуля и быстрого вывода на рынок.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
