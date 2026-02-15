import Header from "@/components/Header/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Providers from "./providers";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopSphere",
  description: "Ecommerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <AuthProvider>
            <Header />
            <main className="container">
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
