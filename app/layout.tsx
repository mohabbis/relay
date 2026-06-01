import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relay',
  description: 'Temporary collaboration sessions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>{children}</body>
    </html>
  );
}