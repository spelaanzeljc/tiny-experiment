import { Button, Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

import { openMailPopup } from "@/components/tiny/fake-mailbox/mail-popup";
import type { Mail } from "~/db/tables/mail/mail.schema";

interface Props {
  mail: Mail;
}

function formatAddresses(addresses: Mail["to"]): string {
  return addresses.map((address) => (address.name ? `${address.name} <${address.email}>` : address.email)).join(", ");
}

export function MailMessageDetail({ mail }: Props) {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <Typography
          as="h2"
          size="title-4"
        >
          {mail.subject}
        </Typography>
        <Button
          size="s"
          variant="outlined"
          onPress={() => openMailPopup(mail)}
        >
          {t(($) => $.shared.fakeMailbox.openPopup)}
        </Button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-text-default-2">
        <dt>{t(($) => $.shared.fakeMailbox.from)}</dt>
        <dd>{formatAddresses([mail.from])}</dd>
        <dt>{t(($) => $.shared.fakeMailbox.to)}</dt>
        <dd>{formatAddresses(mail.to)}</dd>
        {mail.cc.length > 0 && (
          <>
            <dt>{t(($) => $.shared.fakeMailbox.cc)}</dt>
            <dd>{formatAddresses(mail.cc)}</dd>
          </>
        )}
        {mail.bcc.length > 0 && (
          <>
            <dt>{t(($) => $.shared.fakeMailbox.bcc)}</dt>
            <dd>{formatAddresses(mail.bcc)}</dd>
          </>
        )}
        {mail.replyTo && (
          <>
            <dt>{t(($) => $.shared.fakeMailbox.replyTo)}</dt>
            <dd>{formatAddresses([mail.replyTo])}</dd>
          </>
        )}
      </dl>
      {mail.html ? (
        <iframe
          className="min-h-80 flex-1 border-elevation-outline-default-1 border"
          sandbox=""
          srcDoc={mail.html}
          title={mail.subject}
        />
      ) : (
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap border-elevation-outline-default-1 border p-4 font-primary text-sm">
          {mail.text}
        </pre>
      )}
    </section>
  );
}
