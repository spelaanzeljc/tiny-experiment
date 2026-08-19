# Configuration

## Basics

We are leveraging the Expo environment variables and Expo Application Services (EAS) to build and deploy our apps to different environments.

### App configuration

[ExpoConfig](https://docs.expo.dev/versions/latest/config/app/) is a configuration object in the `app.config.ts` file on the root of the project, where you can change any project related configuration.

### Environment variables

The variables are defined in a standard `.env` file. These variables can be accessed with `process.env.EXPO_PUBLIC_API_URL`. Make sure to prefix the variable with EXPO_PUBLIC\* if you want to use it directly in the app. Public variables can be accessed by the user and thus should not be secrets. The `.env` file will be used when running the app locally.

When you are building with EAS (staging/production environment), we are adding variables to the env property for the EAS profile (staging, production...) in the eas.json file.

App secrets like Sentry API key, NPM token and similiar can be added to the EAS Secrets part on the EAS dashboard. These secrets will be used during the build process.

## Deployment

### Github CI

The template comes with a few predefined actions which can be used to automate EAS bulds and GooglePlay/AppStore submissions.

To use any of the predefined actions, you must first add `EXPO_TOKEN` as a repository secret. Detailed instructions about obtaining and adding the token are available [here](https://docs.expo.dev/eas-update/github-actions/).

### Expo Application Services (EAS)

Follow the next steps to configure EAS in your project:

- Install the latest EAS CLI `npm install -g eas-cli`

- Log in to your Expo account with `eas login`. You should be invited to the client's EAS account.

- Update app.config.ts to match your project. Fields that you usually need to update are: `name, slug, ios.bundleIdentifier, android.package`. Configure the project with `eas build:configure`. Since the template uses dynamic app configuration, you will be prompted to manually add projectId in your app.config.ts.

- Run `eas build`. This is an interactive command that will generate a Android Keystore if one is required and will prompt you to login to your Apple Developer Account in order to generate all necessary certificates (Make sure the account you are using has the required permissions to generate certificates and provisioning profiles).

We suggest the clients to upgrade to the EAS Production plan, which includes concurent builds and better support.

## Template instructions

- Determine which environments you want to use for the app.
- Change the configuration to match your app. Remove unneeded environments and variables (if you don't yet know all of these variables, come back to this later when you go through the whole documentation).
- If you are using different CI than `.github`, remove the folder and configure your own CI. Consider making a PR to this repo with your findings.
