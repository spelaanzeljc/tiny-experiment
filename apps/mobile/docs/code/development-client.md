# Development client

The template uses Expo Go intentionally, in order to ease the process of maintaining the template.

However, when you use the template to start a project, you will eventually need to add a third-party NPM package to a React Native app.

This is where the [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/) (expo-dev-client) comes in. Development builds allow you to use any external package while still working in the fully managed Expo workflow. This is a large topic, but the most important one to understand.

## How to create a new development client build?

Think of Development client as your own custom Expo Go application with all the added native packages baked in.

The easiest way to build development clients is on the EAS platform. Follow [this guide](https://docs.expo.dev/develop/development-builds/create-a-build/) to set up `eas.json` file and then just download and install the build artifacts on either iOS simulator, Android emulator or Android device.

If you want to run development client build on iOS physical device, it requires some additional configuration (creating device, registering device and provisioning your ad hoc profile).

Sign in in both Expo CLI locally and in the dev client app on the device/simulator. This will help you to find the development server more easily.

## When to rebuild the development client?

You'll need to rebuild the Expo development build on EAS when adding a new NPM package. We recommend setting up a separate branch that you can push to and it will generate three builds (iOS simulator, iOS device and Android).

## Building the development client locally?

You can also run EAS builds locally in order to save on the number of the builds on EAS or to speed up builds. The guide is described in detail [here](https://docs.expo.dev/build-reference/local-builds/).

## Template instructions

- Contact the maintainer of the template if you need help with development client. There is almost no reason to eject from Expo anymore. If you have `ios` and `android` folders in the project, consider deleting them and regenerating them from Expo project and follow the [CNG](https://docs.expo.dev/workflow/continuous-native-generation/) pattern.
