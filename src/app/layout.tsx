import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { CanvasStage } from "@/components/three/CanvasStage";
import { SceneRouter } from "@/components/three/SceneRouter";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Trinix Pvt. Ltd.",
  description:
    "Scaffold for Trinix Pvt. Ltd. website: Futuristic Vedic AI • Quantum Computing • Kubernetes.",
  icons: {
    icon: "/trinix-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} antialiased bg-cosmic-black/80 text-slate-100`}>
        <ThemeProvider>
          <CanvasStage>
            <SceneRouter />
          </CanvasStage>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="relative flex-1 overflow-hidden">
              {children}
            </main>
            <Footer />
          </div>
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
