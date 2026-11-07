import { HeaderStatusBar } from '@/components/dashboard/HeaderStatusBar';

export default function DashboardLayout({ children }) {
  // Current active match placeholder or fetcher
  const defaultMatch = {
    id: 'volleyball-match-1',
    sport: 'volleyball',
    status: 'live',
    team_a: { name: 'Thunder Volley', short_code: 'THU', color: '#dc2626' },
    team_b: { name: 'Cyclone Spikers', short_code: 'CYC', color: '#2563eb' },
  };

  return (
    <div className="min-h-screen bg-broadcast-dark flex flex-col">
      <HeaderStatusBar currentMatch={defaultMatch} />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-6 text-center text-xs text-slate-500">
        Live Broadcast Controller &bull; Sports Graphics &bull; OBS Studio Bridge Companion &bull; Full HD 1920&times;1080 Overlay
      </footer>
    </div>
  );
}
