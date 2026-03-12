import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalPageTransition from "@/components/ConditionalPageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMaster - Organize Your Tasks Effortlessly",
  description: "A beautiful and intuitive task management application to help you organize your daily tasks and boost your productivity.",
  keywords: ["task management", "todo list", "productivity", "organization", "goals", "daily tasks"],
  authors: [{ name: "Aakarsh Tiwari" }],
  openGraph: {
    title: "TaskMaster - Beautiful Task Management",
    description: "Organize your tasks with style and boost your productivity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskMaster - Beautiful Task Management",
    description: "Organize your tasks with style and boost your productivity",
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
        <ConditionalPageTransition>
          {children}
        </ConditionalPageTransition>
        <Toaster />
      </body>
    </html>
  );
}
