import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";

export const metadata: Metadata = {
  title: "Chat Room",
  description: "Chat Room App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
