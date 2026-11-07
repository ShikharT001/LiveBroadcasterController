export const metadata = {
  title: 'Broadcast Overlay | 1920x1080 OBS Browser Source',
  description: 'Real-time transparent broadcast graphics overlay for OBS Studio.',
};

export default function OverlayLayout({ children }) {
  return (
    <div className="w-[1920px] h-[1080px] bg-transparent m-0 p-0 overflow-hidden select-none">
      {children}
    </div>
  );
}
