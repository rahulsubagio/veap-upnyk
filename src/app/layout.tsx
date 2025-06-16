import type { Metadata } from "next";
import "../styles/globals.css";
import { Inter, Poppins } from 'next/font/google';
// import { AOSInitializer } from "@veap/components/AOSInitializer";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

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
    <html lang="id" className={`${poppins.variable} ${inter.variable} scroll-smooth`}>
      <body>
        {/* <AOSInitializer /> */}
        {children}
      </body>
    </html>
  );
}
