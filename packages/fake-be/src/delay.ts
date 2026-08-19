/**
 * Simulates API latency for the fake backend.
 * Makes the fake store feel more like a real API.
 */

export const FAKE_API_DELAY_MS = 50;

export function fakeApiDelay(): Promise<void> {
  // eslint-disable-next-line promise/avoid-new -- setTimeout has no promise-based API in browser
  return new Promise((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));
}
