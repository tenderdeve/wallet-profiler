import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Wallet Profiler',
  description: 'On-chain activity feed and analytics for any Ethereum wallet',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="antialiased min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
