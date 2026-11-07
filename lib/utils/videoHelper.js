// Helper to convert standard video and YouTube links into clean, broadcast-ready embed URLs

export function getEmbedVideoUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already an embed URL
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // YouTube live format: https://www.youtube.com/live/oNRfODgAXvA
  const ytLiveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
  if (ytLiveMatch && ytLiveMatch[1]) {
    const id = ytLiveMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`;
  }

  // YouTube watch format: https://www.youtube.com/watch?v=oNRfODgAXvA
  const ytWatchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const id = ytWatchMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`;
  }

  // YouTube short format: https://youtu.be/oNRfODgAXvA
  const ytShortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShortMatch && ytShortMatch[1]) {
    const id = ytShortMatch[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`;
  }

  // Direct MP4 or iframe URL
  return trimmed;
}

export function isDirectVideoFile(url) {
  if (!url) return false;
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.m3u8') || url.endsWith('.mov');
}
