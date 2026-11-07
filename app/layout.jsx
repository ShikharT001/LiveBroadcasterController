import './globals.css';

export const metadata = {
  title: 'Live Broadcast Controller | Sports Graphics & OBS Integration',
  description: 'Professional sports broadcast controller and real-time OBS graphics management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-broadcast-dark text-slate-100 min-h-screen antialiased selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
