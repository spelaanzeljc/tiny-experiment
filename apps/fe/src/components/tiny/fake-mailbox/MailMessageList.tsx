import { Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

import type { Mail } from "~/db/tables/mail/mail.schema";

interface Props {
  mails: Mail[];
  selectedId?: string;
  onSelect: (mail: Mail) => void;
}

export function MailMessageList({ mails, selectedId, onSelect }: Props) {
  const { t } = useTranslation();
  if (mails.length === 0) {
    return (
      <Typography
        className="p-5 text-text-default-2"
        size="body-2"
      >
        {t(($) => $.shared.fakeMailbox.empty)}
      </Typography>
    );
  }

  return (
    <ul className="w-72 shrink-0 overflow-auto border-elevation-outline-default-1 border-r">
      {mails.map((mail) => (
        <li
          key={mail.id}
          className="border-elevation-outline-default-1 border-b"
        >
          <button
            className={`w-full p-4 text-left ${selectedId === mail.id ? "bg-elevation-fill-default-2" : "bg-elevation-fill-default-1"}`}
            onClick={() => onSelect(mail)}
            type="button"
          >
            <span className={`block truncate text-sm ${mail.readAt ? "font-normal" : "font-semibold"}`}>
              {mail.subject}
            </span>
            <span className="mt-1 block truncate text-xs text-text-default-2">
              {mail.to.map((item) => item.email).join(", ")}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
