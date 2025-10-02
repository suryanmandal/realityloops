import type { Metadata } from "next";
// @ts-ignore: CSS side-effect import type declarations not found
import "./globals.css";

export const metadata: Metadata = {
    title: "AR-VR | Reality loops",
    description: "Augmented Reality and Virtual Reality development services",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`p-0 m-0`}
            >
                {children}
            </body>
        </html>
    );
}
