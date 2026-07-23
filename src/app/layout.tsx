import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import BookingTrackerWidget from "@/components/BookingTrackerWidget";
import ConciergeChatFab from "@/components/ConciergeChatFab";

const newtonScient = localFont({
  src: "../../public/fonts/NewtonScient.ttf",
  variable: "--font-newton-scient",
  display: 'swap',
});

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/Satoshi-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-MediumItalic.otf", weight: "500", style: "italic" },
  ],
  variable: "--font-satoshi-font",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Luxel",
  description: "Premium airline booking experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newtonScient.variable} ${satoshi.variable} antialiased`}
      >
        {children}
        <CookieConsentBanner />
        <BookingTrackerWidget />
        <ConciergeChatFab />
      </body>
    </html>
  );
}
