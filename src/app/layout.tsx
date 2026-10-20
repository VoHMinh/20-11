import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gửi bé, với tất cả yêu thương · 20/10",
  description: "Hoa cho bé, ảnh của tụi mình và mấy lời anh muốn nói. 20/10 vui thật vui nha bé.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/flower.webp" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
