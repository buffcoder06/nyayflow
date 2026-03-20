import type { Metadata } from "next";
import MarketingNavbar from "@/components/marketing/marketing-navbar";
import MarketingFooter from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: {
    default: "NyayVakil – Legal Practice Manager for Indian Advocates",
    template: "%s | NyayVakil",
  },
  description:
    "Modern legal practice management software built for Indian advocates and law firms. Manage cases, hearings, fees, clients, documents, and tasks — all in one place.",
  keywords: [
    "legal practice management",
    "advocate software",
    "law firm management",
    "case management India",
    "court diary",
    "legal software India",
    "lawyer app",
    "NyayVakil",
  ],
  authors: [{ name: "NyayVakil" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "NyayVakil",
    title: "NyayVakil – Legal Practice Manager for Indian Advocates",
    description:
      "Modern legal practice management software built for Indian advocates and law firms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NyayVakil – Legal Practice Manager for Indian Advocates",
    description:
      "Modern legal practice management software built for Indian advocates and law firms.",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
