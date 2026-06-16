import type { Metadata } from "next";
import ClientProviders from "@/context/client-providers";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "AR/VR Marketplace",
  description: "Reality Loop – immersive creator marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#e6e7e9] text-gray-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
