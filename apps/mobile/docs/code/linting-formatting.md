# Linting and formatting

It is recommended that you set up your IDE so that it reports linting errors and formats the code on save. This will prevent you from having to fix these issues when comitting the code.

If using VSCode, install the recommended extensions (`.vscode/extensions.json`).

## Formatting

We are using classical Prettier configuration.

## Linting

We are using ESLint. The configuration extends the `eslint-config-universe` config, which is the standard for Expo apps. Some rules are overwritten or disabled to enforce code style and disable rules that appear too strict.

## Why no pre-commit hook?

It's a common practice to introduce a pre-commit hook (using something like Husky) to check for code validity before a commit is made. This is a valid practice, but we believe it is too intrusive and often discourages people to commit regularily. So instead we only check the code on the server, once the PR is ready - this is when it matters that the code looks good.

## Template instructions

- Feel free to change linting or formatting rules to your liking, but unless you have a specific reason to do so, we suggest you stick with the defaults.
