import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repostajes",
  description: "Registro de repostajes de empleados",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              ⛽ Repostajes
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">
                Nuevo
              </Link>
              <Link href="/repostajes" className="hover:underline">
                Histórico
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
