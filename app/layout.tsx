import type { Metadata } from "next";
import ClientProviders from "@/context/client-providers";
// @ts-ignore
import "./globals.css";
import Script from "next/script";

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
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />

        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
