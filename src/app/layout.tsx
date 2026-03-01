import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const newtonScient = localFont({
  src: "../../public/fonts/NewtonScient.ttf",
  variable: "--font-newton-scient",
});

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Satoshi-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Satoshi-MediumItalic.otf", weight: "500", style: "italic" },
  ],
  variable: "--font-satoshi",
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
        className={`${plusJakartaSans.variable} ${newtonScient.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
