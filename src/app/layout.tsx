import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hndl",
  description: "Create and edit workflows",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
