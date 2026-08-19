import type { Mail } from "~/db/tables/mail/mail.schema";

function formatAddress(address: Mail["from"]): string {
  return address.name ? `${address.name} <${address.email}>` : address.email;
}

export function openMailPopup(mail: Mail): Window | null {
  const popup = window.open("", "_blank", "popup=yes,width=760,height=680,resizable=yes,scrollbars=yes");
  if (!popup) {
    return null;
  }

  popup.document.title = mail.subject;
  popup.document.documentElement.lang = document.documentElement.lang || "en";
  popup.document.body.replaceChildren();
  Object.assign(popup.document.body.style, {
    margin: "0",
    background: "#f5f5f5",
    color: "#171717",
    fontFamily: "system-ui, sans-serif",
  });

  const header = popup.document.createElement("header");
  Object.assign(header.style, { padding: "24px", background: "white", borderBottom: "1px solid #ddd" });
  const heading = popup.document.createElement("h1");
  Object.assign(heading.style, { margin: "0 0 16px", fontSize: "24px" });
  heading.textContent = mail.subject;
  header.append(heading);

  const metadata = popup.document.createElement("div");
  metadata.style.whiteSpace = "pre-wrap";
  metadata.style.fontSize = "14px";
  metadata.textContent = `From: ${formatAddress(mail.from)}\nTo: ${mail.to.map(formatAddress).join(", ")}`;
  header.append(metadata);

  const content = popup.document.createElement("main");
  Object.assign(content.style, { margin: "24px", padding: "24px", background: "white" });
  if (mail.html) {
    const frame = popup.document.createElement("iframe");
    frame.setAttribute("sandbox", "");
    frame.setAttribute("title", mail.subject);
    frame.srcdoc = mail.html;
    Object.assign(frame.style, { width: "100%", minHeight: "420px", border: "0" });
    content.append(frame);
  } else {
    const text = popup.document.createElement("pre");
    Object.assign(text.style, { margin: "0", whiteSpace: "pre-wrap", font: "inherit" });
    text.textContent = mail.text;
    content.append(text);
  }

  popup.document.body.append(header, content);
  return popup;
}
