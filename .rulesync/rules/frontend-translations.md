---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend translation key structure and no-hardcoded-text conventions."
globs: ["apps/fe/src/**/*.{ts,tsx,json}"]
cursor:
  alwaysApply: false
  description: "Apply when adding or changing frontend user-facing text, locale files, or translation keys."
  globs: ["apps/fe/src/**/*.{ts,tsx,json}"]
---

# Frontend Translations

Do not hardcode user-facing frontend text. Add copy to locale files and access it through `useTranslation`.

Exception: `apps/fe/src/pages/(public)/code-examples/*` is a temporary Povio UI showcase for template authors and AI agents. These pages intentionally use literal example text instead of translation keys and should stay available as reference examples unless the prototype/demo layer is intentionally removed.

Translation key structure should generally follow the feature/component tree. The planets feature is the current reference example:

- `planets.page.*`
- `planets.views.*`
- `planets.filters.*`
- `planets.createModal.*`
- `planets.editModal.*`
- `planets.table.*`
- `planets.detail.*`

When Slovenian translations are required, preserve real Slovenian characters with carons, especially Unicode `U+0161`, `U+010D`, and `U+017E`. Do not leave mojibake or replacement-character artifacts in locale files.
