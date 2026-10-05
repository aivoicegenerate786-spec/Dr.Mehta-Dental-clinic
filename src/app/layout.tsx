import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.drmehtasdentalcare.com"),
  title: "Dr. Mehta's Dental Care | Smile Design and Dental Implants in Maninagar, Ahmedabad",
  description:
    "Trusted by 20,000+ patients since 2012. Smile design, dental implants, root canal treatment, aligners and family dentistry in Maninagar, Ahmedabad. Book your visit online in under a minute.",
  icons: { icon: "/img/logo-mark.webp" },
  openGraph: {
    title: "Dr. Mehta's Dental Care, Maninagar, Ahmedabad",
    description: "Smile design, implants and family dentistry since 2012. Book online.",
    images: ["/img/clinic-exterior.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e0d",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Dr. Mehta's Dental Care",
  telephone: "+919428563659",
  email: "drmehtasdentalcare12@gmail.com",
  foundingDate: "2012",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/106 Janpath Society, Ghodasar Canal Garden Road, near Aavkar Hall, Maninagar",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380050",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
  ],
  sameAs: ["https://www.instagram.com/drmehtadentalcare", "https://www.facebook.com/drmehtadentalcare"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${geist.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
