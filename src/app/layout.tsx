import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID;

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
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
        {ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ADS_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
