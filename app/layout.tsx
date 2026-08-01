import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';
export const metadata: Metadata = { title:'SAM-2026 Certificate Portal', description:'Certificate issuance portal for SAM-2026' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="min-h-screen font-sans"><ToastProvider />{children}</body></html>}
