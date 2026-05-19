import type { Metadata } from "next";
import { Lexend, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arena.PE",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", lexendSans.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
