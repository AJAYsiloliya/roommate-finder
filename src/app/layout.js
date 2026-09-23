import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Presence from "@/components/Presence";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "RoommateFinder",
    template: "%s | RoommateFinder",
  },

  description:
    "Find roommates and flatmates based on location, budget, lifestyle, and daily preferences.",

  keywords: [
    "roommate finder",
    "find roommates",
    "find flatmates",
    "flatmate finder",
    "roommate matching",
    "shared accommodation",
    "roommate in India",
  ],

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900`}
      >
        <Presence />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}