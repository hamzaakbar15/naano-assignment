// Mocked "typical reach" stat - deterministic per creator so it doesn't jump
// around on refresh, but not backed by any real LinkedIn analytics (out of
// scope: no real scraping/API integration).
export function estimateReach(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 2000 + (hash % 48000);
}
