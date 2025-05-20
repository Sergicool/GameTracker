export default function getGenreColor(genre) {
  const stored = localStorage.getItem('gameTrackerData');
  if (!stored) return '#444'; // Default color
  try {
    const parsed = JSON.parse(stored);
    const found = parsed.genres?.find((g) => g.genre === genre);
    return found?.color || '#444';
  } catch (err) {
    return '#444';
  }
}