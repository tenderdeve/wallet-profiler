import './globals.css';

export const metadata = {
  title: 'Wallet Profiler',
  description: 'On-chain activity feed and analytics for any Ethereum wallet',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
