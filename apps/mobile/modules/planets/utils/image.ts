export function getFallbackImageUrl(id = "planet"): string {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/960/540`;
}
