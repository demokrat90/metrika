import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مشاريع فاخرة جديدة في دبي",
  description: "شقق جديدة للبيع في دبي بأسعار تبدأ من 750,000 درهم إماراتي",
  openGraph: {
    title: "مشاريع فاخرة جديدة في دبي",
    description: "شقق جديدة للبيع في دبي بأسعار تبدأ من 750,000 درهم إماراتي",
    url: "https://metrika.ae/arabic",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/images/logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
