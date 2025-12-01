import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/AuthStore";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateRoute } from "@/lib/utils";
import QueryProvider from "@/store/QueryStore";
import { ErrorProvider } from "@/store/ErrorStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Application",
  description: "This is a demo project for a dashboard application.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ErrorProvider>{children}</ErrorProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
