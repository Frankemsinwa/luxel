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
        className={`${plusJakartaSans.variable} ${newtonScient.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
