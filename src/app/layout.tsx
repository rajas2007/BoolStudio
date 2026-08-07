import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BoolStudio | Interactive Boolean Algebra & Logic Circuit Engine',
  description: 'Visualize Boolean expressions, generate truth tables, build logic gate circuits, solve Karnaugh Maps, and simplify logic equations step-by-step.',
  keywords: ['Boolean Algebra', 'Logic Gates', 'Truth Table', 'Karnaugh Map', 'K-Map', 'Circuit Visualizer', 'Digital Logic'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
