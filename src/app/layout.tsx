import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Green Pyramid",
  description: "Grow Smarter. Grow More.",
  icons: {
    icon: '/images/logo-gp-round.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        {children}
      </body>
    </html>
  );
}
