# Fonts

We use [Font optimization](https://docs.expo.dev/versions/latest/sdk/font/) from Expo to import fonts, because it is performant and simple. Fonts are imported in `assets/fonts` (one font type per file), which is then used inside the `restyleTheme.ts` file.

Note that we are using the runtime config with `useFonts`, as customizing the fonts with Config Plugin would require a custom development client. This is fine for the project, but we want to stay in the Expo Go environment for the template.

## Template instructions

- Add the fonts you want to use in `assets/fonts` and cross-check that variable names are the same as in `restyleTheme.ts`. If using the theme generator, you should do this after generating the theme.
