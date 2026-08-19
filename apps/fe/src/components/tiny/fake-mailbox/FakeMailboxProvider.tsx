import { Confirmation, Drawer, IconButton, Typography } from "@povio/ui";
import { MailIcon, X } from "lucide-react";
import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { MailMessageDetail } from "@/components/tiny/fake-mailbox/MailMessageDetail";
import { MailMessageList } from "@/components/tiny/fake-mailbox/MailMessageList";
import { openMailPopup } from "@/components/tiny/fake-mailbox/mail-popup";
import { AppConfig } from "@/config/app.config";
import type { Mail } from "~/db/tables/mail/mail.schema";
import { fakeMailboxBrowserClient } from "~/mail/browser-mailbox";

export function FakeMailboxProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { confirm } = Confirmation.useConfirmation();
  const [mails, setMails] = useState<Mail[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const updateMail = useCallback((updated: Mail) => {
    setMails((current) => current.map((mail) => (mail.id === updated.id ? updated : mail)));
  }, []);

  const markRead = useCallback(
    async (mail: Mail) => {
      const updated = await fakeMailboxBrowserClient.markRead(mail.id);
      if (updated) {
        updateMail(updated);
      }
    },
    [updateMail],
  );

  const openPopup = useCallback(
    async (mail: Mail) => {
      const popup = openMailPopup(mail);
      if (popup) {
        await markRead(mail);
        return;
      }

      const shouldOpen = await confirm({
        heading: t(($) => $.shared.fakeMailbox.popupBlocked.heading),
        description: t(($) => $.shared.fakeMailbox.popupBlocked.description),
        confirmLabel: t(($) => $.shared.fakeMailbox.popupBlocked.open),
        cancelLabel: t(($) => $.shared.fakeMailbox.popupBlocked.cancel),
      });
      if (shouldOpen && openMailPopup(mail)) {
        await markRead(mail);
      }
    },
    [confirm, markRead, t],
  );

  useEffect(() => {
    if (!AppConfig.api.useFakeBackend) {
      return;
    }
    void (async () => {
      const stored = await fakeMailboxBrowserClient.list();
      setMails(stored);
      setSelectedId(stored[0]?.id);
    })();
    return fakeMailboxBrowserClient.subscribe((mail) => {
      setMails((current) => [mail, ...current.filter((item) => item.id !== mail.id)]);
      setSelectedId(mail.id);
      void openPopup(mail);
    });
  }, [openPopup]);

  const selectedMail = useMemo(() => mails.find((mail) => mail.id === selectedId), [mails, selectedId]);
  const unreadCount = mails.filter((mail) => !mail.readAt).length;

  if (!AppConfig.api.useFakeBackend) {
    return children;
  }

  return (
    <>
      {children}
      <div className="fixed right-6 bottom-24 z-[9999] rounded-full shadow-lg">
        <Drawer
          label={t(($) => $.shared.fakeMailbox.title)}
          trigger={
            <IconButton
              color="primary"
              icon={MailIcon}
              label={t(($) => $.shared.fakeMailbox.open)}
              size="s"
              variant="contained"
            />
          }
        >
          {(close) => (
            <div className="flex h-dvh w-[min(56rem,95vw)] flex-col bg-elevation-fill-default-1">
              <div className="flex items-center justify-between border-elevation-outline-default-1 border-b p-5">
                <Typography
                  as="h1"
                  size="title-3"
                >
                  {t(($) => $.shared.fakeMailbox.title)}
                </Typography>
                <IconButton
                  icon={X}
                  label={t(($) => $.shared.fakeMailbox.close)}
                  size="xs"
                  variant="ghost"
                  onPress={close}
                />
              </div>
              <div className="flex min-h-0 flex-1">
                <MailMessageList
                  mails={mails}
                  selectedId={selectedId}
                  onSelect={(mail) => {
                    setSelectedId(mail.id);
                    void markRead(mail);
                  }}
                />
                {selectedMail ? (
                  <MailMessageDetail mail={selectedMail} />
                ) : (
                  <Typography
                    className="p-5"
                    size="body-2"
                  >
                    {t(($) => $.shared.fakeMailbox.empty)}
                  </Typography>
                )}
              </div>
            </div>
          )}
        </Drawer>
        {unreadCount > 0 && (
          <span className="pointer-events-none absolute -top-2 -right-2 min-w-5 rounded-full bg-interactive-contained-primary-idle px-1.5 py-0.5 text-center text-xs text-text-inverse-1">
            {unreadCount}
          </span>
        )}
      </div>
    </>
  );
}
