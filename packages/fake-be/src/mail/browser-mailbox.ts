import type { Mail } from "~/db/tables/mail/mail.schema";
import { mailService } from "~/mail/mail.service";

type BrowserMailListener = (mail: Mail) => void;

const listeners = new Set<BrowserMailListener>();
let isInstalled = false;

export function installFakeMailboxBrowserBridge(): void {
  if (isInstalled || typeof window === "undefined") {
    return;
  }

  mailService.subscribe((mail) => {
    for (const listener of listeners) {
      listener(mail);
    }
  });
  isInstalled = true;
}

function subscribe(listener: BrowserMailListener): () => void {
  installFakeMailboxBrowserBridge();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const fakeMailboxBrowserClient = {
  list: mailService.list,
  markRead: mailService.markRead,
  subscribe,
};
