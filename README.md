# Tiny Template

A frontend template that runs against a **fake backend in the browser**. All data lives in **localStorage** - no real server required. The fake backend is exposed through an **oRPC contract**, which generates the **OpenAPI spec**, **Swagger UI**, and frontend API client.

## Quick Start

```bash
bun install
bun rules:gen
bun dev
```

Open **http://localhost:3000**.

Run `bun rules:gen` before starting any real prototyping work. The generated AI rule files are what Codex, Claude Code, and Cursor read while helping you build the app, so refreshing them first keeps all tools aligned with the latest template conventions.

## Reset seed data

Use **Reset seed data** in the bottom-left of the app (in the root layout) to restore data to the initial seed state. Handy after schema or seed changes that break the current stored data.

## Real backend setup

Tiny development defaults to the in-browser fake backend:

```bash
APP_PUBLIC_API_MODE=fake
APP_PUBLIC_API_URL=http://localhost:4000
```

To run against a Robodev-generated backend on localhost, regenerate the client from the backend OpenAPI file and switch the API mode:

```bash
OPENAPI_INPUT=/absolute/path/to/apps/be/resources/openapi-main.json bun openapi:gen
APP_PUBLIC_API_MODE=real
APP_PUBLIC_API_URL=http://localhost:4000
bun dev
```

`APP_PUBLIC_API_URL` should be the backend origin only. Do not append `/api`; generated endpoints already include the API path.

## AI rules and skills

Shared AI rules and skills live in `.rulesync/`. Treat `.rulesync/` as the source of truth for project guidance, then generate the tool-specific files from it.

```bash
bun rules:gen
bun rules:check
```

Always run `bun rules:gen` before prototyping or handing the project to an AI coding tool. It updates the generated Codex, Claude Code, and Cursor files from the same shared rule set.

Edit `.rulesync/` sources first; do not hand-edit generated tool files unless you are debugging Rulesync output. Use `bun rules:check` in reviews or CI-style checks to confirm generated files are current.

## Releases

Tiny uses Release Please to keep releases separate from ordinary merges to
`main`.

1. Use a [Conventional Commit](https://www.conventionalcommits.org/) title when
   squash-merging a pull request:
   - `fix: ...` produces a patch release.
   - `feat: ...` produces a minor release.
   - `feat!: ...` or a `BREAKING CHANGE:` footer produces a major release.
2. After a releasable change reaches `main`, the `Release` GitHub Actions
   workflow creates or updates the release pull request.
3. Review the generated version bump and `CHANGELOG.md`, then merge the release
   pull request when the changes are ready to ship.
4. The next `Release` workflow run creates the `vX.Y.Z` tag and corresponding
   GitHub Release. Do not create release tags manually.

Commits such as `chore:`, `docs:`, and `test:` do not trigger a release by
themselves and are normally omitted from the generated changelog.

Repository administrators must enable **Settings → Actions → General → Workflow
permissions → Allow GitHub Actions to create and approve pull requests** so the
workflow's `GITHUB_TOKEN` can maintain the release pull request.

## Generated docs

- **Swagger**: http://localhost:3000/api-docs
- **OpenAPI Spec**: http://localhost:3000/api-docs/openapi.json
- **ER diagram**: http://localhost:3000/er-diagram
- **DBML**: http://localhost:3000/api-docs/dbml

The API spec and generated client are derived from `src/orpc`; the ER diagram and DBML are derived from `src/lib/fake-be/store.ts`.
