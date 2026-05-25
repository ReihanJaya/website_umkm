import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Dapur Nusantara | Sistem Pemesanan Modern",
  description: "Pesan makanan lebih mudah dengan QR Code meja dan pembayaran QRIS",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#FF6B35',
                secondary: '#fff',
              },
            },
          }}
        />
        </CartProvider>
      </body>
    </html>
  );
}
