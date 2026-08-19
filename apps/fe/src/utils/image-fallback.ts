interface ImageFallbackOptions {
  width: number;
  height: number;
  text?: string;
}

export function getFallbackImageUrl({ width, height, text = "No image" }: ImageFallbackOptions): string {
  return `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;
}
