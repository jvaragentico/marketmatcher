import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShipMates — The Dev × Creator Matchmaker Platform",
  description:
    "ShipMates connects independent developers with content creators for technical partnerships. Match scores on skills, niche, budget and time zone — where generic freelance platforms have a <3% success rate.",
  keywords: ["developer creator matchmaker", "creator economy", "indie hackers", "freelance developers", "content creators", "technical partnerships", "SaaS marketplace"],
  authors: [{ name: "ShipMates" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ShipMates — Indie devs and creators, ship together",
    description: "The vertical matchmaker for the creator economy. Skills, niche, budget, time zone — matched.",
    url: "https://chat.z.ai",
    siteName: "ShipMates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipMates — The Dev × Creator Matchmaker",
    description: "Where indie devs and content creators ship together.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
